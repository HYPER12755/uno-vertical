// --- ATTACK MODE ENGINE ---

function triggerAttackLauncher(targetPlayer, numPresses) {
	if (!$.players[targetPlayer]) {
		checkRoundEnd();
		return;
	}

	gameData.turn.animating = true;
	gameData.turn.action = false;

	numPresses = numPresses || 1;
	var pName = $.players["stats" + targetPlayer] ? $.players["stats" + targetPlayer].playerName.text : "Player " + (targetPlayer + 1);
	playSound('soundAction');
	statusPlayerTxt.text = pName + " pressing Launcher (" + numPresses + "x)...";

	var totalCardsEjected = 0;
	// Calculate randomized outcome for each press
	for (var press = 0; press < numPresses; press++) {
		var rand = Math.random();
		if (rand < 0.35) {
			totalCardsEjected += 0;
		} else if (rand < 0.65) {
			totalCardsEjected += Math.floor(Math.random() * 2) + 1; // 1-2
		} else if (rand < 0.85) {
			totalCardsEjected += Math.floor(Math.random() * 2) + 3; // 3-4
		} else {
			totalCardsEjected += Math.floor(Math.random() * 4) + 5; // 5-8
		}
	}

	var ejectedSoFar = 0;
	function ejectStep() {
		if (ejectedSoFar >= totalCardsEjected || (gameData.draw.length === 0 && gameData.discard.length <= 1)) {
			if (totalCardsEjected === 0) {
				playSound('soundColorPick');
				showGameStatus('attack_safe');
			} else {
				playSound('soundWarning');
				showGameStatus('attack_burst');
				statusPlayerTxt.text = "Ejected " + totalCardsEjected + " cards to " + pName + "!";
			}
			TweenMax.delayedCall(1.2, function() {
				gameData.turn.loseTurn = true;
				gameData.turn.animating = false;
				checkRoundEnd();
			});
			return;
		}

		if (gameData.draw.length === 0) {
			recycleDiscardPile();
		}

		if (gameData.draw.length > 0) {
			var cardIdx = gameData.draw[0];
			gameData.draw.splice(0, 1);
			showDrawCard(false);

			$.players[targetPlayer].cards.push(cardIdx);
			ejectedSoFar++;

			var cardObj = $.cards[cardIdx];
			if (cardObj) {
				cardObj.cardDeal = true;
				cardObj.x = -(gameSettings.cardW / 2);
				cardObj.y = 0;
				
				var initRot = 0;
				if($.players[targetPlayer].dir == 'bottom') initRot = 0;
				else if($.players[targetPlayer].dir == 'top') initRot = 180;
				else if($.players[targetPlayer].dir == 'left') initRot = 90;
				else if($.players[targetPlayer].dir == 'right') initRot = -90;
				cardObj.rotation = initRot;
				
				cardObj.scaleX = 1;
				cardObj.scaleY = 1;
				if(cardObj.shadow){
					cardObj.shadow.x = -(gameSettings.cardW / 2) + (gameSettings.cardShadowX || 5);
					cardObj.shadow.y = 0 + (gameSettings.cardShadowY || 5);
					cardObj.shadow.rotation = initRot;
				}

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

			TweenMax.delayedCall(0.12, ejectStep);
		} else {
			gameData.turn.loseTurn = true;
			gameData.turn.animating = false;
			checkRoundEnd();
		}
	}

	TweenMax.delayedCall(0.5, function() {
		if (totalCardsEjected === 0) {
			playSound('soundAlert');
			showGameStatus('attack_safe');
			statusPlayerTxt.text = pName + " survived (0 cards)!";
			TweenMax.delayedCall(1, function() {
				gameData.turn.loseTurn = true;
				gameData.turn.animating = false;
				checkRoundEnd();
			});
		} else {
			playSound('soundAlert');
			statusTxt.text = "LAUNCHER BURST! 🚀";
			statusPlayerTxt.text = "Shooting " + totalCardsEjected + " cards...";
			ejectStep();
		}
	});
}

function buildAttackDeck() {
	// UNO Attack / Extreme: 112 Cards with Launcher Simulation
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

		// Color Action Cards:
		// Hit 2: 2 copies per color = 8 cards
		for (var k = 0; k < 2; k++) {
			createNoMercyCard('hit2', color, '', 20);
			gameData.actionArr.push('hit2');
		}
		// Skip: 2 copies per color = 8 cards
		for (var k = 0; k < 2; k++) {
			createNoMercyCard('skip', color, '', 20);
			gameData.actionArr.push('skip');
		}
		// Reverse: 2 copies per color = 8 cards
		for (var k = 0; k < 2; k++) {
			createNoMercyCard('reverse', color, '', 20);
			gameData.actionArr.push('reverse');
		}
		// Discard All: 1 copy per color = 4 cards
		createNoMercyCard('discardall', color, '', 30);
		gameData.actionArr.push('discardall');
	}

	// Wild Cards:
	// Wild (4 cards)
	for (var k = 0; k < 4; k++) {
		createNoMercyCard('wild', '', '', 50);
		gameData.wildArr.push('wild');
		gameData.excludeMatch.push('wild');
	}
	// Wild Attack-Attack (4 cards)
	for (var k = 0; k < 4; k++) {
		createNoMercyCard('wildattack', '', '', 50);
		gameData.wildArr.push('wildattack');
		gameData.excludeMatch.push('wildattack');
		gameData.excludeFirst.push('wildattack');
	}
}
