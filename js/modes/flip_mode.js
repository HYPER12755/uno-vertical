// --- FLIP MODE ENGINE ---

function createFlipCard(lightSide, darkSide) {
	var card = createCard('flip_' + lightSide.type + '_' + lightSide.color + '_' + lightSide.value, lightSide.color);
	card.lightSide = lightSide;
	card.darkSide = darkSide;
	card.currentSide = 'light';
	card.cardType = lightSide.type;
	card.cardColor = lightSide.color;
	card.cardValue = lightSide.value;
	card.cardPoint = lightSide.point;

	var lightCanvas = getNoMercyCardCanvas(lightSide.type, lightSide.color, lightSide.value, gameData.themeIndex);
	var darkCanvas = getNoMercyCardCanvas(darkSide.type, darkSide.color, darkSide.value, gameData.themeIndex);

	var lightBmp = new createjs.Bitmap(lightCanvas);
	lightBmp.scaleX = lightBmp.scaleY = 0.5;
	lightBmp.regX = 100;
	lightBmp.regY = 150;

	var darkBmp = new createjs.Bitmap(darkCanvas);
	darkBmp.scaleX = darkBmp.scaleY = 0.5;
	darkBmp.regX = 100;
	darkBmp.regY = 150;

	card.lightBmp = lightBmp;
	card.darkBmp = darkBmp;

	card.contentContainer.removeAllChildren();
	card.contentContainer.addChild(lightBmp);

	return card;
}

function switchCardSide(card, targetSide) {
	if (!card || !card.lightSide || !card.darkSide) return;
	card.currentSide = targetSide;
	var side = (targetSide === 'dark') ? card.darkSide : card.lightSide;
	card.cardType = side.type;
	card.cardColor = side.color;
	card.cardValue = side.value;
	card.cardPoint = side.point;

	card.contentContainer.removeAllChildren();
	if (targetSide === 'dark' && card.darkBmp) {
		card.contentContainer.addChild(card.darkBmp);
	} else if (card.lightBmp) {
		card.contentContainer.addChild(card.lightBmp);
	}
}

function flipSingleCardSide(card, targetSide) {
	if (!card) return;
	var halfSpeed = 0.2;
	TweenMax.to(card, halfSpeed, {
		scaleX: 0,
		overwrite: true,
		onComplete: function() {
			switchCardSide(card, targetSide);
			TweenMax.to(card, halfSpeed, {
				scaleX: 1,
				overwrite: true
			});
		}
	});
}

function executeFlip() {
	gameData.flipSide = (gameData.flipSide === 'dark' ? 'light' : 'dark');
	var isDark = (gameData.flipSide === 'dark');
	gameData.colors = isDark ? ['pink', 'teal', 'orange', 'purple'] : ['red', 'blue', 'yellow', 'green'];

	playSound('soundDirection');
	showGameStatus(isDark ? 'flip_dark' : 'flip_light');
	statusPlayerTxt.text = isDark ? "FLIPPED TO DARK SIDE! 🌙" : "FLIPPED TO LIGHT SIDE! ☀️";

	for (var i = 0; i < gameData.cards.length; i++) {
		var card = gameData.cards[i];
		if (!card) continue;
		flipSingleCardSide(card, gameData.flipSide);
	}

	if (gameData.discard.length > 0) {
		var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
		if (topCard) {
			var side = topCard[gameData.flipSide + 'Side'];
			if (side) {
				topCard.cardType = side.type;
				topCard.cardColor = side.color;
				topCard.cardValue = side.value;
				topCard.cardPoint = side.point;
				gameData.match.type = side.type;
				gameData.match.color = side.color;
				gameData.match.value = side.value;
			}
		}
	}

	TweenMax.delayedCall(0.8, function() {
		checkRoundEnd();
	});
}

function buildFlipDeck() {
	// UNO Flip!: 112 Double-Sided Cards
	gameData.flipSide = 'light';
	gameData.colors = ['red', 'blue', 'yellow', 'green'];
	var lightColors = ['red', 'blue', 'yellow', 'green'];
	var darkColors = ['pink', 'teal', 'orange', 'purple'];

	// 1. Number Cards (1 to 9): 2 copies per number per color = 18 * 4 = 72 cards
	for (var c = 0; c < 4; c++) {
		var lColor = lightColors[c];
		var dColor = darkColors[c];
		for (var num = 1; num <= 9; num++) {
			for (var k = 0; k < 2; k++) {
				var lightDef = { type: 'number', color: lColor, value: num, point: num };
				var darkDef = { type: 'number', color: dColor, value: num, point: num };
				var thisCard = createFlipCard(lightDef, darkDef);
			}
		}
	}

	// 2. Action pairs: (2 copies of each per color = 8 cards per action type)
	// Light Draw 1 (+1) <-> Dark Draw 5 (+5)
	for (var c = 0; c < 4; c++) {
		var lColor = lightColors[c];
		var dColor = darkColors[c];
		for (var k = 0; k < 2; k++) {
			var lightDef = { type: 'draw1', color: lColor, value: '', point: 10 };
			var darkDef = { type: 'draw5', color: dColor, value: '', point: 20 };
			var thisCard = createFlipCard(lightDef, darkDef);
			gameData.actionArr.push('draw1');
			gameData.actionArr.push('draw5');
		}
	}

	// Light Skip <-> Dark Skip Everyone
	for (var c = 0; c < 4; c++) {
		var lColor = lightColors[c];
		var dColor = darkColors[c];
		for (var k = 0; k < 2; k++) {
			var lightDef = { type: 'skip', color: lColor, value: '', point: 20 };
			var darkDef = { type: 'darkskipeveryone', color: dColor, value: '', point: 30 };
			var thisCard = createFlipCard(lightDef, darkDef);
			gameData.actionArr.push('skip');
			gameData.actionArr.push('darkskipeveryone');
		}
	}

	// Light Reverse <-> Dark Reverse
	for (var c = 0; c < 4; c++) {
		var lColor = lightColors[c];
		var dColor = darkColors[c];
		for (var k = 0; k < 2; k++) {
			var lightDef = { type: 'reverse', color: lColor, value: '', point: 20 };
			var darkDef = { type: 'reverse', color: dColor, value: '', point: 20 };
			var thisCard = createFlipCard(lightDef, darkDef);
			gameData.actionArr.push('reverse');
		}
	}

	// Light Flip <-> Dark Flip
	for (var c = 0; c < 4; c++) {
		var lColor = lightColors[c];
		var dColor = darkColors[c];
		for (var k = 0; k < 2; k++) {
			var lightDef = { type: 'flip', color: lColor, value: '', point: 20 };
			var darkDef = { type: 'flip', color: dColor, value: '', point: 20 };
			var thisCard = createFlipCard(lightDef, darkDef);
			gameData.actionArr.push('flip');
		}
	}

	// 3. Wild pairs:
	// Light Wild (4 cards) <-> Dark Wild (4 cards)
	for (var k = 0; k < 4; k++) {
		var lightDef = { type: 'wild', color: '', value: '', point: 40 };
		var darkDef = { type: 'darkwild', color: '', value: '', point: 40 };
		var thisCard = createFlipCard(lightDef, darkDef);
		gameData.wildArr.push('wild');
		gameData.wildArr.push('darkwild');
		gameData.excludeMatch.push('wild');
		gameData.excludeMatch.push('darkwild');
	}

	// Light Wild Draw 2 (4 cards) <-> Dark Wild Draw Color (4 cards)
	for (var k = 0; k < 4; k++) {
		var lightDef = { type: 'wilddraw2', color: '', value: '', point: 50 };
		var darkDef = { type: 'wilddrawcolor', color: '', value: '', point: 60 };
		var thisCard = createFlipCard(lightDef, darkDef);
		gameData.wildArr.push('wilddraw2');
		gameData.wildArr.push('wilddrawcolor');
		gameData.excludeMatch.push('wilddraw2');
		gameData.excludeMatch.push('wilddrawcolor');
		gameData.excludeFirst.push('wilddraw2');
		gameData.excludeFirst.push('wilddrawcolor');
	}
}
