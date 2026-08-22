// --- FLEX MODE ENGINE ---

function createFlexCard(cardType, color, value, point, flexColor, flexType, flexValue) {
	var card = createCard('flex_' + cardType + '_' + color + '_' + value, color);
	card.cardType = cardType;
	card.cardColor = color;
	card.cardValue = value;
	card.cardPoint = point;
	card.flexColor = flexColor || color;
	card.flexType = flexType || cardType;
	card.flexValue = flexValue !== undefined ? flexValue : value;
	card.isFlex = true;

	var canvas = getNoMercyCardCanvas(cardType, color, value, gameData.themeIndex);
	var customBmp = new createjs.Bitmap(canvas);
	customBmp.scaleX = customBmp.scaleY = 0.5;
	customBmp.regX = 100;
	customBmp.regY = 150;
	card.contentContainer.removeAllChildren();
	card.contentContainer.addChild(customBmp);

	return card;
}

function buildFlexDeck() {
	// UNO Flex!: 112 Cards with Dual-Color & Dual-Action Flex Mechanics
	gameData.colors = ['red', 'blue', 'yellow', 'green'];
	var colors = ['red', 'blue', 'yellow', 'green'];
	var flexColors = ['yellow', 'green', 'red', 'blue']; // Pairings

	// 1. Flex Number Cards (1-8): 64 cards (2 copies each)
	for (var c = 0; c < 4; c++) {
		var col = colors[c];
		var fCol = flexColors[c];
		for (var num = 1; num <= 8; num++) {
			for (var k = 0; k < 2; k++) {
				var thisCard = createFlexCard('flexnumber', col, num, num, fCol, 'flexnumber', num);
				thisCard.isPowerFlip = (num % 2 !== 0); // Odd numbers recharge power card
			}
		}
	}

	// 2. Flex Color Action Cards: 24 cards
	for (var c = 0; c < 4; c++) {
		var col = colors[c];
		var fCol = flexColors[c];
		// Flex Draw 2 (8 cards)
		for (var k = 0; k < 2; k++) {
			var thisCard = createFlexCard('flexdraw2', col, '', 20, fCol, 'flexdraw2', '');
			gameData.actionArr.push('flexdraw2');
		}
		// Flex Skip (8 cards)
		for (var k = 0; k < 2; k++) {
			var thisCard = createFlexCard('flexskip', col, '', 20, fCol, 'flexskip', '');
			gameData.actionArr.push('flexskip');
		}
		// Flex Reverse (8 cards)
		for (var k = 0; k < 2; k++) {
			var thisCard = createFlexCard('reverse', col, '', 20, fCol, 'reverse', '');
			gameData.actionArr.push('reverse');
		}
	}

	// 3. Flex Wild Cards: 24 cards
	// Flex Wild Draw 4 (8 cards)
	for (var k = 0; k < 8; k++) {
		var thisCard = createFlexCard('flexdraw4', '', '', 50, '', 'flexdraw4', '');
		gameData.wildArr.push('flexdraw4');
		gameData.excludeMatch.push('flexdraw4');
		gameData.excludeFirst.push('flexdraw4');
	}
	// Flex Wild All Draw (8 cards)
	for (var k = 0; k < 8; k++) {
		var thisCard = createFlexCard('flexwildalldraw', '', '', 50, '', 'flexwildalldraw', '');
		gameData.wildArr.push('flexwildalldraw');
		gameData.excludeMatch.push('flexwildalldraw');
		gameData.excludeFirst.push('flexwildalldraw');
	}
	// Regular Wild (8 cards)
	for (var k = 0; k < 8; k++) {
		var thisCard = createFlexCard('wild', '', '', 40, '', 'wild', '');
		gameData.wildArr.push('wild');
		gameData.excludeMatch.push('wild');
	}
}
