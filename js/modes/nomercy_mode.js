// --- NO MERCY MODE ENGINE ---

function createNoMercyCard(cardType, color, value, point) {
	var card = createCard('nomercy_' + cardType + '_' + color + '_' + value, color);
	card.cardType = cardType;
	card.cardColor = color;
	card.cardValue = value;
	card.cardPoint = point;

	var canvas = getNoMercyCardCanvas(cardType, color, value, gameData.themeIndex);
	var customBmp = new createjs.Bitmap(canvas);
	customBmp.scaleX = customBmp.scaleY = 0.5;
	customBmp.regX = 100;
	customBmp.regY = 150;
	card.contentContainer.removeAllChildren();
	card.contentContainer.addChild(customBmp);

	return card;
}

function checkMercyElimination(playerIndex) {
	if (!isNoMercyMode()) return false;
	var isMercyKOEnabled = (gameSettings.houseRules && gameSettings.houseRules.mercyKO !== false);
	if (!isMercyKOEnabled) return false;
	if (playerIndex === undefined) playerIndex = gameData.player;
	if (!$.players[playerIndex] || !$.players[playerIndex].active) return false;

	if ($.players[playerIndex].cards.length >= 25) {
		eliminatePlayerMercy(playerIndex);
		return true;
	}
	return false;
}

function eliminatePlayerMercy(playerIndex) {
	if (!$.players[playerIndex] || !$.players[playerIndex].active) return;
	$.players[playerIndex].active = false;
	gameData.activePlayers--;

	playSound('soundEliminated');
	if ($.players["eliminated" + playerIndex]) {
		$.players["eliminated" + playerIndex].visible = true;
		animateFocus($.players["eliminated" + playerIndex]);
	}

	for (var i = 0; i < $.players[playerIndex].cards.length; i++) {
		var cIdx = $.players[playerIndex].cards[i];
		var cObj = $.cards[cIdx];
		if (cObj && cObj.eliminated) {
			cObj.eliminated.visible = true;
		}
	}

	var pName = $.players["stats" + playerIndex] ? $.players["stats" + playerIndex].playerName.text : "Player " + (playerIndex + 1);
	showGameStatus('mercy_ko');
	statusTxt.text = "MERCY KNOCKOUT! 💀";
	statusPlayerTxt.text = pName + " Eliminated (25+ Cards)";

	if (gameData.activePlayers <= 1) {
		TweenMax.delayedCall(2, function(){
			for (var i = 0; i < gameData.players; i++) {
				if ($.players[i] && $.players[i].active) {
					gameData.player = i;
					break;
				}
			}
			highlightPlayer(false);
			showGameStatus("nomoreplayers");
		});
	}
}

function executeDiscardAll(playerIndex, color) {
	if (!$.players[playerIndex]) return;
	var remainingCards = [];
	var dumpedCards = [];

	for (var i = 0; i < $.players[playerIndex].cards.length; i++) {
		var cIdx = $.players[playerIndex].cards[i];
		var cObj = $.cards[cIdx];
		if (cObj && cObj.cardColor === color) {
			dumpedCards.push(cIdx);
		} else {
			remainingCards.push(cIdx);
		}
	}

	$.players[playerIndex].cards = remainingCards;
	for (var i = 0; i < dumpedCards.length; i++) {
		gameData.discard.push(dumpedCards[i]);
		var thisCard = $.cards[dumpedCards[i]];
		if (thisCard) {
			thisCard.cardDeal = false;
			toggleCardAction(thisCard, false);
			flipCard(thisCard);
			setCardDepth(thisCard);
			TweenMax.to(thisCard, 0.25, {
				x: (gameSettings.cardW / 2) + (Math.random() * 20 - 10),
				y: (Math.random() * 20 - 10),
				rotation: (Math.random() * 30 - 15),
				overwrite: true
			});
		}
	}

	playSound('soundAction');
	positionPlayerCards(playerIndex, true);
	showGameStatus('discardall');
	statusPlayerTxt.text = "Dumped " + dumpedCards.length + " " + color.toUpperCase() + " cards!";
}

function passZeroAllHands() {
	var activeIndices = [];
	for (var i = 0; i < gameData.players; i++) {
		if ($.players[i] && $.players[i].active) {
			activeIndices.push(i);
		}
	}

	if (activeIndices.length <= 1) return;

	var allHands = [];
	for (var i = 0; i < activeIndices.length; i++) {
		var pIdx = activeIndices[i];
		allHands.push($.players[pIdx].cards.slice());
	}

	var shift = (!gameData.turn.reverse) ? 1 : -1;
	for (var i = 0; i < activeIndices.length; i++) {
		var fromIdx = (i - shift + activeIndices.length) % activeIndices.length;
		var pIdx = activeIndices[i];
		$.players[pIdx].cards = allHands[fromIdx];

		var isMe = checkIsPlayer(pIdx);
		for (var c = 0; c < $.players[pIdx].cards.length; c++) {
			var cardObj = $.cards[$.players[pIdx].cards[c]];
			if (!cardObj) continue;
			if (isMe) {
				flipCard(cardObj);
				toggleCardAction(cardObj, true);
			} else {
				flipCardCover(cardObj);
				toggleCardAction(cardObj, false);
			}
		}
		positionPlayerCards(pIdx, true);
	}

	playSound('soundDirection');
	showGameStatus('zero_pass');
	statusPlayerTxt.text = "All hands passed in play direction!";
}

function startColorRoulette(targetPlayer, targetColor) {
	if (!$.players[targetPlayer]) {
		checkRoundEnd();
		return;
	}

	showGameStatus('wildcolorroulette');
	statusPlayerTxt.text = "Drawing until " + targetColor.toUpperCase() + "...";

	var drawnCount = 0;
	function rouletteStep() {
		if (gameData.draw.length === 0) {
			recycleDiscardPile();
		}
		if (gameData.draw.length === 0) {
			gameData.turn.loseTurn = true;
			checkRoundEnd();
			return;
		}

		var cardIdx = gameData.draw[0];
		gameData.draw.splice(0, 1);
		showDrawCard(false);

		$.players[targetPlayer].cards.push(cardIdx);
		drawnCount++;

		var cardObj = $.cards[cardIdx];
		if (cardObj) {
			cardObj.cardDeal = true;
			var isHuman = checkIsPlayer(targetPlayer);
			if (isHuman) {
				flipCard(cardObj);
				toggleCardAction(cardObj, true);
			} else {
				flipCardCover(cardObj);
				toggleCardAction(cardObj, false);
			}
			setCardDepth(cardObj);
			positionPlayerCards(targetPlayer, true);
			playSound('soundCardDeal');
		}

		if (checkMercyElimination(targetPlayer)) {
			checkRoundEnd();
			return;
		}

		if (cardObj && cardObj.cardColor === targetColor) {
			playSound('soundColorPick');
			statusPlayerTxt.text = "Found " + targetColor.toUpperCase() + " after " + drawnCount + " cards!";
			TweenMax.delayedCall(1, function(){
				gameData.turn.loseTurn = true;
				checkRoundEnd();
			});
		} else {
			TweenMax.delayedCall(0.25, rouletteStep);
		}
	}

	TweenMax.delayedCall(0.6, rouletteStep);
}

function buildNoMercyDeck() {
	// UNO Show 'Em No Mercy: 168 Cards
	// 1. Number cards (0-9): 80 cards total
	for (var c = 0; c < gameData.colors.length; c++) {
		var color = gameData.colors[c];
		// 0: 2 copies per color = 8 cards (0-Pass rule)
		for (var k = 0; k < 2; k++) {
			var thisCard = createNoMercyCard('number', color, 0, 0);
			thisCard.isNoMercy0 = true;
		}
		// 1-9: 2 copies per number per color = 72 cards (7 has 7-Swap rule)
		for (var num = 1; num <= 9; num++) {
			for (var k = 0; k < 2; k++) {
				var thisCard = createNoMercyCard('number', color, num, num);
				if (num === 7) thisCard.isNoMercy7 = true;
			}
		}
	}

	// 2. Color Action Cards: 48 cards total (2 copies of each per color)
	var noMercyColorActions = [
		{ type: 'draw2', point: 20, text: 'DRAW 2 CARDS' },
		{ type: 'draw4', point: 20, text: 'DRAW 4 CARDS' },
		{ type: 'discardall', point: 30, text: 'DISCARD ALL COLOR' },
		{ type: 'skipeveryone', point: 30, text: 'SKIP EVERYONE' },
		{ type: 'skip', point: 20, text: 'SKIP TURN' },
		{ type: 'reverse', point: 20, text: 'REVERSE TURN' }
	];

	for (var c = 0; c < gameData.colors.length; c++) {
		var color = gameData.colors[c];
		for (var a = 0; a < noMercyColorActions.length; a++) {
			var act = noMercyColorActions[a];
			for (var k = 0; k < 2; k++) {
				var thisCard = createNoMercyCard(act.type, color, '', act.point);
				gameData.actionArr.push(act.type);
			}
		}
	}

	// 3. Wild Cards: 40 cards total (8 copies of each)
	var noMercyWilds = [
		{ type: 'wilddraw10', point: 50, text: 'WILD DRAW 10 (NO MERCY)' },
		{ type: 'wilddraw6', point: 50, text: 'WILD DRAW 6' },
		{ type: 'wildreversdraw4', point: 50, text: 'WILD REVERSE DRAW 4' },
		{ type: 'wildcolorroulette', point: 50, text: 'WILD COLOR ROULETTE' },
		{ type: 'wild', point: 50, text: 'WILD CARD' }
	];

	for (var w = 0; w < noMercyWilds.length; w++) {
		var wildDef = noMercyWilds[w];
		for (var k = 0; k < 8; k++) {
			var thisCard = createNoMercyCard(wildDef.type, '', '', wildDef.point);
			gameData.wildArr.push(wildDef.type);
			gameData.excludeMatch.push(wildDef.type);
			if (wildDef.type !== 'wild') {
				gameData.excludeFirst.push(wildDef.type);
			}
		}
	}
}
