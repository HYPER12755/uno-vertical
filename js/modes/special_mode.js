// --- SPECIAL MODE ENGINE ---

function startWildDrawColor(targetPlayer, targetColor) {
	if (!$.players[targetPlayer]) {
		checkRoundEnd();
		return;
	}

	showGameStatus('wilddrawcolor');
	var pName = $.players["stats" + targetPlayer] ? $.players["stats" + targetPlayer].playerName.text : "Player " + (targetPlayer + 1);
	statusPlayerTxt.text = pName + " drawing until " + targetColor.toUpperCase() + "...";

	var drawnCount = 0;
	function drawColorStep() {
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

		var cardCol = cardObj ? (cardObj.cardColor || (cardObj.darkSide && cardObj.darkSide.color)) : '';
		if (cardCol === targetColor) {
			playSound('soundColorPick');
			statusPlayerTxt.text = "Drew " + drawnCount + " cards to find " + targetColor.toUpperCase() + "!";
			TweenMax.delayedCall(1, function(){
				gameData.turn.loseTurn = true;
				checkRoundEnd();
			});
		} else {
			TweenMax.delayedCall(0.25, drawColorStep);
		}
	}

	TweenMax.delayedCall(0.6, drawColorStep);
}

function forceAllOtherPlayersDraw(sourcePlayer, drawAmount) {
	var targetPlayers = [];
	for(var p = 0; p < gameData.players; p++){
		if(p !== sourcePlayer && $.players[p] && $.players[p].active){
			targetPlayers.push(p);
		}
	}

	if(targetPlayers.length === 0){
		checkRoundEnd();
		return;
	}

	gameData.turn.animating = true;
	gameData.turn.action = false;

	var dealQueue = [];
	for(var d = 0; d < drawAmount; d++){
		for(var t = 0; t < targetPlayers.length; t++){
			dealQueue.push(targetPlayers[t]);
		}
	}

	var stepIndex = 0;
	function stepNextMultiDeal(){
		if(stepIndex >= dealQueue.length){
			gameData.turn.animating = false;
			TweenMax.delayedCall(0.4, function(){
				checkRoundEnd();
			});
			return;
		}

		if(gameData.draw.length === 0){
			recycleDiscardPile();
		}

		if(gameData.draw.length === 0){
			gameData.turn.animating = false;
			checkRoundEnd();
			return;
		}

		var targetP = dealQueue[stepIndex];
		stepIndex++;

		var cardIdx = gameData.draw[0];
		gameData.draw.splice(0, 1);
		showDrawCard(false);

		$.players[targetP].cards.push(cardIdx);
		var cObj = $.cards[cardIdx];
		if(cObj){
			cObj.cardDeal = true;
			cObj.x = -(gameSettings.cardW / 2);
			cObj.y = 0;
			
			var initRot = 0;
			if($.players[targetP].dir == 'bottom') initRot = 0;
			else if($.players[targetP].dir == 'top') initRot = 180;
			else if($.players[targetP].dir == 'left') initRot = 90;
			else if($.players[targetP].dir == 'right') initRot = -90;
			cObj.rotation = initRot;
			
			cObj.scaleX = 1;
			cObj.scaleY = 1;

			var isHuman = checkIsPlayer(targetP);
			if(isHuman){
				flipCard(cObj);
				toggleCardAction(cObj, true);
			}else{
				flipCardCover(cObj);
				toggleCardAction(cObj, false);
			}
			setCardDepth(cObj);
			playSound('soundCardDeal');
			positionPlayerCards(targetP, true);
		}

		checkMercyElimination(targetP);
		TweenMax.delayedCall(0.18, stepNextMultiDeal);
	}

	TweenMax.delayedCall(0.25, stepNextMultiDeal);
}

function buildSpecialDeck() {
	// SPECIAL / ACTION WILDS MODE: 112 Cards (108 Standard + 7 Special Wild Cards)
	gameData.colors = ['red', 'blue', 'yellow', 'green'];
	for (var c = 0; c < gameData.colors.length; c++) {
		var color = gameData.colors[c];
		// 0: 1 copy per color = 4 cards
		createNoMercyCard('number', color, 0, 0);

		// 1-9: 2 copies per number per color = 72 cards
		for (var num = 1; num <= 9; num++) {
			for (var k = 0; k < 2; k++) {
				createNoMercyCard('number', color, num, num);
			}
		}

		// Color Actions: 2 Draw 2, 2 Skip, 2 Reverse per color = 24 cards
		for (var k = 0; k < 2; k++) {
			createNoMercyCard('draw2', color, '', 20);
			gameData.actionArr.push('draw2');
			createNoMercyCard('skip', color, '', 20);
			gameData.actionArr.push('skip');
			createNoMercyCard('reverse', color, '', 20);
			gameData.actionArr.push('reverse');
		}
	}

	// Standard Wilds: 4 Wild + 4 Wild Draw 4 = 8 cards
	for (var k = 0; k < 4; k++) {
		createNoMercyCard('wild', '', '', 50);
		gameData.wildArr.push('wild');
		gameData.excludeMatch.push('wild');

		createNoMercyCard('wilddraw4', '', '', 50);
		gameData.wildArr.push('wilddraw4');
		gameData.excludeMatch.push('wilddraw4');
		gameData.excludeFirst.push('wilddraw4');
	}

	// Special Wilds: 7 Special Action Wilds
	var specials = [
		'truesight', 'oneforme', 'devildeal', 'charity',
		'targeteddraw2', 'eliminatedplayer', 'frozencolor'
	];
	for (var s = 0; s < specials.length; s++) {
		createNoMercyCard(specials[s], '', '', 50);
		gameData.specialArr.push(specials[s]);
		gameData.excludeMatch.push(specials[s]);
		gameData.excludeFirst.push(specials[s]);
	}
}
