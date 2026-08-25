/**
 * React Native WebView Bridge
 * 
 * This file sets up a robust, typed 2-way communication bridge between
 * the HTML5 game and the React Native application hosting it.
 * Includes a resilient outgoing event queue with force-flush mechanism
 * for instantaneous click event dispatching in multiplayer mode.
 */

export interface BridgeEvent {
  id: string;
  type: string;
  value: any;
  timestamp: number;
}

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(msg: string): void;
    };
    sendEvent: (type: string, value?: any) => void;
    queueOutgoingEvent: (type: string, value?: any) => void;
    forceFlushOutgoingEvents: () => void;
    flushSocketQueue?: () => void;
  }
}

// Outgoing event buffer for lossless transmission
const outgoingQueue: BridgeEvent[] = [];
let isFlushing = false;

/**
 * Enqueue an outgoing bridge event and attempt immediate flush.
 */
export function queueOutgoingEvent(type: string, value: any = null): void {
  const event: BridgeEvent = {
    id: 'evt_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
    type,
    value,
    timestamp: Date.now()
  };

  outgoingQueue.push(event);
  forceFlushOutgoingEvents();
}

/**
 * Force-flush all queued outgoing events to React Native WebView & Socket queue.
 * Clears turn-locking flags on the local client if it is currently the user's turn.
 */
export function forceFlushOutgoingEvents(): void {
  if (isFlushing) return;
  isFlushing = true;

  try {
    // 1. Drain and dispatch all queued bridge events
    while (outgoingQueue.length > 0) {
      const event = outgoingQueue.shift();
      if (!event) break;

      try {
        const payload = JSON.stringify(event);
        if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
          window.ReactNativeWebView.postMessage(payload);
        } else {
          // Local/Web fallback
          console.debug('[Bridge] Dispatched event:', event.type, event.value);
        }
      } catch (err) {
        console.error('[Bridge] Failed to postMessage for event:', event, err);
      }
    }

    // 2. Flush pending socket action queue if registered
    if (typeof window.flushSocketQueue === 'function') {
      window.flushSocketQueue();
    }

    // 3. Self-healing UI event loop unlock for local human player
    const gData = (window as any).gameData;
    const sData = (window as any).socketData;
    const checkIsPlayerFn = (window as any).checkIsPlayer;

    if (gData && gData.turn) {
      const isOnline = sData && sData.online;
      const isMyTurn = isOnline
        ? (typeof checkIsPlayerFn === 'function' ? checkIsPlayerFn(gData.player) : (gData.player === sData.gameIndex))
        : (gData.player === 0);

      if (isMyTurn) {
        // Guarantee click responsiveness on local user's turn
        gData.turn.action = true;
        gData.turn.animating = false;
      }
    }

    // 4. Force a CreateJS stage render tick if available
    const stage = (window as any).stage;
    if (stage && typeof stage.update === 'function') {
      stage.update();
    }
  } catch (err) {
    console.error('[Bridge] Error in forceFlushOutgoingEvents:', err);
  } finally {
    isFlushing = false;
  }
}

/**
 * Standard sendToReactNative function (backward-compatible)
 */
export function sendToReactNative(type: string, value: any = null): void {
  queueOutgoingEvent(type, value);
}

// Bind to window globals
window.sendEvent = sendToReactNative;
window.queueOutgoingEvent = queueOutgoingEvent;
window.forceFlushOutgoingEvents = forceFlushOutgoingEvents;

/**
 * Handling incoming messages from React Native or parent window
 */
function handleIncomingMessage(data: any) {
  console.log('[Bridge] Received from host:', data);
  if (!data || !data.type) return;

  switch (data.type) {
    case 'PAUSE_GAME':
      if (typeof (window as any).stopGame === 'function') {
        (window as any).stopGame();
      }
      break;

    case 'RESUME_GAME':
      if (typeof (window as any).resumeGame === 'function') {
        (window as any).resumeGame();
      }
      break;

    case 'FORCE_FLUSH':
      forceFlushOutgoingEvents();
      break;

    case 'GAME_ACTION':
    case 'TRIGGER_ACTION':
      if (data.action && typeof (window as any).postSocketUpdate === 'function') {
        (window as any).postSocketUpdate(data.action, data.payload, data.broadcast);
      } else if (data.serverAction && typeof (window as any).emitServerAction === 'function') {
        (window as any).emitServerAction(data.serverAction, data.payload || {});
      }
      forceFlushOutgoingEvents();
      break;

    case 'CLICK_CARD':
      if (typeof data.cardIndex === 'number' && (window as any).$ && (window as any).$.cards) {
        const cardObj = (window as any).$.cards[data.cardIndex];
        if (cardObj && typeof cardObj.dispatchEvent === 'function') {
          cardObj.dispatchEvent(new (window as any).createjs.MouseEvent('click', true, true, 0, 0, null, 0, 0, 0));
        }
      }
      break;

    case 'CLICK_DRAW':
      if ((window as any).gameData && (window as any).gameData.draw && (window as any).gameData.draw.length > 0) {
        const drawIdx = (window as any).gameData.draw[0];
        const topDraw = (window as any).$.cards[drawIdx];
        if (topDraw && typeof topDraw.dispatchEvent === 'function') {
          topDraw.dispatchEvent(new (window as any).createjs.MouseEvent('click', true, true, 0, 0, null, 0, 0, 0));
        }
      }
      break;
  }
}

// Listen for message events across frame/document boundaries
window.addEventListener('message', (e: MessageEvent) => {
  try {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    handleIncomingMessage(data);
  } catch (_err) {}
});

document.addEventListener('message', (e: any) => {
  try {
    const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    handleIncomingMessage(data);
  } catch (_err) {}
});

console.log('[Bridge] React Native WebView Bridge initialized with Force-Flush.');


