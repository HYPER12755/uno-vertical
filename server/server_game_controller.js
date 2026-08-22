// Server-Side Authoritative Game Engine & Controller for Multiplayer UNO / Four Colors
// Fully controls game loop, bot decisions, turn handshakes, penalties, and animations

function createDeckForMode(mode) {
  const colors = ['red', 'blue', 'yellow', 'green'];
  const deck = [];
  let cardId = 0;

  function addCard(type, color, value, point, extra = {}) {
    deck.push({
      id: cardId++,
      type: type,
      color: color || '',
      value: value !== undefined ? value : '',
      point: point || (type.startsWith('wild') ? 50 : 20),
      ...extra
    });
  }

  const m = (mode || 'classic').toLowerCase();

  if (m === 'nomercy') {
    // NO MERCY DECK (168 cards)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('draw2', color, '', 20);
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
        addCard('discardall', color, '', 30);
        addCard('skipeveryone', color, '', 30);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 50);
      addCard('wilddraw4', '', '', 50);
      addCard('wilddraw6', '', '', 50);
      addCard('wilddraw10', '', '', 50);
      addCard('wildreversdraw4', '', '', 50);
      addCard('wildcolorroulette', '', '', 50);
    }
  } else if (m === 'allwild') {
    // ALL WILD DECK (112 cards)
    for (let k = 0; k < 32; k++) addCard('wild', '', '', 20);
    for (let k = 0; k < 16; k++) {
      addCard('wilddraw2', '', '', 30);
      addCard('wilddraw4', '', '', 50);
      addCard('wildskip', '', '', 30);
      addCard('wildreverse', '', '', 30);
      addCard('wildskipeveryone', '', '', 40);
    }
  } else if (m === 'flip') {
    // FLIP DECK (112 cards)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('draw1', color, '', 10);
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
        addCard('flip', color, '', 20);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 40);
      addCard('wilddraw2', '', '', 50);
    }
  } else if (m === 'attack') {
    // ATTACK DECK (112 cards)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
        addCard('hit2', color, '', 20);
        addCard('attack', color, '', 25);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 50);
      addCard('wildattack', '', '', 50);
      addCard('wildallattack', '', '', 50);
    }
  } else if (m === 'flex') {
    // FLEX DECK (112 cards)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('draw2', color, '', 20);
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
        addCard('flexskip', color, '', 25);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 50);
      addCard('wilddraw4', '', '', 50);
      addCard('wildflexdraw', '', '', 50);
    }
  } else if (m === 'special') {
    // ACTION SPECIALS (112 cards)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('draw2', color, '', 20);
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 50);
      addCard('wilddraw4', '', '', 50);
      addCard('wildswap', '', '', 50);
      addCard('wildtruesight', '', '', 50);
    }
  } else {
    // CLASSIC UNO DECK (108 cards standard)
    for (const color of colors) {
      addCard('number', color, 0, 0);
      for (let num = 1; num <= 9; num++) {
        for (let k = 0; k < 2; k++) addCard('number', color, num, num);
      }
      for (let k = 0; k < 2; k++) {
        addCard('draw2', color, '', 20);
        addCard('skip', color, '', 20);
        addCard('reverse', color, '', 20);
      }
    }
    for (let k = 0; k < 4; k++) {
      addCard('wild', '', '', 50);
      addCard('wilddraw4', '', '', 50);
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function getCardDrawAmount(type) {
  if (!type) return 0;
  if (type === 'draw1') return 1;
  if (type === 'draw2' || type === 'wilddraw2' || type === 'hit2') return 2;
  if (type === 'draw3') return 3;
  if (type === 'draw4' || type === 'wilddraw4' || type === 'wildreversdraw4' || type === 'attack') return 4;
  if (type === 'wilddraw6') return 6;
  if (type === 'wilddraw10') return 10;
  return 0;
}

class ServerGameSession {
  constructor(roomId, io, roomData) {
    this.roomId = roomId;
    this.io = io;
    this.roomData = roomData;
    this.mode = roomData.mode || (roomData.special ? 'special' : 'classic');
    this.houseRules = roomData.houseRules || {
      stacking: true,
      jumpIn: true,
      drawUntilPlayable: false,
      sevenZero: true,
      mercyKO: true,
      forcePlay: false
    };

    this.deck = createDeckForMode(this.mode);
    this.discardPile = [];
    this.players = (roomData.players || []).map((p, idx) => ({
      id: p.id,
      name: p.name || `Player ${idx + 1}`,
      avatar: p.avatar || idx,
      isBot: !!p.isBot,
      isHost: !!p.isHost,
      hand: [],
      score: 0,
      calledUno: false,
      eliminated: false,
      clientReady: true
    }));

    this.currentTurn = 0;
    this.direction = 1; // 1 = clockwise, -1 = counter-clockwise
    this.currentColor = 'red';
    this.topCard = null;
    this.pendingDrawStack = 0;
    this.pendingDrawType = '';
    this.turnState = 'INIT'; // 'INIT', 'WAITING_PLAYER_ACTION', 'WAITING_COLOR_CHOICE', 'WAITING_TARGET', 'ANIMATING_STEP', 'ROUND_OVER'
    this.currentActionToken = null;
    this.actionSeq = 0;
    this.safetyTimer = null;
    this.botTimer = null;
    this.isOver = false;

    this.initializeGame();
  }

  initializeGame() {
    // Deal 7 cards to each player
    for (let i = 0; i < 7; i++) {
      for (const p of this.players) {
        if (this.deck.length > 0) {
          p.hand.push(this.deck.pop());
        }
      }
    }

    // Pick top starting card (ensure not wild draw 10 / 6 / action if possible)
    let startIndex = this.deck.length - 1;
    while (startIndex >= 0 && (this.deck[startIndex].type.startsWith('wild') || this.deck[startIndex].type.includes('draw') || this.deck[startIndex].type === 'discardall')) {
      startIndex--;
    }
    if (startIndex < 0) startIndex = this.deck.length - 1;

    this.topCard = this.deck.splice(startIndex, 1)[0];
    this.discardPile.push(this.topCard);
    this.currentColor = this.topCard.color || 'red';

    // Broadcast authoritative game start to all clients
    this.io.to(this.roomId).emit('server_game_started', {
      roomId: this.roomId,
      mode: this.mode,
      houseRules: this.houseRules,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isBot: p.isBot,
        isHost: p.isHost,
        cardCount: p.hand.length,
        cards: p.hand
      })),
      topCard: this.topCard,
      currentColor: this.currentColor,
      currentTurn: this.currentTurn,
      direction: this.direction,
      deckRemaining: this.deck.length
    });

    // Start first turn after opening deal animation
    setTimeout(() => {
      this.startPlayerTurn();
    }, 600);
  }

  checkCanPlayCard(card, playerIndex) {
    if (playerIndex !== this.currentTurn) return false;
    if (this.turnState !== 'WAITING_PLAYER_ACTION') return false;

    // Stacking rule check
    if (this.pendingDrawStack > 0) {
      if (!this.houseRules.stacking) return false;
      const cardDrawVal = getCardDrawAmount(card.type);
      const currentStackVal = getCardDrawAmount(this.pendingDrawType || 'draw2');
      return cardDrawVal >= currentStackVal && cardDrawVal > 0;
    }

    if (card.type.startsWith('wild') || card.type === 'wild' || this.mode === 'allwild') {
      return true;
    }

    if (this.topCard) {
      if (card.color && card.color === this.currentColor) return true;
      if (card.type === 'number' && this.topCard.type === 'number' && card.value !== '' && String(card.value) === String(this.topCard.value)) return true;
      if (card.type !== 'number' && card.type === this.topCard.type) return true;
    }

    return false;
  }

  getPlayableCards(playerIndex) {
    const p = this.players[playerIndex];
    if (!p || p.eliminated) return [];
    return p.hand.filter(c => this.checkCanPlayCard(c, playerIndex));
  }

  startPlayerTurn() {
    if (this.isOver) return;
    clearTimeout(this.safetyTimer);
    clearTimeout(this.botTimer);

    // Skip eliminated players
    let loops = 0;
    while (this.players[this.currentTurn]?.eliminated && loops < this.players.length) {
      this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
      loops++;
    }

    const curPlayer = this.players[this.currentTurn];
    if (!curPlayer || curPlayer.eliminated) {
      this.checkEndGame();
      return;
    }

    this.turnState = 'WAITING_PLAYER_ACTION';
    this.actionSeq++;
    this.currentActionToken = `act_${this.actionSeq}_turn_${this.currentTurn}`;

    const playable = this.getPlayableCards(this.currentTurn);

    // Broadcast authoritative turn start ("Now it's your turn")
    this.io.to(this.roomId).emit('server_turn_started', {
      roomId: this.roomId,
      currentTurn: this.currentTurn,
      playerId: curPlayer.id,
      playerName: curPlayer.name,
      isBot: curPlayer.isBot,
      topCard: this.topCard,
      currentColor: this.currentColor,
      direction: this.direction,
      pendingDrawStack: this.pendingDrawStack,
      pendingDrawType: this.pendingDrawType,
      playableCardIds: playable.map(c => c.id),
      canDraw: true,
      actionToken: this.currentActionToken,
      message: `Now it's ${curPlayer.name}'s turn`
    });

    if (curPlayer.isBot) {
      this.handleBotTurn(curPlayer);
    } else {
      // Safety timeout for disconnected/idle human (auto-play bot turn after 8s)
      this.safetyTimer = setTimeout(() => {
        if (this.turnState === 'WAITING_PLAYER_ACTION' && this.players[this.currentTurn]?.id === curPlayer.id) {
          console.log(`[Game] Player ${curPlayer.name} AFK, bot taking over turn`);
          this.io.to(this.roomId).emit('gameMessage', `${curPlayer.name} didn't respond in time... bot taking over this turn.`);
          this.handleBotTurn(curPlayer);
        }
      }, 8000);
    }
  }

  handleBotTurn(botPlayer) {
    const thinkTime = 200 + Math.floor(Math.random() * 150);
    this.botTimer = setTimeout(() => {
      if (this.turnState !== 'WAITING_PLAYER_ACTION') return;

      const playable = this.getPlayableCards(this.currentTurn);

      if (this.pendingDrawStack > 0) {
        if (playable.length > 0) {
          // Bot stacks the highest draw card
          let chosen = playable[0];
          for (const card of playable) {
            if (getCardDrawAmount(card.type) > getCardDrawAmount(chosen.type)) {
              chosen = card;
            }
          }
          this.executeCardPlay(this.currentTurn, chosen.id);
        } else {
          // Bot surrenders to stack
          this.executeDrawStackSurrender(this.currentTurn);
        }
        return;
      }

      if (playable.length > 0) {
        // Smart bot prioritization: DiscardAll > WildDraw > Action > Number
        let chosen = playable[0];
        for (const card of playable) {
          if (card.type === 'discardall') {
            chosen = card;
            break;
          } else if (card.type.startsWith('wilddraw') || card.type === 'skipeveryone') {
            chosen = card;
          }
        }
        this.executeCardPlay(this.currentTurn, chosen.id);
      } else {
        // Bot draws card from deck
        this.executeDrawCard(this.currentTurn);
      }
    }, thinkTime);
  }

  executeCardPlay(playerIndex, cardId) {
    const p = this.players[playerIndex];
    if (!p || p.eliminated) return;

    const cardIdx = p.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;

    const card = p.hand.splice(cardIdx, 1)[0];
    this.discardPile.push(card);
    this.topCard = card;

    if (card.color && !card.type.startsWith('wild')) {
      this.currentColor = card.color;
    }

    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_play_${card.id}`;
    this.currentActionToken = stepToken;

    // Check if player now has UNO (1 card left)
    const isUno = p.hand.length === 1;

    // Calculate penalty stacking effects
    const drawAmt = getCardDrawAmount(card.type);
    if (drawAmt > 0) {
      if (this.houseRules.stacking) {
        this.pendingDrawStack += drawAmt;
        this.pendingDrawType = card.type;
      } else {
        this.pendingDrawStack = drawAmt;
        this.pendingDrawType = card.type;
      }
    }

    // Direction reversal
    if (card.type === 'reverse' || card.type === 'wildreverse') {
      const activeCount = this.players.filter(pl => !pl.eliminated).length;
      if (activeCount > 2) {
        this.direction *= -1;
      }
    }

    // Broadcast card played to all clients
    this.io.to(this.roomId).emit('server_card_played', {
      roomId: this.roomId,
      playerIndex: playerIndex,
      playerName: p.name,
      card: card,
      cardCount: p.hand.length,
      topCard: this.topCard,
      currentColor: this.currentColor,
      direction: this.direction,
      pendingDrawStack: this.pendingDrawStack,
      pendingDrawType: this.pendingDrawType,
      isUno: isUno,
      actionToken: stepToken
    });

    // Check win condition
    if (p.hand.length === 0) {
      setTimeout(() => {
        this.handleRoundWon(playerIndex);
      }, 300);
      return;
    }

    // Check if wild color choice needed
    const isWild = card.type.startsWith('wild') || card.type === 'wild' || !card.color;
    if (isWild) {
      this.turnState = 'WAITING_COLOR_CHOICE';
      if (p.isBot) {
        // Bot picks most prominent color in hand
        const colorCounts = { red: 0, blue: 0, yellow: 0, green: 0 };
        for (const c of p.hand) {
          if (c.color && colorCounts[c.color] !== undefined) colorCounts[c.color]++;
        }
        let bestColor = 'red';
        let maxC = -1;
        for (const [col, count] of Object.entries(colorCounts)) {
          if (count > maxC) {
            maxC = count;
            bestColor = col;
          }
        }
        setTimeout(() => {
          this.executeColorChoice(playerIndex, bestColor);
        }, 120);
      } else {
        this.io.to(this.roomId).emit('server_request_color', {
          roomId: this.roomId,
          playerIndex: playerIndex,
          actionToken: stepToken
        });
      }
      return;
    }

    // Handle Discard All (No Mercy)
    if (card.type === 'discardall' && card.color) {
      const dumped = [];
      p.hand = p.hand.filter(c => {
        if (c.color === card.color && c.id !== card.id) {
          dumped.push(c);
          return false;
        }
        return true;
      });
      if (dumped.length > 0) {
        this.io.to(this.roomId).emit('server_discard_all_executed', {
          roomId: this.roomId,
          playerIndex: playerIndex,
          dumpedCards: dumped,
          remainingCount: p.hand.length
        });
      }
      if (p.hand.length === 0) {
        setTimeout(() => this.handleRoundWon(playerIndex), 400);
        return;
      }
    }

    // Handle 7-0 rule
    if (this.houseRules.sevenZero && card.type === 'number') {
      if (card.value === 7) {
        // 7 Swap Hands
        this.turnState = 'WAITING_TARGET';
        const nextTarget = this.getNextPlayerIndex(playerIndex, this.direction);
        if (p.isBot) {
          setTimeout(() => this.executeSwapHands(playerIndex, nextTarget), 150);
        } else {
          this.io.to(this.roomId).emit('server_request_target', {
            roomId: this.roomId,
            sourcePlayer: playerIndex,
            targetOptions: this.players.map((pl, i) => i).filter(i => i !== playerIndex && !this.players[i].eliminated),
            actionToken: stepToken
          });
        }
        return;
      } else if (card.value === 0) {
        // 0 Rotate All Hands
        this.executeRotateAllHands();
        return;
      }
    }

    // Await client animation handshake ("I'm done") or advance safely
    this.waitForClientDoneAndAdvance(card);
  }

  executeSwapHands(sourcePlayerIndex, targetPlayerIndex) {
    const p1 = this.players[sourcePlayerIndex];
    const p2 = this.players[targetPlayerIndex];
    if (!p1 || !p2) {
      this.finishActionAndPassTurn(this.topCard);
      return;
    }

    const tempHand = p1.hand;
    p1.hand = p2.hand;
    p2.hand = tempHand;

    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_swap`;
    this.currentActionToken = stepToken;

    this.io.to(this.roomId).emit('server_swap_executed', {
      roomId: this.roomId,
      sourcePlayer: sourcePlayerIndex,
      targetPlayer: targetPlayerIndex,
      p1Cards: p1.hand,
      p2Cards: p2.hand,
      actionToken: stepToken
    });

    this.waitForClientDoneAndAdvance(this.topCard);
  }

  executeRotateAllHands() {
    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_rotate0`;
    this.currentActionToken = stepToken;

    const activeIndices = this.players.map((p, i) => i).filter(i => !this.players[i].eliminated);
    if (activeIndices.length > 1) {
      const firstHand = this.players[activeIndices[0]].hand;
      if (this.direction === 1) {
        for (let i = 0; i < activeIndices.length - 1; i++) {
          this.players[activeIndices[i]].hand = this.players[activeIndices[i + 1]].hand;
        }
        this.players[activeIndices[activeIndices.length - 1]].hand = firstHand;
      } else {
        const lastHand = this.players[activeIndices[activeIndices.length - 1]].hand;
        for (let i = activeIndices.length - 1; i > 0; i--) {
          this.players[activeIndices[i]].hand = this.players[activeIndices[i - 1]].hand;
        }
        this.players[activeIndices[0]].hand = lastHand;
      }
    }

    this.io.to(this.roomId).emit('server_rotate_all_hands', {
      roomId: this.roomId,
      players: this.players.map(p => ({ id: p.id, cardCount: p.hand.length, cards: p.hand })),
      direction: this.direction,
      actionToken: stepToken
    });

    this.waitForClientDoneAndAdvance(this.topCard);
  }

  executeColorChoice(playerIndex, chosenColor) {
    this.currentColor = chosenColor || 'red';
    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_color_${this.currentColor}`;
    this.currentActionToken = stepToken;

    this.io.to(this.roomId).emit('server_color_chosen', {
      roomId: this.roomId,
      playerIndex: playerIndex,
      chosenColor: this.currentColor,
      actionToken: stepToken
    });

    this.waitForClientDoneAndAdvance(this.topCard);
  }

  executeDrawCard(playerIndex) {
    const p = this.players[playerIndex];
    if (!p || p.eliminated) return;

    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_draw`;
    this.currentActionToken = stepToken;

    this.ensureDeckHasCards();

    if (this.deck.length === 0) {
      this.finishActionAndPassTurn(null);
      return;
    }

    const drawnCard = this.deck.pop();
    p.hand.push(drawnCard);

    this.io.to(this.roomId).emit('server_card_drawn', {
      roomId: this.roomId,
      playerIndex: playerIndex,
      playerName: p.name,
      card: drawnCard,
      cardCount: p.hand.length,
      deckRemaining: this.deck.length,
      actionToken: stepToken
    });

    // Check Mercy KO (25+ cards)
    if (this.houseRules.mercyKO && p.hand.length >= 25) {
      this.eliminatePlayerMercy(playerIndex);
      return;
    }

    // If drawn card is immediately playable and forcePlay enabled
    if (this.checkCanPlayCard(drawnCard, playerIndex) && this.houseRules.forcePlay) {
      setTimeout(() => {
        this.executeCardPlay(playerIndex, drawnCard.id);
      }, 250);
      return;
    }

    // End turn after draw
    setTimeout(() => {
      this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
      this.startPlayerTurn();
    }, 180);
  }

  executeDrawStackSurrender(playerIndex) {
    const p = this.players[playerIndex];
    if (!p || p.eliminated) return;

    const cardsToDraw = this.pendingDrawStack;
    this.pendingDrawStack = 0;
    this.pendingDrawType = '';
    this.turnState = 'ANIMATING_STEP';
    this.actionSeq++;
    const stepToken = `act_${this.actionSeq}_penalty_${cardsToDraw}`;
    this.currentActionToken = stepToken;

    const drawn = [];
    for (let i = 0; i < cardsToDraw; i++) {
      this.ensureDeckHasCards();
      if (this.deck.length > 0) {
        const c = this.deck.pop();
        p.hand.push(c);
        drawn.push(c);
      }
    }

    this.io.to(this.roomId).emit('server_stack_penalty_applied', {
      roomId: this.roomId,
      playerIndex: playerIndex,
      playerName: p.name,
      count: drawn.length,
      drawnCards: drawn,
      totalHandCount: p.hand.length,
      deckRemaining: this.deck.length,
      actionToken: stepToken
    });

    // Check Mercy KO
    if (this.houseRules.mercyKO && p.hand.length >= 25) {
      this.eliminatePlayerMercy(playerIndex);
      return;
    }

    // Victim loses turn after drawing penalty stack
    setTimeout(() => {
      this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
      this.startPlayerTurn();
    }, 280);
  }

  executeJumpIn(playerIndex, cardId) {
    if (!this.houseRules.jumpIn) return;
    const p = this.players[playerIndex];
    if (!p || p.eliminated || playerIndex === this.currentTurn) return;

    const cardIdx = p.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;

    const card = p.hand[cardIdx];
    // Jump-in requires exact color and value match to top card
    if (this.topCard && card.color === this.topCard.color && card.value !== '' && String(card.value) === String(this.topCard.value)) {
      p.hand.splice(cardIdx, 1);
      this.discardPile.push(card);
      this.topCard = card;
      this.currentTurn = playerIndex;

      this.io.to(this.roomId).emit('server_jump_in_executed', {
        roomId: this.roomId,
        playerIndex: playerIndex,
        playerName: p.name,
        card: card,
        cardCount: p.hand.length
      });

      if (p.hand.length === 0) {
        setTimeout(() => this.handleRoundWon(playerIndex), 400);
      } else {
        this.waitForClientDoneAndAdvance(card);
      }
    }
  }

  eliminatePlayerMercy(playerIndex) {
    const p = this.players[playerIndex];
    if (!p) return;
    p.eliminated = true;

    this.io.to(this.roomId).emit('server_player_eliminated', {
      roomId: this.roomId,
      playerIndex: playerIndex,
      playerName: p.name,
      reason: 'Mercy Rule (25+ cards)'
    });

    const active = this.players.filter(pl => !pl.eliminated);
    if (active.length <= 1) {
      this.checkEndGame();
    } else {
      setTimeout(() => {
        this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
        this.startPlayerTurn();
      }, 400);
    }
  }

  waitForClientDoneAndAdvance(card) {
    clearTimeout(this.safetyTimer);
    // Safe advance fallback in case client network drops
    this.safetyTimer = setTimeout(() => {
      this.finishActionAndPassTurn(card);
    }, 2000);
  }

  handleClientActionDone(data) {
    if (data && data.actionToken === this.currentActionToken && this.turnState === 'ANIMATING_STEP') {
      clearTimeout(this.safetyTimer);
      this.finishActionAndPassTurn(this.topCard);
    }
  }

  finishActionAndPassTurn(card) {
    if (this.isOver) return;

    if (card) {
      if (card.type === 'skip' || card.type === 'wildskip') {
        this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
      } else if (card.type === 'skipeveryone' || card.type === 'wildskipeveryone') {
        // Current player takes another turn!
        this.startPlayerTurn();
        return;
      }
    }

    this.currentTurn = this.getNextPlayerIndex(this.currentTurn, this.direction);
    this.startPlayerTurn();
  }

  getNextPlayerIndex(current, dir) {
    const count = this.players.length;
    let next = (current + dir + count) % count;
    let loops = 0;
    while (this.players[next]?.eliminated && loops < count) {
      next = (next + dir + count) % count;
      loops++;
    }
    return next;
  }

  ensureDeckHasCards() {
    if (this.deck.length === 0 && this.discardPile.length > 1) {
      const top = this.discardPile.pop();
      this.deck = this.discardPile;
      this.discardPile = [top];
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
      this.io.to(this.roomId).emit('server_deck_reshuffled', {
        roomId: this.roomId,
        deckRemaining: this.deck.length
      });
    }
  }

  handleRoundWon(winnerIndex) {
    this.isOver = true;
    clearTimeout(this.safetyTimer);
    clearTimeout(this.botTimer);

    const winner = this.players[winnerIndex];
    let roundPoints = 0;
    for (const p of this.players) {
      if (p !== winner) {
        for (const c of p.hand) roundPoints += (c.point || 10);
      }
    }
    if (winner) winner.score += roundPoints;

    this.io.to(this.roomId).emit('server_round_ended', {
      roomId: this.roomId,
      winnerIndex: winnerIndex,
      winnerName: winner?.name || 'Winner',
      roundPoints: roundPoints,
      scores: this.players.map(p => p.score),
      hands: this.players.map(p => p.hand)
    });
  }

  checkEndGame() {
    const active = this.players.filter(p => !p.eliminated);
    if (active.length === 1) {
      const winnerIndex = this.players.indexOf(active[0]);
      this.handleRoundWon(winnerIndex);
    }
  }

  cleanup() {
    this.isOver = true;
    clearTimeout(this.safetyTimer);
    clearTimeout(this.botTimer);
  }
}

// Active game sessions store
const activeSessions = new Map();

function startServerGameSession(roomId, io, roomData) {
  if (activeSessions.has(roomId)) {
    activeSessions.get(roomId).cleanup();
  }
  const session = new ServerGameSession(roomId, io, roomData);
  activeSessions.set(roomId, session);
  return session;
}

function getServerGameSession(roomId) {
  return activeSessions.get(roomId);
}

function removeServerGameSession(roomId) {
  if (activeSessions.has(roomId)) {
    activeSessions.get(roomId).cleanup();
    activeSessions.delete(roomId);
  }
}

function handleClientGameMessage(io, socket, rooms, data) {
  if (!data || !data.roomId) return;
  const session = getServerGameSession(data.roomId);
  if (!session) return;

  const playerIndex = session.players.findIndex(p => p.id === socket.id);
  if (playerIndex === -1 && data.type !== 'spectator') return;

  switch (data.type) {
    case 'player_play_card':
      if (session.currentTurn === playerIndex && session.turnState === 'WAITING_PLAYER_ACTION') {
        session.executeCardPlay(playerIndex, data.cardId);
      }
      break;

    case 'player_draw_card':
      if (session.currentTurn === playerIndex && session.turnState === 'WAITING_PLAYER_ACTION') {
        session.executeDrawCard(playerIndex);
      }
      break;

    case 'player_stack_surrender':
      if (session.currentTurn === playerIndex && session.turnState === 'WAITING_PLAYER_ACTION') {
        session.executeDrawStackSurrender(playerIndex);
      }
      break;

    case 'player_choose_color':
      if (session.currentTurn === playerIndex && session.turnState === 'WAITING_COLOR_CHOICE') {
        session.executeColorChoice(playerIndex, data.color);
      }
      break;

    case 'player_target_aim':
      if (session.currentTurn === playerIndex && session.turnState === 'WAITING_TARGET') {
        session.executeSwapHands(playerIndex, data.targetIndex);
      }
      break;

    case 'player_jump_in':
      session.executeJumpIn(playerIndex, data.cardId);
      break;

    case 'player_action_done':
      session.handleClientActionDone(data);
      break;

    case 'player_call_uno':
      if (session.players[playerIndex]) {
        session.players[playerIndex].calledUno = true;
        io.to(data.roomId).emit('server_uno_called', {
          playerIndex: playerIndex,
          playerName: session.players[playerIndex].name
        });
      }
      break;
  }
}

module.exports = {
  createDeckForMode,
  ServerGameSession,
  startServerGameSession,
  getServerGameSession,
  removeServerGameSession,
  handleClientGameMessage
};
