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
      mode: 'nomercy',
      special: true
    };

    window.socketData.online = true;
    window.socketData.host = true;
    window.socketData.gameIndex = 0;

    const gData = (window as any).gameData;
    if (gData && currentRoomData) {
      gData.mode = currentRoomData.mode || 'nomercy';
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
      mode: 'nomercy',
      special: true
    };

    window.socketData.online = true;
    window.socketData.host = false;

    const gData = (window as any).gameData;
    if (gData && currentRoomData) {
      gData.mode = currentRoomData.mode || 'nomercy';
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
      gData.names = players.map(p => p.name || 'Player');
      gData.players = players.length;
      gData.isBotArr = players.map(p => !!p.isBot);
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
      if (options.maxPlayers) gData.players = options.maxPlayers;
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

  socket.on('gameAction', (data: any) => {
    console.log('[Socket] gameAction received:', data);
    if (!data || !data.action) return;

    const gData = (window as any).gameData;

    switch (data.action) {
      case 'start':
      case 'startgame': {
        window.socketData.online = true;
        const payload = data.payload;
        if (gData && payload) {
          const gSettings = (window as any).gameSettings;
          const pointsList = gSettings?.points || [500, 250, 1];
          if (payload.players) gData.players = payload.players;
          if (payload.names) gData.names = payload.names;
          if (payload.isBotArr) gData.isBotArr = payload.isBotArr;
          if (!gData.fourcolors) gData.fourcolors = {};
          if (payload.pointIndex !== undefined) {
            gData.pointIndex = payload.pointIndex;
            gData.fourcolors.point = pointsList[payload.pointIndex] !== undefined ? pointsList[payload.pointIndex] : 500;
          }
          if (payload.mode) {
            gData.mode = payload.mode;
            gData.fourcolors.mode = payload.mode;
            gData.fourcolors.special = payload.mode === 'special';
          } else if (payload.special !== undefined) {
            gData.fourcolors.special = payload.special;
            gData.mode = payload.special ? 'special' : 'classic';
            gData.fourcolors.mode = gData.mode;
          }
          if (payload.themeIndex !== undefined) gData.themeIndex = payload.themeIndex;
          if (payload.houseRules && gSettings) {
            gSettings.houseRules = payload.houseRules;
          }

          if (typeof (window as any).prepareCards === 'function') {
            (window as any).prepareCards();
          }
          const $ = (window as any).$;
          if ($ && $.cards && payload.deck && Array.isArray(payload.deck)) {
            gData.cards = payload.deck.map((idx: number) => $.cards[idx]);
          }
          if (typeof (window as any).buildPlayerSequence === 'function') {
            (window as any).buildPlayerSequence();
          }
        }
        MultiplayerUIManager.getInstance().closeModal();
        MultiplayerUIManager.getInstance().setTopBarVisible(false);
        if (typeof (window as any).goPage === 'function') {
          (window as any).goPage('game');
        }
        break;
      }

      case 'syncdeck': {
        window.socketData.online = true;
        if (gData && data.payload) {
          const gSettings = (window as any).gameSettings;
          const pointsList = gSettings?.points || [500, 250, 1];
          if (data.payload.players) gData.players = data.payload.players;
          if (data.payload.names) gData.names = data.payload.names;
          if (data.payload.isBotArr) gData.isBotArr = data.payload.isBotArr;
          if (!gData.fourcolors) gData.fourcolors = {};
          if (data.payload.pointIndex !== undefined) {
            gData.pointIndex = data.payload.pointIndex;
            gData.fourcolors.point = pointsList[data.payload.pointIndex] !== undefined ? pointsList[data.payload.pointIndex] : 500;
          }
          if (data.payload.mode) {
            gData.mode = data.payload.mode;
            gData.fourcolors.mode = data.payload.mode;
            gData.fourcolors.special = data.payload.mode !== 'classic';
          } else if (data.payload.special !== undefined) {
            gData.fourcolors.special = data.payload.special;
            gData.mode = data.payload.special ? 'special' : 'classic';
            gData.fourcolors.mode = gData.mode;
          }
          if (data.payload.themeIndex !== undefined) gData.themeIndex = data.payload.themeIndex;

          if (typeof (window as any).prepareCards === 'function') {
            (window as any).prepareCards();
          }
          const $ = (window as any).$;
          if ($ && $.cards && data.payload.deck && Array.isArray(data.payload.deck)) {
            gData.cards = data.payload.deck.map((idx: number) => $.cards[idx]);
          }
          if (typeof (window as any).buildPlayerSequence === 'function') {
            (window as any).buildPlayerSequence();
          }
        }
        break;
      }

      case 'ready':
        break;

      case 'choosecolor':
        if (gData && gData.match) {
          const chosenColor = data.payload;
          gData.match.value = 0;
          gData.match.color = chosenColor;
          if (typeof (window as any).toggleColors === 'function') {
            (window as any).toggleColors(false);
          }
          if (typeof (window as any).getMatchDetail === 'function') {
            (window as any).getMatchDetail();
          }

          const $ = (window as any).$;
          const curPlayerName = ($ && $.players && $.players['stats' + gData.player] && $.players['stats' + gData.player].playerName)
            ? $.players['stats' + gData.player].playerName.text
            : 'PLAYER ' + (gData.player + 1);

          if (typeof (window as any).showChosenColorStatus === 'function') {
            (window as any).showChosenColorStatus(curPlayerName, chosenColor, () => {
              if (typeof (window as any).checkRoundEnd === 'function') {
                (window as any).checkRoundEnd();
              }
            });
          } else {
            if (typeof (window as any).checkRoundEnd === 'function') {
              (window as any).checkRoundEnd();
            }
          }
        }
        break;

      case 'wildaction':
        if (data.payload) {
          if (data.payload.card === 'givecard' && typeof (window as any).giveCardToPlayer === 'function') {
            (window as any).giveCardToPlayer(data.payload.cardData);
          } else if (data.payload.card === 'drawplayercard') {
            if (gData && gData.turn) gData.turn.drawCount = data.payload.cardData;
            if (typeof (window as any).drawPlayerCard === 'function') {
              (window as any).drawPlayerCard(false);
            }
          } else if (data.payload.card === 'stackdraw') {
            if (gData && gData.turn) {
              gData.turn.pendingDrawStack = 0;
              gData.turn.pendingDrawType = '';
              gData.turn.drawCards = gData.turn.drawCardsTotal = data.payload.cardData;
              gData.turn.loseTurn = true;
            }
            if (typeof (window as any).drawPlayerCard === 'function') {
              (window as any).drawPlayerCard(true);
            }
          } else if (data.payload.card === 'discardplayercard' && typeof (window as any).discardPlayerCard === 'function') {
            (window as any).discardPlayerCard(data.payload.cardData, true);
          } else if (data.payload.card === 'passturn' || data.payload.card === 'checkroundend') {
            if (gData && gData.turn) {
              gData.turn.drawCard = false;
              gData.match.active = false;
            }
            if (typeof (window as any).checkRoundEnd === 'function') {
              (window as any).checkRoundEnd();
            }
          }
        }
        break;

      case 'called':
        if (typeof (window as any).playSound === 'function') {
          (window as any).playSound('soundCall');
        }
        const $ = (window as any).$;
        if ($ && $.players && $.players['called' + data.payload]) {
          $.players['called' + data.payload].visible = true;
          if (typeof (window as any).animateFocus === 'function') {
            (window as any).animateFocus($.players['called' + data.payload]);
          }
        }
        break;

      case 'targetaim':
        if (typeof (window as any).playSound === 'function') {
          (window as any).playSound('soundCall');
        }
        if (typeof (window as any).toggleTargetIcon === 'function') {
          (window as any).toggleTargetIcon(data.payload);
        }
        if (gData && gData.turn) {
          if (gData.turn.swap && typeof (window as any).swapPlayerCards === 'function') {
            (window as any).swapPlayerCards(data.payload);
          } else if (gData.turn.revealCard && typeof (window as any).revealPlayerCards === 'function') {
            (window as any).revealPlayerCards(data.payload);
          } else if (gData.turn.giveCard && typeof (window as any).choosePlayerCards === 'function') {
            (window as any).choosePlayerCards(data.payload);
          }
        }
        break;

      case 'shuffledrawcards':
        if (typeof (window as any).showDrawCard === 'function') {
          (window as any).showDrawCard();
        }
        break;

      case 'cardactioncomplete':
        if (typeof (window as any).loopCardAction === 'function') {
          (window as any).loopCardAction();
        }
        break;

      case 'shuffleplayercards':
        if (data.payload && typeof (window as any).shufflePlayerCards === 'function') {
          (window as any).shufflePlayerCards(data.payload.allCards);
        }
        break;

      case 'calltimer':
        if (typeof (window as any).checkCallPenalty === 'function') {
          (window as any).checkCallPenalty();
        }
        break;

      case 'resultcomplete':
        if (typeof (window as any).startCards === 'function') {
          (window as any).startCards();
        }
        break;
    }
  });

  socket.on('playerDisconnected', (pIdx: any) => {
    MultiplayerUIManager.getInstance().showToast(`A player disconnected. Bot took over.`, '🤖');
    const gData = (window as any).gameData;
    console.log("[Socket] gData exists:", !!gData); if (gData) {
      if (gData.isBotArr && typeof pIdx === 'number' && pIdx >= 0) {
        gData.isBotArr[pIdx] = true;
      }
      if (window.socketData.host) {
        gData.ai = true;
      }
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
  const mode = options.mode || (options.special === false ? 'classic' : 'nomercy');
  socket?.emit('createRoom', {
    name: options.name || profile.name,
    maxPlayers: options.maxPlayers || 4,
    mode: mode,
    special: mode !== 'classic',
    pointIndex: options.pointIndex || 0,
    themeIndex: 0
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
window.startSocketMatch = () => { console.log("[Socket] startSocketMatch called");
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

  const gData = (window as any).gameData;
  const currentRoom = (MultiplayerUIManager.getInstance() as any).currentRoom || currentRoomData;
  const playersList = currentRoom?.players || [];
  const playerNames = playersList.map((p: any) => p.name || 'Player');
  const isBotArr = playersList.map((p: any) => !!p.isBot);
  const selectedMode = currentRoom?.mode || gData?.mode || 'nomercy';

  const myIdx = playersList.findIndex((p: any) => p.id === socket?.id);
  window.socketData.online = true;
  window.socketData.host = true;
  window.socketData.gameIndex = myIdx !== -1 ? myIdx : 0;

  console.log("[Socket] gData exists:", !!gData); if (gData) {
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
      special: selectedMode !== 'classic',
      pointIndex: gData.pointIndex || 0,
      themeIndex: gData.themeIndex || 0
    };

    socket.emit('gameAction', {
      roomId: currentRoomId,
      action: 'syncdeck',
      includeSender: true,
      payload: syncPayload
    });

    socket.emit('gameAction', {
      roomId: currentRoomId,
      action: 'start',
      includeSender: true,
      payload: syncPayload
    });
  }
};

// POST ACTION UPDATE
window.postSocketUpdate = (action: string, data: any = null, broadcast: boolean = false) => {
  if (!socket || !currentRoomId) return;
  socket.emit('gameAction', {
    roomId: currentRoomId,
    action,
    payload: data,
    includeSender: broadcast
  });
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
