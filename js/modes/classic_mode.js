// --- CLASSIC MODE ENGINE ---

function buildClassicDeck() {
	// CLASSIC UNO MODE: Exactly 108 Standard Cards (No specials, no gimmicks)
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

	// Wilds: 4 Wild + 4 Wild Draw 4 = 8 cards
	for (var k = 0; k < 4; k++) {
		createNoMercyCard('wild', '', '', 50);
		gameData.wildArr.push('wild');
		gameData.excludeMatch.push('wild');

		createNoMercyCard('wilddraw4', '', '', 50);
		gameData.wildArr.push('wilddraw4');
		gameData.excludeMatch.push('wilddraw4');
		gameData.excludeFirst.push('wilddraw4');
	}
}
