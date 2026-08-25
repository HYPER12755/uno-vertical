// --- MODE DETECTION AND ISOLATION SYSTEM ---
var noMercyCardCache = {};

function getActiveGameMode(){
	if (typeof gameData !== 'undefined' && gameData && gameData.mode) return String(gameData.mode).toLowerCase();
	if (typeof gameData !== 'undefined' && gameData && gameData.fourcolors && gameData.fourcolors.mode) return String(gameData.fourcolors.mode).toLowerCase();
	if (typeof window !== 'undefined' && window.socketData && window.socketData.mode) return String(window.socketData.mode).toLowerCase();
	if (typeof socketData !== 'undefined' && socketData && socketData.mode) return String(socketData.mode).toLowerCase();
	return 'classic';
}
window.getActiveGameMode = getActiveGameMode;

function isNoMercyMode(){
	return getActiveGameMode() === 'nomercy';
}
window.isNoMercyMode = isNoMercyMode;

function isFlipMode(){
	return getActiveGameMode() === 'flip';
}
window.isFlipMode = isFlipMode;

function isFlexMode(){
	return getActiveGameMode() === 'flex';
}
window.isFlexMode = isFlexMode;

function isAttackMode(){
	var m = getActiveGameMode();
	return m === 'attack' || m === 'extreme';
}
window.isAttackMode = isAttackMode;

function isAllWildMode(){
	var m = getActiveGameMode();
	return m === 'allwild' || m === 'wild';
}
window.isAllWildMode = isAllWildMode;

function isSpecialMode(){
	return getActiveGameMode() === 'special';
}
window.isSpecialMode = isSpecialMode;

function isClassicMode(){
	var m = getActiveGameMode();
	return m === 'classic' || (!isNoMercyMode() && !isFlipMode() && !isFlexMode() && !isAttackMode() && !isAllWildMode() && !isSpecialMode());
}
window.isClassicMode = isClassicMode;

function getNoMercyCardCanvas(cardType, cardColor, cardValue, themeIndex) {
	var key = cardType + '_' + (cardColor || 'wild') + '_' + (cardValue !== undefined ? cardValue : '') + '_' + (themeIndex || 0);
	if (noMercyCardCache[key]) {
		return noMercyCardCache[key];
	}

	if (typeof SVGCards !== 'undefined' && SVGCards.getCardCanvas) {
		var c = SVGCards.getCardCanvas(cardType, cardColor, cardValue);
		noMercyCardCache[key] = c;
		return c;
	}

	var canvas = document.createElement('canvas');
	if (!canvas) {
		var fake = {};
		return fake;
	}
	canvas.width = 200;
	canvas.height = 300;
	var ctx = canvas.getContext('2d');
	if (ctx) {
		ctx.fillStyle = cardColor || '#e74c3c';
		ctx.fillRect(0, 0, 200, 300);
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 36px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(cardValue !== undefined && cardValue !== '' ? cardValue : cardType, 100, 150);
	}
	noMercyCardCache[key] = canvas;
	return canvas;
}

function getDrawValueOfCard(cardType) {
	if (cardType === 'draw2') return 2;
	if (cardType === 'draw3') return 3;
	if (cardType === 'draw4' || cardType === 'wilddraw4' || cardType === 'wildreversdraw4') return 4;
	if (cardType === 'wilddraw6') return 6;
	if (cardType === 'wilddraw10') return 10;
	return 0;
}
