// --- ALL WILD MODE ENGINE ---

function buildAllWildDeck() {
	// UNO All Wild: 112 All-Wild Cards
	gameData.colors = ['red', 'blue', 'yellow', 'green'];
	// 1. Classic Wild (28 cards)
	for (var k = 0; k < 28; k++) {
		createNoMercyCard('wild', '', '', 50);
		gameData.wildArr.push('wild');
		gameData.excludeMatch.push('wild');
	}
	// 2. Wild Reverse (20 cards)
	for (var k = 0; k < 20; k++) {
		createNoMercyCard('wildreverse', '', '', 50);
		gameData.wildArr.push('wildreverse');
		gameData.excludeMatch.push('wildreverse');
	}
	// 3. Wild Skip (16 cards)
	for (var k = 0; k < 16; k++) {
		createNoMercyCard('wildskip', '', '', 50);
		gameData.wildArr.push('wildskip');
		gameData.excludeMatch.push('wildskip');
	}
	// 4. Wild Skip Everyone (10 cards)
	for (var k = 0; k < 10; k++) {
		createNoMercyCard('wildskipeveryone', '', '', 50);
		gameData.wildArr.push('wildskipeveryone');
		gameData.excludeMatch.push('wildskipeveryone');
	}
	// 5. Wild Draw 2 (12 cards)
	for (var k = 0; k < 12; k++) {
		createNoMercyCard('wilddraw2', '', '', 50);
		gameData.wildArr.push('wilddraw2');
		gameData.excludeMatch.push('wilddraw2');
		gameData.excludeFirst.push('wilddraw2');
	}
	// 6. Wild Draw 4 (8 cards)
	for (var k = 0; k < 8; k++) {
		createNoMercyCard('wilddraw4', '', '', 50);
		gameData.wildArr.push('wilddraw4');
		gameData.excludeMatch.push('wilddraw4');
		gameData.excludeFirst.push('wilddraw4');
	}
	// 7. Wild Targeted Draw 2 (10 cards)
	for (var k = 0; k < 10; k++) {
		createNoMercyCard('wildtargeteddraw2', '', '', 50);
		gameData.wildArr.push('wildtargeteddraw2');
		gameData.excludeMatch.push('wildtargeteddraw2');
		gameData.excludeFirst.push('wildtargeteddraw2');
	}
	// 8. Wild Forced Swap (8 cards)
	for (var k = 0; k < 8; k++) {
		createNoMercyCard('wildswap', '', '', 50);
		gameData.wildArr.push('wildswap');
		gameData.excludeMatch.push('wildswap');
		gameData.excludeFirst.push('wildswap');
	}
}
