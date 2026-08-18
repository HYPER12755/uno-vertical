/**
 * React Native WebView Bridge
 * 
 * This file sets up a robust, typed 2-way communication bridge between
 * the HTML5 game and the React Native application hosting it.
 */

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(msg: string): void;
    };
    sendEvent: (type: string, value: any) => void;
  }
}

// 1. Sending messages TO React Native
export function sendToReactNative(type: string, value: any = null) {
  try {
    const payload = JSON.stringify({ type, value });
    
    // Check if we are running inside React Native WebView
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(payload);
    } else {
      // Fallback for local browser testing
      console.log('[Bridge] Mock send to RN:', { type, value });
    }
  } catch (err) {
    console.error('[Bridge] Error sending to RN:', err);
  }
}

// Override the global sendEvent used by legacy game.js / loader.js
window.sendEvent = sendToReactNative;

// 2. Receiving messages FROM React Native
// You can call your internal game functions based on incoming events
function handleIncomingMessage(data: any) {
  console.log('[Bridge] Received from RN:', data);
  
  if (!data || !data.type) return;

  switch (data.type) {
    case 'PAUSE_GAME':
      // e.g., stopGame() from game.js
      if (typeof (window as any).stopGame === 'function') {
        (window as any).stopGame();
      }
      break;
    case 'RESUME_GAME':
      // Handle resuming
      break;
    case 'SET_PLAYER_NAME':
      // Update local storage or game data
      break;
  }
}

// Setup listeners for React Native injected messages
document.addEventListener('message', (e: any) => {
  try {
    const data = JSON.parse(e.data);
    handleIncomingMessage(data);
  } catch(err) {}
});

window.addEventListener('message', (e: any) => {
  try {
    const data = JSON.parse(e.data);
    handleIncomingMessage(data);
  } catch(err) {}
});

console.log('[Bridge] React Native Webview Bridge initialized.');
