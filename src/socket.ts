import { io, Socket } from 'socket.io-client';
import { MultiplayerUIManager } from './multiplayer-ui';
import { HistoryLeaderboardManager } from './history-leaderboard';

declare global {
  interface Window {
    multiplayerSettings: any;
    socketData: any;
    socket: Socket | null;
    initSocket: (gameName?: string) => void;
    postSocketUpdate: (action: string, data?: any, broadcast?: boolean) => void;
    createCustomSocketRoom: (options: any) => void;
    joinCustomSocketRoom: (roomId: string, name?: string) => void;
    requestPublicRooms: () => void;
    sendSocketChat: (message: string, emoji?: string) => void;
    toggleSocketReady: () => void;
    startSocketMatch: () => void;
    exitSocketRoom: () => void;
    addSocketBot: () => void;
    removeSocketBot: () => void;
    addSocketRandomUser: () => void;
    postSocketCloseRoom: () => void;
    switchSocketRoomContent: (type: string) => void;
    recordMatchResult: (finalScore: number) => void;
    emitServerAction: (type: string, data?: any) => void;
    reportActionDone: (actionToken: string) => void;
    currentActionToken: string | null;
    flushSocketQueue?: () => void;
  }
}

window.multiplayerSettings = {
  enable: true,
  localPlay: true,
  enterName: false
};

window.socketData = {
  online: false,
  host: false,
  gameIndex: 0
};

let socket: Socket | null = null;
let currentRoomId = '';
let currentRoomData: any = null;
window.currentActionToken = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;

interface OutgoingSocketAction {
  id: string;
  type: string;
  data: any;
  endpoint: 'playerAction' | 'gameAction' | 'player_action_done';
  timestamp: number;
}

const socketActionQueue: OutgoingSocketAction[] = [];
let isFlushingSocket = false;

/**
 * Force-flush the socket action queue to ensure all user click events and
 * game actions are immediately transmitted over the WebSocket without delay.
 */
export function flushSocketQueue(): void {
  if (!socket || isFlushingSocket) return;
  isFlushingSocket = true;

  try {
    while (socketActionQueue.length > 0) {
      if (!socket.connected) break;
      const item = socketActionQueue.shift();
      if (!item) break;

      if (item.endpoint === 'playerAction') {
        const safe = { ...item.data };
        delete (safe as any).type;
        delete (safe as any).roomId;
        socket.emit('playerAction', {
          roomId: currentRoomId,
          type: item.type,
          ...safe
        });
      } else if (item.endpoint === 'gameAction') {
        socket.emit('gameAction', {
          roomId: currentRoomId,
          action: item.type,
          payload: item.data?.payload,
          includeSender: item.data?.broadcast
        });
      } else if (item.endpoint === 'player_action_done') {
        socket.emit('player_action_done', {
          roomId: currentRoomId,
          actionToken: item.data?.actionToken
        });
      }
    }
  } catch (err) {
    console.error('[Socket] Error in flushSocketQueue:', err);
  } finally {
    isFlushingSocket = false;
  }
}
window.flushSocketQueue = flushSocketQueue;

// Send action to Authoritative Game Server with instantaneous queue flush
window.emitServerAction = (type: string, data: any = {}) => {
  const safe = { ...data };
  delete (safe as any).type;
  delete (safe as any).roomId;

  socketActionQueue.push({
    id: 'act_' + Math.random().toString(36).substr(2, 9),
    type: type,
    data: safe,
    endpoint: 'playerAction',
    timestamp: Date.now()
  });

  flushSocketQueue();
};

// Report "I'm done" after completing client animation
window.reportActionDone = (actionToken: string) => {
  if (!actionToken) return;
  socketActionQueue.push({
    id: 'done_' + Math.random().toString(36).substr(2, 9),
    type: 'player_action_done',
    data: { actionToken },
    endpoint: 'player_action_done',
    timestamp: Date.now()
  });

  flushSocketQueue();
};

// Initialize Socket Connection
window.initSocket = (_gameName?: string) => {
  if (socket && socket.connected) return;

  let serverUrl = window.location.origin;
  if (serverUrl === 'null' || serverUrl.startsWith('file://')) {
    serverUrl = 'http://localhost:3000';
  }

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5
  });
  window.socket = socket;

  socket.on('connect', () => {
    console.log('[Socket] Connected to Four Colors server. ID:', socket?.id);
    flushSocketQueue();
    if (pingInterval) clearInterval(pingInterval);
    pingInterval = setInterval(() => {
      socket?.emit('latency_ping', Date.now());
    }, 2000);
  });

  socket.on('latency_pong', (timestamp: number) => {
    const latency = Date.now() - timestamp;
    if (window.socketData && window.socketData.online) {
      MultiplayerUIManager.getInstance().updateLatency(latency);
      const gameIdx = window.socketData.gameIndex;
      const $ = (window as any).$;
      if ($ && $.players && gameIdx !== undefined) {
         const pStats = $.players["stats" + gameIdx];
         if (pStats && pStats.playerPing) {
            pStats.playerPing.text = latency + "ms";
            if (latency < 100) pStats.playerPing.color = '#2ecc71';
            else if (latency < 250) pStats.playerPing.color = '#f1c40f';
            else pStats.playerPing.color = '#e74c3c';
         }
      }
    } else {
      MultiplayerUIManager.getInstance().hideLatency();
    }
  });

  socket.on('publicRooms', (rooms: any[]) => {
    MultiplayerUIManager.getInstance().updatePublicRoomsList(rooms);
  });

  socket.on('roomCreated', (data: any) => {
    const roomId = typeof data === 'string' ? data : data.roomId;
    currentRoomId = roomId;
    currentRoomData = (typeof data === 'object' && data.room) ? data.room : {
      id: roomId,
      players: [{ id: socket?.id, name: 'You (Host)', isHost: true, isReady: true, isBot: false }],
      maxPlayers: 4,
      mode: 'classic',
      special: false
    };

    window.socketData.online = true;
    window.socketData.host = true;
    window.socketData.gameIndex = 0;

    const gData = (window as any).gameData;
    if (gData && currentRoomData) {
      gData.mode = currentRoomData.mode || 'classic';
      if (!gData.fourcolors) gData.fourcolors = {};
      gData.fourcolors.mode = gData.mode;
      gData.fourcolors.special = gData.mode === 'special';
    }

    MultiplayerUIManager.getInstance().openLobbyModal(currentRoomData);
    MultiplayerUIManager.getInstance().showToast(`Room ${roomId} created! You are the Host.`, '👑');
  });

  socket.on('roomJoined', (data: any) => {
    const roomId = typeof data === 'string' ? data : data.roomId;
    currentRoomId = roomId;
    currentRoomData = (typeof data === 'object' && data.room) ? data.room : {
      id: roomId,
      players: [],
      maxPlayers: 4,
      mode: 'classic',
      special: false
    };

    window.socketData.online = true;
    window.socketData.host = false;

    const gData = (window as any).gameData;
    if (gData && currentRoomData) {
      gData.mode = currentRoomData.mode || 'classic';
      if (!gData.fourcolors) gData.fourcolors = {};
      gData.fourcolors.mode = gData.mode;
      gData.fourcolors.special = gData.mode === 'special';
    }

    MultiplayerUIManager.getInstance().openLobbyModal(currentRoomData);
    MultiplayerUIManager.getInstance().showToast(`Joined Room ${roomId}!`, '🚀');
  });

  socket.on('joinError', (errMessage: string) => {
    MultiplayerUIManager.getInstance().showToast(errMessage, '⚠️');
  });

  socket.on('updatePlayers', (players: any[]) => {
    console.log('[Socket] updatePlayers:', players);
    if (socket && players) {
      const myIdx = players.findIndex(p => p.id === socket!.id);
      if (myIdx !== -1) {
        window.socketData.gameIndex = myIdx;
        window.socketData.host = players[myIdx].isHost === true;
      }
    }

    if (currentRoomData) {
      currentRoomData.players = players;
    }

    const gData = (window as any).gameData;
    if (gData && players) {
      if ((window as any).curPage !== 'game') {
        gData.names = players.map(p => p.name || 'Player');
        gData.players = players.length;
        gData.isBotArr = players.map(p => !!p.isBot);
      }
    }

    MultiplayerUIManager.getInstance().updateLobbyPlayers(players);
  });

  socket.on('roomOptions', (options: any) => {
    const gData = (window as any).gameData;
    const gSettings = (window as any).gameSettings;
    const pointsList = gSettings?.points || [500, 250, 1];
    if (currentRoomData && options) {
      if (options.mode) currentRoomData.mode = options.mode;
      if (options.special !== undefined) currentRoomData.special = options.special;
      if (options.maxPlayers) currentRoomData.maxPlayers = options.maxPlayers;
      if (options.houseRules) currentRoomData.houseRules = options.houseRules;
    }
    if (gSettings && options && options.houseRules) {
      gSettings.houseRules = options.houseRules;
    }
    if (gData && options) {
      if (options.maxPlayers && (window as any).curPage !== 'game') gData.players = options.maxPlayers;
      if (!gData.fourcolors) gData.fourcolors = {};
      if (options.mode) {
        gData.mode = options.mode;
        gData.fourcolors.mode = options.mode;
        gData.fourcolors.special = options.mode === 'special';
      } else if (options.special !== undefined) {
        gData.fourcolors.special = options.special;
        gData.mode = options.special ? 'special' : 'classic';
        gData.fourcolors.mode = gData.mode;
      }
      if (options.pointIndex !== undefined) {
        gData.pointIndex = options.pointIndex;
        gData.fourcolors.point = pointsList[options.pointIndex] !== undefined ? pointsList[options.pointIndex] : 500;
      }
      if (options.themeIndex !== undefined) gData.themeIndex = options.themeIndex;
    }
  });

  socket.on('chatMessage', (data: any) => {
    MultiplayerUIManager.getInstance().addChatMessage(data.senderName, data.message, data.emoji);
  });

  socket.on('playerReaction', (data: any) => {
    if (typeof (window as any).showPlayerReaction === 'function') {
      (window as any).showPlayerReaction(data.playerIndex, data.emoji);
    }
  });

  // ==========================================
  // AUTHORITATIVE SERVER GAME ENGINE EVENTS
  // ==========================================

  function setupAuthoritativeMultiplayerGame(data: any) {
    const gData = (window as any).gameData;
    const gSettings = (window as any).gameSettings;
    const $ = (window as any).$;
    const loader = (window as any).loader;
    const cardsPlayContainer = (window as any).cardsPlayContainer;
    const cardsPlayersContainer = (window as any).cardsPlayersContainer;

    if (!gData || !data || !data.players || !$) return;

    window.socketData.online = true;
    const myIdx = data.players.findIndex((p: any) => p.id === socket?.id);
    if (myIdx !== -1) {
      window.socketData.gameIndex = myIdx;
      window.socketData.host = data.players[myIdx]?.isHost === true;
    }

    gData.paused = false;
    gData.mode = data.mode || 'classic';
    if (!gData.fourcolors) gData.fourcolors = {};
    gData.fourcolors.mode = gData.mode;
    gData.fourcolors.special = gData.mode === 'special';
    gData.players = data.players.length;
    gData.names = data.players.map((p: any) => p.name || 'Player');
    gData.isBotArr = data.players.map((p: any) => !!p.isBot);
    gData.activePlayers = gData.players;

    if (data.houseRules && gSettings) {
      gSettings.houseRules = data.houseRules;
    }

    if (typeof (window as any).prepareCards === 'function') {
      (window as any).prepareCards();
    }
    // Reset match state
    gData.match = {
      color: data.currentColor || (data.topCard && data.topCard.color) || 'red',
      type: (data.topCard && data.topCard.type) || 'number',
      value: (data.topCard && data.topCard.value !== undefined) ? data.topCard.value : '',
      count: 0,
      active: true
    };
    gData.player = data.currentTurn !== undefined ? data.currentTurn : 0;
    gData.turn = {
      action: true,
      discard: false,
      pickColors: false,
      played: false,
      revealCard: false,
      drawCard: true,
      drawCards: 0,
      drawCardsTotal: 0,
      drawCardsCount: 0,
      drawCount: 0,
      loseTurn: false,
      swap: false,
      giveCard: false,
      removePlayer: false,
      reverse: (data.direction === -1),
      pendingDrawStack: data.pendingDrawStack || 0,
      pendingDrawType: data.pendingDrawType || '',
      animating: false,
      queue: []
    };

    gData.actionArr = ['draw2', 'draw1', 'skip', 'reverse', 'discardall', 'skipeveryone', 'hit2', 'attack', 'flexskip'];
    gData.wildArr = ['wild', 'wilddraw4', 'wilddraw2', 'wilddraw6', 'wilddraw10', 'wildreversdraw4', 'wildcolorroulette', 'wildskip', 'wildreverse', 'wildskipeveryone', 'wildattack', 'wildallattack', 'wildflexdraw', 'wildswap', 'wildtruesight'];
    gData.specialArr = [];
    gData.excludeMatch = [];
    gData.excludeFirst = [];

    // Clean containers and card references
    if (cardsPlayContainer) cardsPlayContainer.removeAllChildren();
    if (cardsPlayersContainer) cardsPlayersContainer.removeAllChildren();
    gData.cards = [];
    gData.draw = [];
    gData.discard = [];
    gData.cardNum = 0;
    gData.cardIndex = 0;
    (window as any).playerData.scores = [];

    for (let n = 0; n < gData.players; n++) {
      (window as any).playerData.scores.push(0);
    }

    // Build player layout sequence
    if (typeof (window as any).buildPlayerSequence === 'function') {
      (window as any).buildPlayerSequence();
    }

    // Create player containers and UI indicators
    for (let n = 0; n < gData.players; n++) {
      $.players[n] = new (window as any).createjs.Container();
      $.players[n].cards = [];
      $.players[n].active = true;
      $.players[n].playerIndex = n;

      // Stats: Name & Score
      $.players["stats" + n] = new (window as any).createjs.Container();
      const pLine = new (window as any).createjs.Bitmap(loader.getResult('itemPlayerLine'));
      (window as any).centerReg(pLine);

      const pName = new (window as any).createjs.Text();
      pName.font = "18px bpreplaybold";
      pName.color = "#ffffff";
      pName.textAlign = "left";
      pName.textBaseline = "middle";
      pName.text = gData.names[n] || `Player ${n + 1}`;

      const pScore = new (window as any).createjs.Text();
      pScore.font = "22px bpreplaybold";
      pScore.color = "#ffd700";
      pScore.textAlign = "right";
      pScore.textBaseline = "middle";
      pScore.text = "0 PTS";

      $.players["stats" + n].playerLine = pLine;
      $.players["stats" + n].playerName = pName;
      $.players["stats" + n].playerScore = pScore;
      $.players["stats" + n].visible = true;
      $.players["stats" + n].addChild(pLine, pName, pScore);

      // Call button
      $.players["call" + n] = new (window as any).createjs.Bitmap(loader.getResult('buttonCall') || loader.getResult('itemColors'));
      (window as any).centerReg($.players["call" + n]);
      $.players["call" + n].visible = (n === window.socketData.gameIndex);
      $.players["call" + n].cursor = "pointer";
      $.players["call" + n].addEventListener("click", () => {
        if ($.players[window.socketData.gameIndex]?.cards?.length === 1) {
          window.emitServerAction('player_call_uno', {});
          (window as any).playSound('soundCall');
          if ($.players["called" + window.socketData.gameIndex]) {
            $.players["called" + window.socketData.gameIndex].visible = true;
          }
        }
      });

      // Called badge
      $.players["called" + n] = new (window as any).createjs.Bitmap(loader.getResult('buttonCalled') || loader.getResult('itemColors'));
      (window as any).centerReg($.players["called" + n]);
      $.players["called" + n].visible = false;

      // Target aim icon
      $.players["aim" + n] = new (window as any).createjs.Bitmap(loader.getResult('buttonAim') || loader.getResult('itemTarget'));
      (window as any).centerReg($.players["aim" + n]);
      $.players["aim" + n].visible = false;
      $.players["aim" + n].cursor = "pointer";
      $.players["aim" + n].addEventListener("click", () => {
        window.emitServerAction('player_target_aim', { targetIndex: n });
      });

      // Arrow indicator container
      $.players["arrow" + n] = new (window as any).createjs.Container();
      const itemArrowL = new (window as any).createjs.Bitmap(loader.getResult('itemArrow'));
      (window as any).centerReg(itemArrowL);
      const itemArrowR = new (window as any).createjs.Bitmap(loader.getResult('itemArrow'));
      (window as any).centerReg(itemArrowR);
      itemArrowR.visible = false;
      itemArrowR.scaleX = -1;
      $.players["arrow" + n].itemArrowL = itemArrowL;
      $.players["arrow" + n].itemArrowR = itemArrowR;
      $.players["arrow" + n].visible = true;
      $.players["arrow" + n].addChild(itemArrowL, itemArrowR);

      // Skip icon
      $.players["skip" + n] = new (window as any).createjs.Bitmap(loader.getResult('itemSkip'));
      (window as any).centerReg($.players["skip" + n]);
      $.players["skip" + n].visible = false;

      // Target icon
      $.players["target" + n] = new (window as any).createjs.Bitmap(loader.getResult('itemTarget'));
      (window as any).centerReg($.players["target" + n]);
      $.players["target" + n].visible = false;

      // Eliminated icon
      $.players["eliminated" + n] = new (window as any).createjs.Bitmap(loader.getResult('itemEliminated'));
      (window as any).centerReg($.players["eliminated" + n]);
      $.players["eliminated" + n].visible = false;

      cardsPlayersContainer.addChild(
        $.players[n],
        $.players["stats" + n],
        $.players["call" + n],
        $.players["called" + n],
        $.players["aim" + n],
        $.players["arrow" + n],
        $.players["skip" + n],
        $.players["target" + n],
        $.players["eliminated" + n]
      );
    }

    // Build the exact cards for each player from the server
    for (let p = 0; p < data.players.length; p++) {
      const pInfo = data.players[p];
      const handCards = pInfo.cards || [];
      const isMyHand = (p === window.socketData.gameIndex);

      for (let c = 0; c < handCards.length; c++) {
        const sCard = handCards[c];
        const cCard = (window as any).createNoMercyCard(
          sCard.type || 'number',
          sCard.color || '',
          sCard.value !== undefined ? sCard.value : '',
          sCard.point || 20
        );
        cCard.serverId = sCard.id;
        cCard.cardDeal = true;

        if (isMyHand) {
          (window as any).toggleCardAction(cCard, true);
          (window as any).flipCard(cCard);
        } else {
          (window as any).toggleCardAction(cCard, false);
          (window as any).flipCardCover(cCard);
        }
        $.players[p].cards.push(cCard.cardIndex);
      }
    }

    // Create top discard card from server
    const cardW0 = (window as any).gameSettings?.cardW || 100;
    if (data.topCard) {
      const topC = (window as any).createNoMercyCard(
        data.topCard.type || 'number',
        data.topCard.color || '',
        data.topCard.value !== undefined ? data.topCard.value : '',
        data.topCard.point || 20
      );
      topC.serverId = data.topCard.id;
      topC.cardDeal = false;
      // Place the discard at +cardW/2 (matching showDiscardCard's tween target).
      // Baseline b9f0eb1 does this; without it the discard card sits at x=0 and
      // overlaps the deck pile (at -cardW/2), so the two stacks look jammed
      // together and the discard covers part of the deck's click/hit zone.
      topC.x = cardW0 / 2;
      topC.y = 0;
      topC.rotation = (Math.random() * 16) - 8;
      gData.discard.push(topC.cardIndex);
      (window as any).flipCard(topC);
    }

    // Create draw pile dummy cards.
    // NOTE: createCard() already places the card-back art into frontContainer,
    // so dummies are face-down by default - no per-card flip animation needed.
    const drawCount = Math.max(data.deckRemaining || 30, 20);
    const cardW = (window as any).gameSettings?.cardW || 100;
    for (let d = 0; d < drawCount; d++) {
      const dCard = (window as any).createNoMercyCard('number', 'red', 0, 0);
      dCard.cardDeal = false;
      dCard.visible = false;
      dCard.x = -(cardW / 2);
      dCard.y = 0;
      gData.draw.push(dCard.cardIndex);
    }
    // Reveal ONLY gameData.draw[0] and raise it above every other pile card.
    // The deck-click handler requires clicked index === gameData.draw[0];
    // without this the visible top card is the last-created dummy and deck
    // clicks never register as draws.
    if (typeof (window as any).showDrawCard === 'function') {
      (window as any).showDrawCard(false);
      // showDrawCard() re-raises the discard top above the deck at the end;
      // since both piles overlap horizontally, that makes clicks on the shared
      // area land on the discard card and get silently ignored. Raise the
      // deck top back above it so the deck always wins its own hit zone.
      const deckTop = (window as any).$.cards[gData.draw[0]];
      if (deckTop && typeof (window as any).setCardDepth === 'function') {
        (window as any).setCardDepth(deckTop);
      }
    }

    gData.prepared = true;

    if (typeof (window as any).resizeGameLayout === 'function') {
      (window as any).resizeGameLayout();
    }

    // Layout cards visually
    for (let p = 0; p < gData.players; p++) {
      if (typeof (window as any).positionPlayerCards === 'function') {
        (window as any).positionPlayerCards(p, false);
      }
    }

    if (typeof (window as any).toggleArrowTurn === 'function') {
      (window as any).toggleArrowTurn();
    }
    if (typeof (window as any).getMatchDetail === 'function') {
      (window as any).getMatchDetail();
    }
    if (typeof (window as any).displayPlayerTurn === 'function') {
      (window as any).displayPlayerTurn();
    }
    if (typeof (window as any).highlightPlayer === 'function') {
      (window as any).highlightPlayer(true);
    }
  }
  (window as any).setupAuthoritativeMultiplayerGame = setupAuthoritativeMultiplayerGame;

  socket.on('server_game_started', (data: any) => {
    console.log('[Socket] Authoritative server_game_started:', data);
    setupAuthoritativeMultiplayerGame(data);

    MultiplayerUIManager.getInstance().closeModal();
    MultiplayerUIManager.getInstance().setTopBarVisible(false);

    const reactionUI = document.getElementById('fc-game-reaction-ui');
    if (reactionUI) reactionUI.style.display = 'block';

    if (typeof (window as any).goPage === 'function') {
      (window as any).goPage('game');
    }
  });

  // Turn Started: "Now it's your turn"
  socket.on('server_turn_started', (data: any) => {
    console.log('[Socket] Authoritative server_turn_started:', data);
    const gData = (window as any).gameData;
    const $ = (window as any).$;
    if (!gData || !$) return;

    clearTimeout((window as any).__drawAckTimer);
    clearTimeout((window as any).__playAckTimer);
    (window as any).__drawAckTimer = null;
    (window as any).__playAckTimer = null;

    window.currentActionToken = data.actionToken;
    gData.player = data.currentTurn;
    gData.turn.reverse = (data.direction === -1);
    gData.turn.pendingDrawStack = data.pendingDrawStack || 0;
    gData.turn.pendingDrawType = data.pendingDrawType || '';
    gData.match.color = data.currentColor || (data.topCard && data.topCard.color) || 'red';
    if (data.topCard) {
      gData.match.type = data.topCard.type || 'number';
      gData.match.value = data.topCard.value !== undefined ? data.topCard.value : '';
    } else if (gData.discard && gData.discard.length > 0 && $.cards[gData.discard[gData.discard.length - 1]]) {
      const topC = $.cards[gData.discard[gData.discard.length - 1]];
      gData.match.type = topC.cardType || 'number';
      gData.match.value = topC.cardValue !== undefined ? topC.cardValue : '';
    }
    gData.match.lastColor = gData.match.color;
    gData.turn.action = true;
    gData.turn.played = false;
    gData.turn.drawCount = 0;
    gData.turn.animating = false;
    gData.turn.playableCardIds = data.playableCardIds || [];

    const isMyTurn = (data.currentTurn === window.socketData.gameIndex);

    // Force flush outgoing queue and ensure input responsiveness
    if (typeof (window as any).forceFlushOutgoingEvents === 'function') {
      (window as any).forceFlushOutgoingEvents();
    }

    if (typeof (window as any).toggleArrowTurn === 'function') {
      (window as any).toggleArrowTurn();
    }
    if (typeof (window as any).getMatchDetail === 'function') {
      (window as any).getMatchDetail();
    }
    if (typeof (window as any).displayPlayerTurn === 'function') {
      (window as any).displayPlayerTurn();
    }
    if (typeof (window as any).highlightPlayer === 'function') {
      (window as any).highlightPlayer(true);
    }

    const myIdx = window.socketData.gameIndex;
    const myCards = ($.players && $.players[myIdx] && $.players[myIdx].cards) ? $.players[myIdx].cards : [];

    if (isMyTurn) {
      MultiplayerUIManager.getInstance().showToast(`It's your turn!`, '⭐');
      if (typeof (window as any).playSound === 'function') {
        (window as any).playSound('soundTurn');
      }

      let hasPlayable = false;
      for (const cIdx of myCards) {
        const cObj = $.cards[cIdx];
        if (cObj) {
          const isPlayable = (data.playableCardIds && data.playableCardIds.length > 0)
            ? (data.playableCardIds.includes(cObj.serverId) || data.playableCardIds.includes(cIdx) || (typeof (window as any).checkMatchCard === 'function' && (window as any).checkMatchCard(cIdx)))
            : (typeof (window as any).checkMatchCard === 'function' ? (window as any).checkMatchCard(cIdx) : false);

          if (isPlayable) {
            hasPlayable = true;
            if (typeof (window as any).highlightCard === 'function') {
              (window as any).highlightCard(cObj, true);
            }
            if (typeof (window as any).toggleCardAction === 'function') {
              (window as any).toggleCardAction(cObj, true);
            }
          } else {
            if (typeof (window as any).highlightCard === 'function') {
              (window as any).highlightCard(cObj, false);
            }
            if (typeof (window as any).toggleCardAction === 'function') {
              (window as any).toggleCardAction(cObj, false);
            }
          }
        }
      }

      // Draw pile is always accessible on player turn
      gData.turn.drawCard = true;
      if (gData.draw && gData.draw.length > 0) {
        const drawTop = $.cards[gData.draw[0]];
        if (drawTop) {
          if (typeof (window as any).toggleCardAction === 'function') {
            (window as any).toggleCardAction(drawTop, true);
          }
          if ((!hasPlayable || gData.turn.pendingDrawStack > 0) && typeof (window as any).highlightCard === 'function') {
            (window as any).highlightCard(drawTop, true);
          } else if (typeof (window as any).highlightCard === 'function') {
            (window as any).highlightCard(drawTop, false);
          }
        }
      }
    } else {
      // Not my turn: clear highlights on my cards and draw pile
      for (const cIdx of myCards) {
        const cObj = $.cards[cIdx];
        if (cObj) {
          if (typeof (window as any).highlightCard === 'function') {
            (window as any).highlightCard(cObj, false);
          }
          if (typeof (window as any).toggleCardAction === 'function') {
            (window as any).toggleCardAction(cObj, false);
          }
        }
      }
      if (gData.draw && gData.draw.length > 0) {
        const drawTop = $.cards[gData.draw[0]];
        if (drawTop) {
          if (typeof (window as any).highlightCard === 'function') {
            (window as any).highlightCard(drawTop, false);
          }
          if (typeof (window as any).toggleCardAction === 'function') {
            (window as any).toggleCardAction(drawTop, false);
          }
        }
      }
    }
  });

  // Card Played by Player or Server Bot
  socket.on('server_card_played', (data: any) => {
    console.log('[Socket] Authoritative server_card_played:', data);
    const gData = (window as any).gameData;
    const $ = (window as any).$;

    clearTimeout((window as any).__playAckTimer);
    (window as any).__playAckTimer = null;

    if (gData && data.card && $) {
      gData.player = data.playerIndex;
      gData.match.color = data.currentColor || data.card.color || 'red';
      gData.match.type = data.card.type || 'number';
      gData.match.value = data.card.value !== undefined ? data.card.value : '';
      gData.match.lastColor = gData.match.color;
      gData.turn.pendingDrawStack = data.pendingDrawStack || 0;

      const isMyPlay = (data.playerIndex === window.socketData.gameIndex);
      let cardObj = null;

      if ($.players && $.players[data.playerIndex] && $.players[data.playerIndex].cards) {
        const pCards = $.players[data.playerIndex].cards;

        // Try exact serverId match
        let cIdx = pCards.find((ci: number) => {
          const c = $.cards[ci];
          return c && c.serverId === data.card.id;
        });

        // Try type/color/value match
        if (cIdx === undefined) {
          cIdx = pCards.find((ci: number) => {
            const c = $.cards[ci];
            if (!c) return false;
            if (data.card.type && c.cardType === data.card.type) return true;
            if (data.card.value !== undefined && data.card.value !== '' && String(c.cardValue) === String(data.card.value)) return true;
            return false;
          });
        }

        // Fallback to first card in hand
        if (cIdx === undefined && pCards.length > 0) {
          cIdx = pCards[0];
        }

        if (cIdx !== undefined && $.cards[cIdx]) {
          cardObj = $.cards[cIdx];
          // Ensure visual card has the exact card graphics and attributes
          cardObj.serverId = data.card.id;
          cardObj.cardType = data.card.type;
          cardObj.cardColor = data.card.color;
          cardObj.cardValue = data.card.value;
          cardObj.cardPoint = data.card.point || 20;

          if (typeof (window as any).getNoMercyCardCanvas === 'function') {
            const canvas = (window as any).getNoMercyCardCanvas(data.card.type, data.card.color, data.card.value, gData.themeIndex || 0);
            const customBmp = new (window as any).createjs.Bitmap(canvas);
            customBmp.scaleX = customBmp.scaleY = 0.5;
            customBmp.regX = 100;
            customBmp.regY = 150;
            cardObj.contentContainer.removeAllChildren();
            cardObj.contentContainer.addChild(customBmp);
          }
        }
      }

      if (cardObj && typeof (window as any).discardPlayerCard === 'function') {
        // If not already discarded by optimistic local play
        if ($.players[data.playerIndex]?.cards?.indexOf(cardObj.cardIndex) !== -1) {
          (window as any).discardPlayerCard(cardObj.cardIndex, !isMyPlay);
        }
      }

      if (typeof (window as any).getMatchDetail === 'function') {
        (window as any).getMatchDetail();
      }

      if (data.isUno && typeof (window as any).playSound === 'function') {
        (window as any).playSound('soundCall');
        if ($.players && $.players['called' + data.playerIndex]) {
          $.players['called' + data.playerIndex].visible = true;
        }
      }
    }

    // Acknowledge animation finished immediately
    if (data.actionToken) {
      setTimeout(() => {
        window.reportActionDone(data.actionToken);
      }, 500);
    }
  });

  // Card Drawn
  socket.on('server_card_drawn', (data: any) => {
    console.log('[Socket] Authoritative server_card_drawn:', data);
    const gData = (window as any).gameData;
    const $ = (window as any).$;
    const isMe = (data.playerIndex === window.socketData.gameIndex);

    if (gData && $ && $.players[data.playerIndex]) {
      gData.player = data.playerIndex;

      // Consume the visual top of the local draw pile so it stays in sync
      // with the authoritative server deck.
      if (gData.draw.length > 0) {
        const consumedIdx = gData.draw.shift();
        const consumed = $.cards[consumedIdx];
        const playContainer = (window as any).cardsPlayContainer;
        if (consumed && playContainer) {
          [consumed.shadow, consumed, consumed.highlight, consumed.eliminated].forEach((part: any) => {
            if (part && playContainer.contains(part)) {
              playContainer.removeChild(part);
            }
          });
        }
      }

      if (isMe && data.card) {
        // Human player draws exact card
        const card = (window as any).createNoMercyCard(
          data.card.type || 'number',
          data.card.color || '',
          data.card.value !== undefined ? data.card.value : '',
          data.card.point || 20
        );
        card.serverId = data.card.id;
        card.cardDeal = true;
        $.players[data.playerIndex].cards.push(card.cardIndex);
        (window as any).toggleCardAction(card, true);
        (window as any).flipCard(card);
      } else {
        // Opponent draws covered card (serverId kept for later play matching)
        const card = (window as any).createNoMercyCard('number', 'red', 0, 0);
        if (data.card) {
          card.serverId = data.card.id;
        }
        card.cardDeal = true;
        $.players[data.playerIndex].cards.push(card.cardIndex);
        (window as any).toggleCardAction(card, false);
      }

      // Refresh the visible pile top after consuming a card
      if (gData.draw.length > 0 && typeof (window as any).showDrawCard === 'function') {
        (window as any).showDrawCard(false);
        // Same depth rule as initial setup: deck top must beat discard overlap
        const deckTop = (window as any).$.cards[gData.draw[0]];
        if (deckTop && typeof (window as any).setCardDepth === 'function') {
          (window as any).setCardDepth(deckTop);
        }
      }

      if (typeof (window as any).positionPlayerCards === 'function') {
        (window as any).positionPlayerCards(data.playerIndex, true);
      }
      if (typeof (window as any).playSound === 'function') {
        (window as any).playSound('soundCardDeal');
      }

      if (isMe) {
        // Mirror legacy bookkeeping: one manual draw happened this turn and
        // the server acked it, so re-enable input immediately.
        clearTimeout((window as any).__drawAckTimer);
        (window as any).__drawAckTimer = null;
        gData.turn.animating = false;
        gData.turn.drawCount = 1;
      }
    }

    if (data.actionToken) {
      setTimeout(() => {
        window.reportActionDone(data.actionToken);
      }, 400);
    }
  });

  // Stack Penalty Applied
  socket.on('server_stack_penalty_applied', (data: any) => {
    console.log('[Socket] Authoritative server_stack_penalty_applied:', data);
    const gData = (window as any).gameData;
    const $ = (window as any).$;

    if (gData && $) {
      gData.player = data.playerIndex;
      gData.turn.pendingDrawStack = 0;
      gData.turn.pendingDrawType = '';
      const isMe = (data.playerIndex === window.socketData.gameIndex);

      const drawnList = data.drawnCards || [];
      for (let i = 0; i < (data.count || drawnList.length); i++) {
        const sCard = drawnList[i] || { type: 'number', color: 'red', value: 0, point: 0 };
        const card = (window as any).createNoMercyCard(
          sCard.type || 'number',
          sCard.color || '',
          sCard.value !== undefined ? sCard.value : '',
          sCard.point || 20
        );
        card.serverId = sCard.id;
        card.cardDeal = true;
        $.players[data.playerIndex].cards.push(card.cardIndex);

        if (isMe) {
          (window as any).toggleCardAction(card, true);
          (window as any).flipCard(card);
        } else {
          (window as any).toggleCardAction(card, false);
          (window as any).flipCardCover(card);
        }
      }

      if (typeof (window as any).positionPlayerCards === 'function') {
        (window as any).positionPlayerCards(data.playerIndex, true);
      }
      if (typeof (window as any).playSound === 'function') {
        (window as any).playSound('soundCardDeal');
      }
    }

    MultiplayerUIManager.getInstance().showToast(`${data.playerName} drew +${data.count} penalty cards!`, '💥');

    if (data.actionToken) {
      setTimeout(() => {
        window.reportActionDone(data.actionToken);
      }, 800);
    }
  });

  // Color Chosen
  socket.on('server_color_chosen', (data: any) => {
    console.log('[Socket] Authoritative server_color_chosen:', data);
    const gData = (window as any).gameData;
    if (gData && gData.match) {
      gData.match.color = data.chosenColor;
      if (typeof (window as any).toggleColors === 'function') {
        (window as any).toggleColors(false);
      }
      if (typeof (window as any).getMatchDetail === 'function') {
        (window as any).getMatchDetail();
      }
    }

    if (data.actionToken) {
      setTimeout(() => {
        window.reportActionDone(data.actionToken);
      }, 400);
    }
  });

  // Deck Reshuffled
  socket.on('server_deck_reshuffled', (data: any) => {
    console.log('[Socket] Authoritative server_deck_reshuffled:', data);
    if (typeof (window as any).recycleDiscardPile === 'function') {
      (window as any).recycleDiscardPile();
    }
    if (typeof (window as any).showDrawCard === 'function') {
      (window as any).showDrawCard(false);
    }
    if (typeof (window as any).playSound === 'function') {
      (window as any).playSound('soundCardShuffle');
    }
  });

  // Request Color from Human Player
  socket.on('server_request_color', (data: any) => {
    if ((window as any).gameData) {
      (window as any).gameData.player = data.playerIndex;
    }
    if (typeof (window as any).toggleColors === 'function') {
      (window as any).toggleColors(true);
    }
  });

  // Request Target from Human Player (Swap / Aim)
  socket.on('server_request_target', (data: any) => {
    if ((window as any).gameData) {
      (window as any).gameData.player = data.sourcePlayer;
    }
    if (typeof (window as any).toggleTargetPlayers === 'function') {
      (window as any).toggleTargetPlayers(true);
    }
  });

  // Discard All Executed
  socket.on('server_discard_all_executed', (data: any) => {
    if (typeof (window as any).executeDiscardAll === 'function') {
      (window as any).executeDiscardAll(data.playerIndex, (window as any).gameData?.match?.color);
    }
  });

  // Rotate All Hands (0 rule)
  socket.on('server_rotate_all_hands', (data: any) => {
    if (typeof (window as any).passZeroAllHands === 'function') {
      (window as any).passZeroAllHands();
    }
    if (data.actionToken) {
      setTimeout(() => window.reportActionDone(data.actionToken), 800);
    }
  });

  // Swap Hands (7 rule)
  socket.on('server_swap_executed', (data: any) => {
    if (typeof (window as any).swapPlayerCards === 'function') {
      (window as any).swapPlayerCards(data.targetPlayer);
    }
    if (data.actionToken) {
      setTimeout(() => window.reportActionDone(data.actionToken), 800);
    }
  });

  // Jump In
  socket.on('server_jump_in_executed', (data: any) => {
    MultiplayerUIManager.getInstance().showToast(`⚡ ${data.playerName} JUMPED IN!`, '⚡');
    const gData = (window as any).gameData;
    if (gData) {
      gData.player = data.playerIndex;
    }
  });

  // Uno Called
  socket.on('server_uno_called', (data: any) => {
    if (typeof (window as any).playSound === 'function') {
      (window as any).playSound('soundCall');
    }
    const $ = (window as any).$;
    if ($ && $.players && $.players['called' + data.playerIndex]) {
      $.players['called' + data.playerIndex].visible = true;
    }
    MultiplayerUIManager.getInstance().showToast(`📢 ${data.playerName} called UNO!`, '📢');
  });

  // Player Eliminated (Mercy KO)
  socket.on('server_player_eliminated', (data: any) => {
    MultiplayerUIManager.getInstance().showToast(`💀 ${data.playerName} eliminated! (${data.reason})`, '💀');
    if (typeof (window as any).eliminatePlayerVisual === 'function') {
      (window as any).eliminatePlayerVisual(data.playerIndex);
    }
  });

  // Round Ended
  socket.on('server_round_ended', (data: any) => {
    console.log('[Socket] Authoritative server_round_ended:', data);
    const isMe = (data.winnerIndex === window.socketData.gameIndex);
    MultiplayerUIManager.getInstance().showToast(
      isMe ? `🎉 YOU WON THE ROUND (+${data.roundPoints} pts)!` : `🏆 ${data.winnerName} won the round (+${data.roundPoints} pts)!`,
      '🏆'
    );
    window.recordMatchResult(data.roundPoints);
    
    if (typeof (window as any).showGameStatus === 'function') {
      const gData = (window as any).gameData;
      if (gData && (window as any).$) {
        gData.player = data.winnerIndex;
        (window as any).highlightPlayer(false);
        (window as any).showGameStatus('emptycards');
      }
    }
  });

  socket.on('playerDisconnected', (pIdx: any) => {
    MultiplayerUIManager.getInstance().showToast(`A player disconnected. Bot took over.`, '🤖');
    const gData = (window as any).gameData;
    if (gData && gData.isBotArr && typeof pIdx === 'number' && pIdx >= 0) {
      gData.isBotArr[pIdx] = true;
    }
  });

  // GAME ACTION (Legacy and Peer Relay Handler)
  socket.on('gameAction', (data: any) => {
    if (!data || !data.action) return;
    const gData = (window as any).gameData;
    const $ = (window as any).$;
    if (!gData) return;

    switch (data.action) {
      case 'choosecolor':
        if (data.payload) {
          gData.match.color = data.payload;
          gData.match.lastColor = data.payload;
          if (typeof (window as any).toggleColors === 'function') (window as any).toggleColors(false);
          if (typeof (window as any).getMatchDetail === 'function') (window as any).getMatchDetail();
        }
        break;

      case 'called':
        if (typeof (window as any).playSound === 'function') (window as any).playSound('soundCall');
        const pIdx = typeof data.payload === 'number' ? data.payload : gData.player;
        if ($ && $.players && $.players['called' + pIdx]) {
          $.players['called' + pIdx].visible = true;
        }
        break;

      case 'targetaim':
        if (typeof (window as any).swapPlayerCards === 'function' && typeof data.payload === 'number') {
          (window as any).swapPlayerCards(data.payload);
        }
        break;

      case 'wildaction':
        if (data.payload && data.payload.card) {
          const sub = data.payload.card;
          if (sub === 'discardplayercard' && typeof (window as any).discardPlayerCard === 'function') {
            (window as any).discardPlayerCard(data.payload.cardData, true);
          } else if (sub === 'drawplayercard' && typeof (window as any).drawPlayerCard === 'function') {
            (window as any).drawPlayerCard(false);
          } else if (sub === 'stackdraw' && typeof (window as any).drawPlayerCard === 'function') {
            (window as any).drawPlayerCard(true);
          } else if (sub === 'passturn' && typeof (window as any).checkRoundEnd === 'function') {
            (window as any).checkRoundEnd();
          } else if (sub === 'jumpin') {
            if (typeof data.payload.player === 'number') gData.player = data.payload.player;
            if (typeof (window as any).showGameStatus === 'function') (window as any).showGameStatus('jump_in');
            if (typeof (window as any).discardPlayerCard === 'function') (window as any).discardPlayerCard(data.payload.cardData, true);
          }
        }
        break;

      case 'updateoptions':
        if (data.payload) {
          if (data.payload.players !== undefined && (window as any).curPage !== 'game') gData.players = data.payload.players;
          if (data.payload.pointIndex !== undefined) gData.pointIndex = data.payload.pointIndex;
          if (data.payload.special !== undefined) {
            if (!gData.fourcolors) gData.fourcolors = {};
            gData.fourcolors.special = data.payload.special;
          }
          if (data.payload.themeIndex !== undefined) gData.themeIndex = data.payload.themeIndex;
          if (data.payload.option !== undefined) gData.lastOption = data.payload.option;
          if (typeof (window as any).displayCardsOptions === 'function') (window as any).displayCardsOptions();
        }
        break;

      case 'shuffleplayercards':
        if (data.payload && data.payload.allCards && typeof (window as any).shufflePlayerCards === 'function') {
          (window as any).shufflePlayerCards(data.payload.allCards);
        }
        break;
    }
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Disconnected from server');
    window.socketData.online = false;
  });
};

// CREATE CUSTOM ROOM
window.createCustomSocketRoom = (options: any) => {
  if (!socket) window.initSocket();
  const profile = HistoryLeaderboardManager.getProfile();
  const mode = options.mode || (options.special === true ? 'special' : 'classic');
  socket?.emit('createRoom', {
    name: options.name || profile.name,
    maxPlayers: options.maxPlayers || 4,
    mode: mode,
    special: mode === 'special',
    pointIndex: options.pointIndex || 0,
    themeIndex: 0,
    houseRules: options.houseRules
  });
};

// JOIN CUSTOM ROOM
window.joinCustomSocketRoom = (roomId: string, name?: string) => {
  if (!socket) window.initSocket();
  const profile = HistoryLeaderboardManager.getProfile();
  socket?.emit('joinRoom', {
    roomId: roomId.trim().toUpperCase(),
    name: name || profile.name
  });
};

// REQUEST PUBLIC ROOMS
window.requestPublicRooms = () => {
  socket?.emit('listRooms');
};

// ADD BOT
window.addSocketBot = () => {
  if (!currentRoomId) currentRoomId = (MultiplayerUIManager.getInstance() as any).currentRoom?.id || '';
  if (!socket || !currentRoomId) return;
  socket.emit('addBot', { roomId: currentRoomId });
};

// REMOVE BOT
window.removeSocketBot = () => {
  if (!currentRoomId) currentRoomId = (MultiplayerUIManager.getInstance() as any).currentRoom?.id || '';
  if (!socket || !currentRoomId) return;
  socket.emit('removeBot', { roomId: currentRoomId });
};

// SEND CHAT & REACTIONS
window.sendSocketChat = (message: string, emoji?: string) => {
  if (!currentRoomId) currentRoomId = (MultiplayerUIManager.getInstance() as any).currentRoom?.id || '';
  if (!socket || !currentRoomId) return;
  const profile = HistoryLeaderboardManager.getProfile();
  socket.emit('sendChat', {
    roomId: currentRoomId,
    senderName: profile.name,
    message,
    emoji
  });
};

// TOGGLE READY
window.toggleSocketReady = () => {
  if (!currentRoomId) currentRoomId = (MultiplayerUIManager.getInstance() as any).currentRoom?.id || '';
  if (!socket || !currentRoomId) return;
  socket.emit('toggleReady', { roomId: currentRoomId });
};

// START MULTIPLAYER MATCH
window.startSocketMatch = () => {
  console.log("[Socket] startSocketMatch called");
  if (!currentRoomId) {
    currentRoomId = (MultiplayerUIManager.getInstance() as any).currentRoom?.id || '';
  }
  if (!socket) {
    window.initSocket();
  }
  if (!currentRoomId || !socket) {
    console.warn('[Socket] Cannot start match: Missing room or socket connection.');
    return;
  }

  // The DOM lobby is usable while game assets are still loading; the EaselJS
  // containers (cardsPlayContainer etc.) only exist once buildGameCanvas()
  // has run after preload completes. Starting before that used to crash
  // prepareCards() and silently kill the match. Wait for readiness instead.
  const beginStart = () => {
  const gData = (window as any).gameData;
  const currentRoom = (MultiplayerUIManager.getInstance() as any).currentRoom || currentRoomData;
  const playersList = currentRoom?.players || [];
  const playerNames = playersList.map((p: any) => p.name || 'Player');
  const isBotArr = playersList.map((p: any) => !!p.isBot);
  const selectedMode = currentRoom?.mode || gData?.mode || 'classic';

  const myIdx = playersList.findIndex((p: any) => p.id === socket?.id);
  window.socketData.online = true;
  window.socketData.host = true;
  window.socketData.gameIndex = myIdx !== -1 ? myIdx : 0;

  if (gData) {
    gData.names = playerNames;
    gData.players = Math.max(playersList.length, 2);
    gData.isBotArr = isBotArr;
    gData.mode = selectedMode;
    if (!gData.fourcolors) gData.fourcolors = {};
    gData.fourcolors.mode = selectedMode;
    gData.fourcolors.special = selectedMode === 'special';

    if (typeof (window as any).prepareCards === 'function') {
      (window as any).prepareCards();
    }
    const deckIndices = (gData.cards || []).map((c: any) => c.cardIndex);

    const syncPayload = {
      deck: deckIndices,
      players: gData.players,
      names: playerNames,
      isBotArr: isBotArr,
      mode: selectedMode,
      special: selectedMode === 'special',
      pointIndex: gData.pointIndex || 0,
      themeIndex: gData.themeIndex || 0,
      houseRules: currentRoom?.houseRules || (window as any).gameSettings?.houseRules
    };

    // Tell server to start authoritative session
    socket.emit('gameAction', {
      roomId: currentRoomId,
      action: 'start',
      includeSender: true,
      payload: syncPayload
    });
  }
  };

  const canvasReady = () => !!(window as any).cardsPlayContainer;
  if (canvasReady()) {
    beginStart();
  } else {
    console.log('[Socket] Canvas still loading - deferring match start...');
    MultiplayerUIManager.getInstance().showToast('Finishing load...', '⏳');
    let tries = 0;
    const waitCanvas = () => {
      if (canvasReady()) { beginStart(); return; }
      if (++tries > 150) { // 30s max
        console.warn('[Socket] Match start aborted: game canvas never became ready.');
        MultiplayerUIManager.getInstance().showToast('Load failed. Please restart.', '⚠️');
        return;
      }
      setTimeout(waitCanvas, 200);
    };
    waitCanvas();
  }
};

// POST ACTION UPDATE (Legacy / Backward Compatibility with Force-Flush)
window.postSocketUpdate = (action: string, data: any = null, broadcast: boolean = false) => {
  socketActionQueue.push({
    id: 'gact_' + Math.random().toString(36).substr(2, 9),
    type: action,
    data: { payload: data, broadcast },
    endpoint: 'gameAction',
    timestamp: Date.now()
  });

  flushSocketQueue();
};

// LEAVE / EXIT ROOM
window.exitSocketRoom = () => {
  if (socket && currentRoomId) {
    socket.emit('leaveRoom', { roomId: currentRoomId });
    currentRoomId = '';
    currentRoomData = null;
    window.socketData.online = false;
    window.socketData.host = false;
    MultiplayerUIManager.getInstance().renderTopBar();
    MultiplayerUIManager.getInstance().setTopBarVisible(true);
  }
};

// QUICK MATCH
window.addSocketRandomUser = () => {
  if (!socket) window.initSocket();
  const profile = HistoryLeaderboardManager.getProfile();
  socket?.emit('quickMatch', {
    name: profile.name
  });
};

window.sendGameReaction = (emoji: string) => {
  if (!socket || !currentRoomId) return;
  const myIndex = window.socketData.gameIndex;
  socket.emit('sendReaction', {
    roomId: currentRoomId,
    playerIndex: myIndex,
    emoji: emoji
  });
  if (typeof (window as any).showPlayerReaction === 'function') {
    (window as any).showPlayerReaction(myIndex, emoji);
  }
};

window.switchSocketRoomContent = (_type: string) => {};

window.postSocketCloseRoom = () => {
  window.exitSocketRoom();
};

// RECORD MATCH RESULT IN LEADERBOARD & HISTORY
window.recordMatchResult = (finalScore: number) => {
  const gData = (window as any).gameData;
  const isOnline = window.socketData.online;
  const myIndex = isOnline ? window.socketData.gameIndex : 0;
  const isWin = gData ? gData.player === myIndex : false;
  const playersCount = gData ? gData.players : 2;
  const gameMode = gData?.mode || (gData?.fourcolors?.special ? 'special' : 'classic');

  HistoryLeaderboardManager.addMatch({
    mode: gameMode,
    playersCount: playersCount,
    playerRank: isWin ? 1 : 2,
    winnerName: isWin ? 'You' : `Player ${(gData ? gData.player : 1) + 1}`,
    playerScore: finalScore || 0,
    isWin: isWin,
    durationSeconds: 120
  });

  MultiplayerUIManager.getInstance().renderTopBar();
  MultiplayerUIManager.getInstance().showToast(
    isWin ? '🏆 Victory recorded in History & Leaderboard!' : 'Match completed and recorded in History!',
    isWin ? '🏆' : '📜'
  );
};

// Initialize Socket and UI on startup
window.initSocket('fourcolors');
setTimeout(() => {
  MultiplayerUIManager.getInstance().init();
}, 200);
