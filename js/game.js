////////////////////////////////////////////////////////////
// GAME v1.0
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//themes
var themes_arr = [
	{
		front:"assets/themes1/theme_front.png",
		highlight:"assets/themes1/theme_highlight.png",
		shadow:"assets/themes1/theme_shadow.png",
		eliminated:"assets/themes1/theme_eliminated.png",
		red:{
			background:'assets/themes1/theme_red_bg.png',
			numbers:[
				'assets/themes1/theme_red_0.png',
				'assets/themes1/theme_red_1.png',
				'assets/themes1/theme_red_2.png',
				'assets/themes1/theme_red_3.png',
				'assets/themes1/theme_red_4.png',
				'assets/themes1/theme_red_5.png',
				'assets/themes1/theme_red_6.png',
				'assets/themes1/theme_red_7.png',
				'assets/themes1/theme_red_8.png',
				'assets/themes1/theme_red_9.png',
			],
			actions:[
				'assets/themes1/theme_red_draw.png',
				'assets/themes1/theme_red_reverse.png',
				'assets/themes1/theme_red_skip.png',
			]
		},
		yellow:{
			background:'assets/themes1/theme_yellow_bg.png',
			numbers:[
				'assets/themes1/theme_yellow_0.png',
				'assets/themes1/theme_yellow_1.png',
				'assets/themes1/theme_yellow_2.png',
				'assets/themes1/theme_yellow_3.png',
				'assets/themes1/theme_yellow_4.png',
				'assets/themes1/theme_yellow_5.png',
				'assets/themes1/theme_yellow_6.png',
				'assets/themes1/theme_yellow_7.png',
				'assets/themes1/theme_yellow_8.png',
				'assets/themes1/theme_yellow_9.png',
			],
			actions:[
				'assets/themes1/theme_yellow_draw.png',
				'assets/themes1/theme_yellow_reverse.png',
				'assets/themes1/theme_yellow_skip.png',
			]
		},
		blue:{
			background:'assets/themes1/theme_blue_bg.png',
			numbers:[
				'assets/themes1/theme_blue_0.png',
				'assets/themes1/theme_blue_1.png',
				'assets/themes1/theme_blue_2.png',
				'assets/themes1/theme_blue_3.png',
				'assets/themes1/theme_blue_4.png',
				'assets/themes1/theme_blue_5.png',
				'assets/themes1/theme_blue_6.png',
				'assets/themes1/theme_blue_7.png',
				'assets/themes1/theme_blue_8.png',
				'assets/themes1/theme_blue_9.png',
			],
			actions:[
				'assets/themes1/theme_blue_draw.png',
				'assets/themes1/theme_blue_reverse.png',
				'assets/themes1/theme_blue_skip.png',
			]
		},
		green:{
			background:'assets/themes1/theme_green_bg.png',
			numbers:[
				'assets/themes1/theme_green_0.png',
				'assets/themes1/theme_green_1.png',
				'assets/themes1/theme_green_2.png',
				'assets/themes1/theme_green_3.png',
				'assets/themes1/theme_green_4.png',
				'assets/themes1/theme_green_5.png',
				'assets/themes1/theme_green_6.png',
				'assets/themes1/theme_green_7.png',
				'assets/themes1/theme_green_8.png',
				'assets/themes1/theme_green_9.png',
			],
			actions:[
				'assets/themes1/theme_green_draw.png',
				'assets/themes1/theme_green_reverse.png',
				'assets/themes1/theme_green_skip.png',
			]
		},
		wilds:[
			'assets/themes1/theme_wild.png',
			'assets/themes1/theme_wilddraw.png',
		],
		specials:[
			'assets/themes1/theme_truesight.png',
			'assets/themes1/theme_oneforme.png',
			'assets/themes1/theme_devildeal.png',
			'assets/themes1/theme_charity.png',
			'assets/themes1/theme_targeteddraw2.png',
			'assets/themes1/theme_eliminatedplayer.png',
			'assets/themes1/theme_frozencolor.png',
		]
	}
];

var cards_arr = {
	numbers:[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9],
	actions:[
		{type:'draw2', point:20, image:'assets/icon_draw2.png', text:'DRAW 2 CARDS'},
		{type:'draw4', point:20, image:'', text:'DRAW 4 CARDS'},
		{type:'discardall', point:30, image:'', text:'DISCARD ALL COLOR'},
		{type:'skipeveryone', point:30, image:'', text:'SKIP EVERYONE'},
		{type:'reverse', point:20, image:'assets/icon_reverse.png', text:'REVERSE TURN'},
		{type:'skip', point:20, image:'assets/icon_skip.png', text:'SKIP TURN'},
	],
	wilds:[
		{type:'wild', point:50, image:'assets/icon_wild.png', text:'WILD CARD'},
		{type:'wilddraw4', point:50, image:'assets/icon_wilddraw4.png', text:'DRAW 4 CARDS'},
		{type:'wilddraw6', point:50, image:'', text:'WILD DRAW 6'},
		{type:'wilddraw10', point:50, image:'', text:'WILD DRAW 10 (NO MERCY)'},
		{type:'wildreversdraw4', point:50, image:'', text:'WILD REVERSE DRAW 4'},
		{type:'wildcolorroulette', point:50, image:'', text:'WILD COLOR ROULETTE'},
	],
	specials:[
		{type:'truesight', point:50, image:'assets/icon_truesight.png', text:'REVEAL PLAYER CARDS'},
		{type:'oneforme', point:50, image:'assets/icon_oneforme.png', text:'DRAW 1 CARD'},
		{type:'devildeal', point:50, image:'assets/icon_devildeal.png', text:'REVERSE, SKIP AND DRAW 2 CARDS'},
		{type:'charity', point:50, image:'assets/icon_charity.png', text:'HADN 2 CARDS TO TARGETED PLAYER'},
		{type:'targeteddraw2', point:50, image:'assets/icon_targeteddraw2.png', text:'DRAW 2 CARDS TO TARGETED PLAYER'},
		{type:'eliminatedplayer', point:50, image:'assets/icon_eliminatedplayer.png', text:'ELIMINATE PLAYER'},
		{type:'frozencolor', point:50, image:'assets/icon_frozencolor.png', text:'FROZEN COLOR FOR A TURN'}
	],
	otherActions:[]
};

// --- UNO SHOW 'EM NO MERCY PROCEDURAL GRAPHICS GENERATOR ---
var noMercyCardCache = {};

function isNoMercyMode(){
	if (gameData && gameData.mode === 'nomercy') return true;
	if (gameData && gameData.fourcolors && gameData.fourcolors.mode === 'nomercy') return true;
	if (typeof window !== 'undefined' && window.socketData && window.socketData.mode === 'nomercy') return true;
	return false;
}
window.isNoMercyMode = isNoMercyMode;

function isFlipMode(){
	if (typeof gameData !== 'undefined' && gameData && gameData.mode === 'flip') return true;
	if (typeof gameData !== 'undefined' && gameData && gameData.fourcolors && (gameData.fourcolors.mode === 'flip' || gameData.fourcolors.flip)) return true;
	if (typeof socketData !== 'undefined' && socketData && socketData.mode === 'flip') return true;
	if (typeof window !== 'undefined' && window.socketData && window.socketData.mode === 'flip') return true;
	return false;
}
window.isFlipMode = isFlipMode;

function isFlexMode(){
	if (typeof gameData !== 'undefined' && gameData && gameData.mode === 'flex') return true;
	if (typeof gameData !== 'undefined' && gameData && gameData.fourcolors && (gameData.fourcolors.mode === 'flex' || gameData.fourcolors.flex)) return true;
	if (typeof socketData !== 'undefined' && socketData && socketData.mode === 'flex') return true;
	if (typeof window !== 'undefined' && window.socketData && window.socketData.mode === 'flex') return true;
	return false;
}
window.isFlexMode = isFlexMode;

function isAttackMode(){
	if (typeof gameData !== 'undefined' && gameData && (gameData.mode === 'attack' || gameData.mode === 'extreme')) return true;
	if (typeof gameData !== 'undefined' && gameData && gameData.fourcolors && (gameData.fourcolors.mode === 'attack' || gameData.fourcolors.attack)) return true;
	if (typeof socketData !== 'undefined' && socketData && (socketData.mode === 'attack' || socketData.mode === 'extreme')) return true;
	if (typeof window !== 'undefined' && window.socketData && (window.socketData.mode === 'attack' || window.socketData.mode === 'extreme')) return true;
	return false;
}
window.isAttackMode = isAttackMode;

function isAllWildMode(){
	if (typeof gameData !== 'undefined' && gameData && (gameData.mode === 'allwild' || gameData.mode === 'wild')) return true;
	if (typeof gameData !== 'undefined' && gameData && gameData.fourcolors && (gameData.fourcolors.mode === 'allwild' || gameData.fourcolors.allwild)) return true;
	if (typeof socketData !== 'undefined' && socketData && (socketData.mode === 'allwild' || socketData.mode === 'wild')) return true;
	if (typeof window !== 'undefined' && window.socketData && window.socketData.mode === 'allwild' || window.socketData.mode === 'wild') return true;
	return false;
}
window.isAllWildMode = isAllWildMode;

function getNoMercyCardCanvas(cardType, cardColor, cardValue, themeIndex) {
	var key = cardType + '_' + (cardColor || 'wild') + '_' + (cardValue !== undefined ? cardValue : '') + '_' + (themeIndex || 0);
	if (noMercyCardCache[key]) {
		return noMercyCardCache[key];
	}

	var canvas = document.createElement('canvas');
	canvas.width = 200;
	canvas.height = 300;
	var ctx = canvas.getContext('2d');

	if (typeof SVGCards !== 'undefined') {
		var svgImg = new Image();
		svgImg.src = SVGCards.getSVGDataURL(cardColor || 'wild', cardType, cardValue);
		svgImg.onload = function() {
			ctx.clearRect(0, 0, 200, 300);
			ctx.drawImage(svgImg, 0, 0, 200, 300);
			if (typeof stage !== 'undefined' && stage.update) {
				stage.update();
			}
		};
	}

	var colorMap = {
		red: { bg: '#d63031', grad: '#ff7675', dark: '#b71540' },
		blue: { bg: '#0984e3', grad: '#74b9ff', dark: '#0c2461' },
		yellow: { bg: '#f1c40f', grad: '#ffeaa7', dark: '#e58e26' },
		green: { bg: '#27ae60', grad: '#55efc4', dark: '#079992' },
		pink: { bg: '#ff2a85', grad: '#ff70a6', dark: '#990045' },
		teal: { bg: '#00f0ff', grad: '#80f8ff', dark: '#008b99' },
		orange: { bg: '#ff7700', grad: '#ffa64d', dark: '#b34700' },
		purple: { bg: '#9d4edd', grad: '#c77dff', dark: '#5a189a' },
		wild: { bg: '#1e272e', grad: '#485460', dark: '#000000' },
		darkwild: { bg: '#08080c', grad: '#181824', dark: '#000000' }
	};

	var cTheme = colorMap[cardColor] || colorMap.wild;
	var isWild = !cardColor || cardColor === '' || cardColor === 'wild';

	// 1. Base card rounded rectangle
	ctx.save();
	ctx.beginPath();
	if (ctx.roundRect) {
		ctx.roundRect(4, 4, 192, 292, 16);
	} else {
		ctx.rect(4, 4, 192, 292);
	}
	ctx.clip();

	// Background
	var bgGrad = ctx.createLinearGradient(0, 0, 200, 300);
	if (isWild) {
		bgGrad.addColorStop(0, '#111111');
		bgGrad.addColorStop(0.5, '#222f3e');
		bgGrad.addColorStop(1, '#0a0a0a');
	} else {
		bgGrad.addColorStop(0, cTheme.grad);
		bgGrad.addColorStop(0.5, cTheme.bg);
		bgGrad.addColorStop(1, cTheme.dark);
	}
	ctx.fillStyle = bgGrad;
	ctx.fillRect(0, 0, 200, 300);

	// Card Border
	if (isWild) {
		var rimGrad = ctx.createLinearGradient(0, 0, 200, 0);
		rimGrad.addColorStop(0, '#e74c3c');
		rimGrad.addColorStop(0.33, '#f1c40f');
		rimGrad.addColorStop(0.66, '#2ecc71');
		rimGrad.addColorStop(1, '#3498db');
		ctx.lineWidth = 6;
		ctx.strokeStyle = rimGrad;
		ctx.strokeRect(6, 6, 188, 288);
	} else {
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255,255,255,0.85)';
		ctx.strokeRect(6, 6, 188, 288);
	}

	// 2. Central Oval
	ctx.save();
	ctx.translate(100, 150);
	ctx.rotate(-22 * Math.PI / 180);
	ctx.beginPath();
	if (ctx.ellipse) {
		ctx.ellipse(0, 0, 68, 105, 0, 0, 2 * Math.PI);
	} else {
		ctx.arc(0, 0, 68, 0, 2 * Math.PI);
	}
	if (isWild) {
		var ovalGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 80);
		ovalGrad.addColorStop(0, '#2d3436');
		ovalGrad.addColorStop(1, '#000000');
		ctx.fillStyle = ovalGrad;
	} else {
		ctx.fillStyle = '#ffffff';
	}
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = isWild ? '#e74c3c' : 'rgba(0,0,0,0.15)';
	ctx.stroke();
	ctx.restore();

	// 3. Central Icon / Typography & Corner Numerals
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	if (cardType === 'wilddraw10') {
		ctx.font = '900 64px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = '#e74c3c';
		ctx.shadowBlur = 15;
		ctx.fillText('+10', 100, 142);
		ctx.shadowBlur = 0;
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#c0392b';
		ctx.strokeText('+10', 100, 142);

		ctx.font = 'bold 12px "Arial Black", sans-serif';
		ctx.fillStyle = '#ff7675';
		ctx.fillText('💥 NO MERCY', 100, 195);

		drawCorners(ctx, '+10', '#ffffff', 20);
	} else if (cardType === 'wilddraw6') {
		ctx.font = '900 74px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = '#e67e22';
		ctx.shadowBlur = 12;
		ctx.fillText('+6', 100, 142);
		ctx.shadowBlur = 0;
		ctx.lineWidth = 4;
		ctx.strokeStyle = '#d35400';
		ctx.strokeText('+6', 100, 142);

		ctx.font = 'bold 12px "Arial Black", sans-serif';
		ctx.fillStyle = '#f39c12';
		ctx.fillText('DRAW 6', 100, 195);

		drawCorners(ctx, '+6', '#ffffff', 22);
	} else if (cardType === 'wildreversdraw4') {
		ctx.font = '900 44px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.shadowColor = '#9b59b6';
		ctx.shadowBlur = 10;
		ctx.fillText('⇄ +4', 100, 140);
		ctx.shadowBlur = 0;
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#8e44ad';
		ctx.strokeText('⇄ +4', 100, 140);

		ctx.font = 'bold 11px "Arial Black", sans-serif';
		ctx.fillStyle = '#a29bfe';
		ctx.fillText('REV DRAW 4', 100, 190);

		drawCorners(ctx, '⇄4', '#ffffff', 18);
	} else if (cardType === 'wildcolorroulette') {
		drawRouletteWheel(ctx, 100, 138, 46);

		ctx.font = 'bold 12px "Arial Black", sans-serif';
		ctx.fillStyle = '#f1c40f';
		ctx.fillText('🎰 ROULETTE', 100, 202);

		drawCorners(ctx, '🎰', '#ffffff', 20);
	} else if (cardType === 'wild') {
		drawWildOval(ctx, 100, 145, 42);
		drawCorners(ctx, '★', '#ffffff', 22);
	} else if (cardType === 'draw4') {
		ctx.font = '900 76px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('+4', 100, 145);
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ffffff';
		ctx.strokeText('+4', 100, 145);

		drawCorners(ctx, '+4', '#ffffff', 24);
	} else if (cardType === 'draw2') {
		ctx.font = '900 78px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('+2', 100, 145);
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ffffff';
		ctx.strokeText('+2', 100, 145);

		drawCorners(ctx, '+2', '#ffffff', 24);
	} else if (cardType === 'skipeveryone') {
		ctx.font = 'bold 36px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('🚫🚫', 100, 130);
		ctx.font = 'bold 13px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('SKIP ALL', 100, 168);

		drawCorners(ctx, '🚫🚫', '#ffffff', 16);
	} else if (cardType === 'discardall') {
		ctx.font = '900 32px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('DUMP', 100, 135);
		ctx.font = 'bold 12px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('DISCARD ALL', 100, 168);

		drawCorners(ctx, '⬇️', '#ffffff', 20);
	} else if (cardType === 'skip') {
		ctx.font = 'bold 64px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('⊘', 100, 145);
		drawCorners(ctx, '⊘', '#ffffff', 24);
	} else if (cardType === 'reverse') {
		ctx.font = 'bold 64px "Arial Black", sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText('⇄', 100, 145);
		drawCorners(ctx, '⇄', '#ffffff', 24);
	} else if (cardType === 'number') {
		var numStr = String(cardValue !== undefined ? cardValue : 0);
		ctx.font = '900 84px "Arial Black", Impact, sans-serif';
		ctx.fillStyle = cTheme.bg;
		ctx.fillText(numStr, 100, 145);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ffffff';
		ctx.strokeText(numStr, 100, 145);

		if (cardValue === 7 && isNoMercyMode()) {
			ctx.font = 'bold 12px "Arial Black", sans-serif';
			ctx.fillStyle = cTheme.bg;
			ctx.fillText('🔀 SWAP', 100, 192);
		} else if (cardValue === 0 && isNoMercyMode()) {
			ctx.font = 'bold 12px "Arial Black", sans-serif';
			ctx.fillStyle = cTheme.bg;
			ctx.fillText('🔁 PASS', 100, 192);
		}

		drawCorners(ctx, numStr, '#ffffff', 24);
	}

	ctx.restore();
	noMercyCardCache[key] = canvas;
	return canvas;
}

function drawCorners(ctx, text, color, fontSize) {
	ctx.save();
	ctx.font = '900 ' + fontSize + 'px "Arial Black", Impact, sans-serif';
	ctx.fillStyle = color;
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText(text, 12, 12);

	ctx.save();
	ctx.translate(188, 288);
	ctx.rotate(Math.PI);
	ctx.fillText(text, 0, 0);
	ctx.restore();

	ctx.restore();
}

function drawRouletteWheel(ctx, x, y, radius) {
	var colors = ['#e74c3c', '#f1c40f', '#27ae60', '#0984e3'];
	for (var i = 0; i < 4; i++) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, radius, i * Math.PI / 2, (i + 1) * Math.PI / 2);
		ctx.closePath();
		ctx.fillStyle = colors[i];
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ffffff';
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI);
	ctx.fillStyle = '#ffffff';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#2d3436';
	ctx.stroke();
}

function drawWildOval(ctx, x, y, radius) {
	var colors = ['#e74c3c', '#0984e3', '#f1c40f', '#27ae60'];
	for (var i = 0; i < 4; i++) {
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, radius, i * Math.PI / 2, (i + 1) * Math.PI / 2);
		ctx.closePath();
		ctx.fillStyle = colors[i];
		ctx.fill();
	}
	ctx.beginPath();
	ctx.arc(x, y, 14, 0, 2 * Math.PI);
	ctx.fillStyle = '#111111';
	ctx.fill();
	ctx.font = 'bold 9px "Arial Black", sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('WILD', x, y);
}

function getDrawValueOfCard(cardType) {
	if (cardType === 'draw2') return 2;
	if (cardType === 'draw3') return 3;
	if (cardType === 'draw4' || cardType === 'wilddraw4' || cardType === 'wildreversdraw4') return 4;
	if (cardType === 'wilddraw6') return 6;
	if (cardType === 'wilddraw10') return 10;
	return 0;
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
	for(var p = 0; p < gameData.players; p++){
		if(p !== sourcePlayer && $.players[p] && $.players[p].active){
			for(var d = 0; d < drawAmount; d++){
				if(gameData.draw.length === 0){
					recycleDiscardPile();
				}
				if(gameData.draw.length > 0){
					var cardIdx = gameData.draw[0];
					gameData.draw.splice(0, 1);
					$.players[p].cards.push(cardIdx);
					var cObj = $.cards[cardIdx];
					if(cObj){
						cObj.cardDeal = true;
						if(checkIsPlayer(p)){
							flipCard(cObj);
							toggleCardAction(cObj, true);
						}else{
							flipCardCover(cObj);
							toggleCardAction(cObj, false);
						}
					}
				}
			}
			positionPlayerCards(p, true);
		}
	}
}

function triggerAttackLauncher(targetPlayer, numPresses) {
	if (!$.players[targetPlayer]) {
		checkRoundEnd();
		return;
	}

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

//game settings
var gameSettings = {
	cardW:100,
	cardH:150,
	cardSpace:50,
	cardShadowX:5,
	cardShadowY:5,
	cardMoveSpeed:.35,
	cardDealSpeed:.25,
	cardFlipSpeed:.25,
	aiThinkSpeed:1.1,
	playerCards:7, //total player cards
	penaltyCards:0, //total penalty cards
	lastCardCallTimer:1, //last card call timer
	points:[500,250,1], //score points option (500, 250, 1 Round)
	houseRules: {
		jumpIn: true,
		drawUntilPlayable: false,
		challenge4: true,
		stacking: true,
		mercyKO: true,
		swap70: true
	}
};

//game text display
var textDisplay = {
					optionsTitle:'OPTIONS',
					tutorialTitle:'HOW TO PLAY?',
					totalPlayers:"[NUMBER] PLAYERS",
					goalPoint:"GOAL [NUMBER]PTS",
					modes:["CLASSIC","SPECIAL","NO MERCY","FLIP!","FLEX!","ATTACK!","ALL WILD!"],
					playerName:'PLAYER [NUMBER]',
					playerScore:'[NUMBER]PTS',
					playerPenalty:'PENALTY 2 CARDS',
					userPickColor:'PICK COLORS',
					playerPickColor:'PICKING COLORS',
					playerTarget:'TARGET A PLAYER',
					playerTargeting:'TARGETING PLAYERS',
					selectCards:'SELECT TWO CARDS',
					selectingCards:'SELECTING TWO CARDS',
					emptyCards:"NO CARDS LEFT",
					noMorePlayers:"NO MORE PLAYERS",
					playerWon:' WON',
					playerRoundWin:"YOU WIN THIS ROUND",
					playerRoundLose:"YOU LOSE THIS ROUND",
					goalPointTitle:"GOAL POINT ([NUMBER]PTS)",
					playerScoreAdd:" (+[NUMBER]PTS)",
					userWin:"YOU WIN THE GAME",
					playerWin:"[NAME] WIN THE GAME",
					exitTitle:'EXIT GAME',
					exitMessage:'Are you sure you want\nto quit game?',
					share:'SHARE YOUR SCORE:',
					resultTitle:"GAME OVER",
					resultDesc:'[NUMBER]PTS',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = false; //toggle share
var shareTitle = 'Highscore on Four Colors is [SCORE]PTS';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Four Colors game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, scores:[]};
var gameData = {paused:true, colors:['red','blue','yellow','green'], moving:false, player:0, players:0, pointIndex:0, themeIndex:0, drawing:false, ai:true, complete:false, names:[]};
var tweenData = {score:0, tweenScore:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	document.addEventListener("visibilitychange", () => {
		if(document.visibilityState==='visible'){
			toggleMusicInMute(false);
			TweenMax.resumeAll();
		}else{
			toggleMusicInMute(true);
			TweenMax.pauseAll();
		}
	  });
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	buttonPlay.cursor = "pointer";
	buttonPlay.addEventListener("click", function(evt) {
		playSound('soundButton');
		if (typeof MultiplayerUIManager !== 'undefined' && MultiplayerUIManager.getInstance) {
			MultiplayerUIManager.getInstance().openOnlineHubModal();
		} else if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			goPage("options");
		}
	});

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		if (typeof MultiplayerUIManager !== 'undefined' && MultiplayerUIManager.getInstance) {
			MultiplayerUIManager.getInstance().openLocalPlayModal();
		} else {
			socketData.online = false;
			goPage("options");
		}
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		if (typeof MultiplayerUIManager !== 'undefined' && MultiplayerUIManager.getInstance) {
			MultiplayerUIManager.getInstance().openOnlineHubModal();
		} else {
			checkQuickGameMode();
		}
	});

	buttonPlayersL.cursor = "pointer";
	buttonPlayersL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTotalPlayers(false);
	});

	buttonPlayersR.cursor = "pointer";
	buttonPlayersR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTotalPlayers(true);
	});

	buttonPointsL.cursor = "pointer";
	buttonPointsL.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePoints(false);
	});

	buttonPointsR.cursor = "pointer";
	buttonPointsR.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePoints(true);
	});

	buttonTypeL.cursor = "pointer";
	buttonTypeL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameType(false);
	});

	buttonTypeR.cursor = "pointer";
	buttonTypeR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleGameType(true);
	});

	buttonThemeL.cursor = "pointer";
	buttonThemeL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTheme(false);
	});

	buttonThemeR.cursor = "pointer";
	buttonThemeR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTheme(true);
	});

	buttonTutorialL.cursor = "pointer";
	buttonTutorialL.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTutorial(false);
	});

	buttonTutorialR.cursor = "pointer";
	buttonTutorialR.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleTutorial(true);
	});

	buttonNext.cursor = "pointer";
	buttonNext.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleCardsOptions(2);
	});

	buttonTutorial.cursor = "pointer";
	buttonTutorial.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleCardsOptions(3);
	});

	buttonBack.cursor = "pointer";
	buttonBack.addEventListener("click", function(evt) {
		playSound('soundButton');
		toggleCardsOptions(gameData.lastOption);
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('start');
		}
		goPage("game");
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	// buttonFullscreen.cursor = "pointer";
	// buttonFullscreen.addEventListener("click", function(evt) {
	// 	toggleFullScreen();
	// });
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	window.addEventListener('blur', function() {
		TweenMax.ticker.useRAF(false);
	}, false);


	window.addEventListener('focus', function() {
		TweenMax.ticker.useRAF(true);
	}, false);

	for(var n=0; n<4; n++){
		$.colors[n].colorIndex = n;
		$.colors[n].cursor = "pointer";
		$.colors[n].addEventListener("click", function(evt) {
			var proceedClick = checkIsPlayer(gameData.player);
			if(proceedClick && colorsContainer.visible){
				var cIdx = (evt.currentTarget && evt.currentTarget.colorIndex !== undefined) ? evt.currentTarget.colorIndex : evt.target.colorIndex;
				var chosenColor = gameData.colors[cIdx] || 'red';
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('choosecolor', chosenColor, false);
				}
				gameData.match.value = 0;
				gameData.match.color = chosenColor;
				toggleColors(false);
				getMatchDetail();

				var curPlayerName = ($.players["stats" + gameData.player] && $.players["stats" + gameData.player].playerName) ? $.players["stats" + gameData.player].playerName.text : "PLAYER " + (gameData.player + 1);
				showChosenColorStatus(curPlayerName, chosenColor, function(){
					if (gameData.turn.isRoulette) {
						gameData.turn.isRoulette = false;
						var victim = findNextPlayer(gameData.player);
						startColorRoulette(victim, chosenColor);
					} else if (gameData.turn.isWildDrawColor) {
						gameData.turn.isWildDrawColor = false;
						var victim = findNextPlayer(gameData.player);
						startWildDrawColor(victim, chosenColor);
					} else {
						checkRoundEnd();
					}
				});
			}
		});
	}

	gameData.fourcolors = {
		maxPlayers:4,
		minPlayers:2,
		special:false,
		point:20,
	};
	
	gameData.players = gameData.fourcolors.minPlayers;
	gameData.pointIndex = 0;
	gameData.themeIndex = 0;
	gameData.lastThemeIndex = -1;
	gameData.lastOption = 1;
	gameData.tutorial = 1;

	displayCardsOptions();
}

function checkIsPlayer(player){
	var isPlayer = false;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && typeof socketData.gameIndex === 'number') {
		if(player === socketData.gameIndex){
			isPlayer = true;
		}
	}else{
		if(player === 0){
			isPlayer = true;
		}
	}
	return isPlayer;
}

function buildPlayerSequence(){
	gameData.seq = [];
	var myIndex = 0;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && typeof socketData.gameIndex === 'number') {
		myIndex = socketData.gameIndex;
	} else {
		myIndex = 0;
	}
	var count = myIndex;
	for(var n=0; n<gameData.players; n++){
		gameData.seq.push(count);
		count++;
		if(count >= gameData.players){
			count = 0;
		}
	}
}

/*!
 * 
 * TOGGLE GAME TYPE - This is the function that runs to toggle game type
 * 
 */
function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonPlay.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'default'){
		buttonPlay.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonPlay.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

function toggleTotalPlayers(con){
	if(con){
		gameData.players++;
		gameData.players = gameData.players > gameData.fourcolors.maxPlayers ? gameData.fourcolors.maxPlayers : gameData.players;
	}else{
		gameData.players--;
		gameData.players = gameData.players < gameData.fourcolors.minPlayers ? gameData.fourcolors.minPlayers : gameData.players;
	}

	updateCardsOption();
}

function togglePoints(con){
	if(con){
		gameData.pointIndex++;
		gameData.pointIndex = gameData.pointIndex > gameSettings.points.length-1 ? gameSettings.points.length-1 : gameData.pointIndex;
	}else{
		gameData.pointIndex--;
		gameData.pointIndex = gameData.pointIndex < 0 ? 0 : gameData.pointIndex;
	}

	updateCardsOption();
}

function toggleGameType(con){
	if (typeof gameData.modeIndex === 'undefined') {
		gameData.modeIndex = 0;
	}
	var modeKeys = ['classic', 'special', 'nomercy', 'flip', 'flex', 'attack', 'allwild'];
	if (typeof con === 'boolean') {
		if (con) {
			gameData.modeIndex = (gameData.modeIndex + 1) % textDisplay.modes.length;
		} else {
			gameData.modeIndex = (gameData.modeIndex - 1 + textDisplay.modes.length) % textDisplay.modes.length;
		}
	} else if (typeof con === 'number') {
		gameData.modeIndex = con;
	}
	var mKey = modeKeys[gameData.modeIndex] || 'classic';
	gameData.mode = mKey;
	if (gameData.fourcolors) {
		gameData.fourcolors.mode = mKey;
		gameData.fourcolors.special = (gameData.modeIndex !== 0);
	}
	if (typeof socketData !== 'undefined' && socketData) {
		socketData.mode = mKey;
	}

	updateCardsOption();
}

function toggleTheme(con){
	if(con){
		gameData.themeIndex++;
		gameData.themeIndex = gameData.themeIndex > themes_arr.length-1 ? themes_arr.length-1 : gameData.themeIndex;
	}else{
		gameData.themeIndex--;
		gameData.themeIndex = gameData.themeIndex < 0 ? 0 : gameData.themeIndex;
	}

	updateCardsOption();
}

function updateCardsOption(){
	displayCardsOptions();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			postSocketUpdate('updateoptions', {players:gameData.players, pointIndex:gameData.pointIndex, special:gameData.fourcolors.special, themeIndex:gameData.themeIndex, option:gameData.lastOption}, true);
		}
	}
}

function displayCardsOptions(){
	totalPlayersTxt.text = textDisplay.totalPlayers.replace("[NUMBER]", gameData.players);
	var ptVal = gameSettings.points[gameData.pointIndex] !== undefined ? gameSettings.points[gameData.pointIndex] : 500;
	if (ptVal === 1) {
		pointsTxt.text = "1 ROUND";
	} else {
		pointsTxt.text = textDisplay.goalPoint.replace("[NUMBER]", ptVal);
	}
	if (typeof gameData.modeIndex === 'undefined') {
		gameData.modeIndex = 0;
	}
	typeTxt.text = textDisplay.modes[gameData.modeIndex] || textDisplay.modes[0];

	gameData.fourcolors.point = ptVal;

	//theme
	if(gameData.lastThemeIndex != gameData.themeIndex){
		buildCards();
		gameData.lastThemeIndex = gameData.themeIndex;

		themeContainer.removeAllChildren();
		
		shuffle(gameData.cards);
		gameData.cardFront = gameData.cards[0].frontContainer.clone(true);
		gameData.cardContent = gameData.cards[0].contentContainer.clone(true);
		themeContainer.addChild(gameData.cardFront, gameData.cardContent);
		flipOptionCard();
	}
}

function flipOptionCard(){
	if(curPage == 'options'){
		playSound('soundCardFlip');
	}
	gameData.cardFront.visible = gameData.cardContent.visible = true;
	gameData.cardFront.scaleX = gameData.cardFront.scaleY = gameData.cardContent.scaleX = gameData.cardContent.scaleY = 1.3;
	gameData.cardContent.scaleX = 0;
	
	var flipSpeed = gameSettings.cardFlipSpeed;
	TweenMax.to(gameData.cardFront, flipSpeed, {delay:flipSpeed, scaleX:0});
	TweenMax.to(gameData.cardContent, flipSpeed, {delay:flipSpeed*2, scaleX:1.3});
}

function toggleCardsOptions(page){
	itemPlayerNumbers.visible = false;
	totalPlayersTxt.visible = false;
	buttonPlayersL.visible = false;
	buttonPlayersR.visible = false;

	itemPoints.visible = false;
	pointsTxt.visible = false;
	buttonPointsL.visible = false;
	buttonPointsR.visible = false;

	itemType.visible = false;
	typeTxt.visible = false;
	buttonTypeL.visible = false;
	buttonTypeR.visible = false;

	themeContainer.visible = false;
	buttonThemeL.visible = false;
	buttonThemeR.visible = false;

	buttonNext.visible = false;
	buttonStart.visible = false;
	buttonTutorial.visible = false;
	cardsOptionsListContainer.visible = false;

	buttonTutorialL.visible = false;
	buttonTutorialR.visible = false;
	buttonBack.visible = false;
	cardsOptionsTutorialContainer.visible = false;
		
	if(page == 1){
		gameData.lastOption = 1;
		cardsOptionsListContainer.visible = true;
		itemPlayerNumbers.visible = true;
		totalPlayersTxt.visible = true;
		buttonPlayersL.visible = true;
		buttonPlayersR.visible = true;

		itemPoints.visible = true;
		pointsTxt.visible = true;
		buttonPointsL.visible = true;
		buttonPointsR.visible = true;

		itemType.visible = true;
		typeTxt.visible = true;
		buttonTypeL.visible = true;
		buttonTypeR.visible = true;

		buttonNext.visible = true;
		buttonTutorial.visible = true;

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(!socketData.host){
				buttonPlayersL.visible = false;
				buttonPlayersR.visible = false;
				buttonPointsL.visible = false;
				buttonPointsR.visible = false;
				buttonTypeL.visible = false;
				buttonTypeR.visible = false;
				buttonNext.visible = false;
				buttonTutorial.visible = false;
			}
		}
	}else if(page == 2){
		gameData.lastOption = 2;
		cardsOptionsListContainer.visible = true;
		themeContainer.visible = true;
		buttonThemeL.visible = true;
		buttonThemeR.visible = true;
		buttonStart.visible = true;
		buttonTutorial.visible = true;

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {			
			if(!socketData.host){
				buttonThemeL.visible = false;
				buttonThemeR.visible = false;
				buttonStart.visible = false;
				buttonTutorial.visible = false;
			}
		}

		flipOptionCard();
	}else if(page == 3){
		cardsOptionsTutorialContainer.visible = true;
		buttonTutorialL.visible = true;
		buttonTutorialR.visible = true;
		buttonBack.visible = true;

		displayTutorial();
	}

	updateCardsOption();
	resizeGameLayout();
}

function toggleTutorial(con){
	if(con){
		gameData.tutorial++;
		gameData.tutorial = gameData.tutorial > 15 ? 15 : gameData.tutorial;
	}else{
		gameData.tutorial--;
		gameData.tutorial = gameData.tutorial < 1 ? 1 : gameData.tutorial;
	}

	displayTutorial();
}

function displayTutorial(){
	for(var n=0; n<15; n++){
		$.tutorial[n].visible = false;
	}
	$.tutorial[gameData.tutorial-1].visible = true;
	tutorialPageTxt.text = gameData.tutorial+'/15';
	
	buttonTutorialL.visible = true;
	buttonTutorialR.visible = true;
	if(gameData.tutorial == 1){
		buttonTutorialL.visible = false;
	}
	if(gameData.tutorial == 15){
		buttonTutorialR.visible = false;
	}
}

function resizeSocketLog(){
	if(curPage == 'main'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}
	}else if(curPage == 'options'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 70;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 65;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;

	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	cardsOptionsContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var reactionUI = document.getElementById('fc-game-reaction-ui');
	if(reactionUI){
		reactionUI.style.display = (page === 'game') ? 'block' : 'none';
	}
	
	var targetContainer = null;
	if (typeof MultiplayerUIManager !== 'undefined' && MultiplayerUIManager.getInstance) {
		MultiplayerUIManager.getInstance().setTopBarVisible(page !== 'game');
	}

	switch(page){
		case 'main':
			targetContainer = mainContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
				socketData.online = false;
			}
			toggleMainButton('default');
			playMusicLoop("musicGame");
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;

		case 'options':
			targetContainer = cardsOptionsContainer;
			toggleCardsOptions(1);
		break;
		
		case 'game':
			targetContainer = gameContainer;
			// playMusicLoop("musicGame");
			// stopMusicLoop("musicMain");
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			
			// playMusicLoop("musicMain");
			// stopMusicLoop("musicGame");
			playSound('soundResult');
			tweenData.tweenScore = 0;

			var myPlayerIndex = 0;
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				myPlayerIndex = socketData.gameIndex;
				playerData.score = playerData.scores[socketData.gameIndex];
				
				if(socketData.host){
					postSocketCloseRoom();
				}
			}else{
				myPlayerIndex = 0;
				playerData.score = playerData.scores[0];
			}

			tweenData.tweenScore = 0;
			TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
				resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', addCommas(Math.floor(tweenData.tweenScore)));
			}});

			saveGame(playerData.score);

			if (typeof window.recordMatchResult === 'function') {
				var highestScore = -1;
				var winnerIdx = 0;
				var scoresArr = [];
				for(var i=0; i<gameData.players; i++){
					var sc = (playerData.scores && playerData.scores[i]) || 0;
					scoresArr.push({idx: i, score: sc});
					if(sc > highestScore){
						highestScore = sc;
						winnerIdx = i;
					}
				}
				scoresArr.sort(function(a,b){ return b.score - a.score; });
				var myRank = scoresArr.findIndex(function(s){ return s.idx === myPlayerIndex; }) + 1;
				if(myRank <= 0) myRank = 1;
				var isWin = (myPlayerIndex === winnerIdx);
				var winnerName = ($.players && $.players["stats" + winnerIdx] && $.players["stats" + winnerIdx].playerName) ? $.players["stats" + winnerIdx].playerName.text : ('Player ' + (winnerIdx + 1));
				
				window.recordMatchResult({
					mode: (gameData.fourcolors && gameData.fourcolors.special) ? 'special' : 'classic',
					playersCount: gameData.players,
					playerRank: myRank,
					winnerName: winnerName,
					playerScore: playerData.score || 0,
					isWin: isWin,
					durationSeconds: 60
				});
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	if (typeof window._seed !== 'undefined') {
		window._seed = 1;
	}
	gameData.paused = false;
	playerData.scores = [];

	if (!gameData.fourcolors) gameData.fourcolors = {};
	if (gameData.pointIndex === undefined) gameData.pointIndex = 0;
	if (gameData.fourcolors.point === undefined) {
		gameData.fourcolors.point = gameSettings.points[gameData.pointIndex] !== undefined ? gameSettings.points[gameData.pointIndex] : 500;
	}

	for(var n=0; n<gameData.players; n++){
		playerData.scores.push(0);
	}

	startCards();
}

function startCards(){
	itemColors.alpha = 0;
	itemFrozen.alpha = 0;
	statusContainer.alpha = 0;
	guideContainer.alpha = 0;
	toggleRoundScore(false);
	toggleColors(false);

	if (!socketData.online || !gameData.cards || gameData.cards.length === 0 || !gameData.cards[0] || !gameData.cards[0].frontContainer) {
		prepareCards();
	}

	if (!socketData.online) {
		gameData.ai = true;
	} else {
		gameData.ai = (gameData.isBotArr && gameData.isBotArr.some(function(b){ return !!b; }));
	}

	gameData.activePlayers = gameData.players;
	preparePlayers();
}

/*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	if (typeof window.recordMatchResult === 'function') {
		window.recordMatchResult(score);
	}
}

/*!
 * 
 * BUILD PLAYER SEQUENCE - Sequence layout for multiplayer & local
 * 
 */
function buildPlayerSequence(){
	gameData.seq = [];
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var startCount = socketData.gameIndex;
		for(var n=0; n<gameData.players; n++){
			gameData.seq.push(startCount);
			startCount++;
			startCount = startCount > gameData.players-1 ? 0 : startCount;
		}
	}else{
		for(var n=0; n<gameData.players; n++){
			gameData.seq.push(n);
		}
	}
}

/*!
 * 
 * RESIZE GAME LAYOUT - This is the function that runs to resize game layout
 * 
 */
function resizeGameLayout(){
	if(curPage == "game"){
		statusContainer.x = cardScoreContainer.x = colorsContainer.x = canvasW/2;
		statusContainer.y = cardScoreContainer.y = colorsContainer.y = canvasH/2;

		guideContainer.x = canvasW/2;
		guideContainer.y = canvasH/100 * 60;

		itemColors.x = itemFrozen.x = canvasW/2 + 150;
		itemColors.y = itemFrozen.y = canvasH/2;

		if(!gameData.prepared){
			return;
		}

		var positionLayout = [
			{
				x:canvasW/2,
				y:canvasH/100 * 82,
				horizontal:true,
				dir:"bottom"
			},
			{
				x:canvasW/2,
				y:canvasH/100 * 18,
				horizontal:true,
				dir:"top"
			},
			{
				x:canvasW/100 * 14,
				y:canvasH/2,
				horizontal:false,
				dir:"left"
			},
			{
				x:canvasW/100 * 86,
				y:canvasH/2,
				horizontal:false,
				dir:"right"
			}
		];

		if(!viewport.isLandscape){
			itemColors.x = itemFrozen.x = canvasW/2;
			itemColors.y = itemFrozen.y = canvasH/2 - 120;

			positionLayout = [
				{
					x:canvasW/2,
					y:canvasH/100 * 84,
					horizontal:true,
					dir:"bottom"
				},
				{
					x:canvasW/2,
					y:canvasH/100 * 16,
					horizontal:true,
					dir:"top"
				},
				{
					x:canvasW/100 * 15,
					y:canvasH/2,
					horizontal:false,
					dir:"left"
				},
				{
					x:canvasW/100 * 85,
					y:canvasH/2,
					horizontal:false,
					dir:"right"
				}
			];
		}

		buildPlayerSequence();

		var positionArr = [];
		if(gameData.players == 2){
			positionArr = [0, 1];
		}else if(gameData.players == 3){
			positionArr = [0, 2, 1];
		}else{
			positionArr = [0, 2, 1, 3];
		}
		
		for(var n=0; n<gameData.players; n++){
			var seqIndex = gameData.seq[n];
			if($.players[seqIndex]){
				$.players[seqIndex].x = positionLayout[positionArr[n]].x;
				$.players[seqIndex].y = positionLayout[positionArr[n]].y;
				$.players[seqIndex].dir = positionLayout[positionArr[n]].dir;
				$.players[seqIndex].horizontal = positionLayout[positionArr[n]].horizontal;
			}
		}

		checkPlayerCardsAnimation();
	}
}

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

/*!
 * 
 * BUILD CARDS - This is the function that runs to build cards
 * 
 */
function buildCards(){
	cardsPlayContainer.removeAllChildren();

	gameData.actionArr = [];
	gameData.wildArr = [];
	gameData.specialArr = [];
	gameData.excludeMatch = [];
	gameData.excludeFirst = [];
	gameData.cards = [];
	gameData.cardNum = 0;

	if (isAttackMode()) {
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
	} else if (isAllWildMode()) {
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
	} else if (isFlexMode()) {
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
	} else if (isFlipMode()) {
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
	} else if (isNoMercyMode()) {
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
	} else {
		for(var c=0; c<gameData.colors.length; c++){
			//numbers
			for(var n=0; n<cards_arr.numbers.length; n++){
				var thisNumber = cards_arr.numbers[n];
				var thisCard = createCard('cardNumbers'+gameData.themeIndex+'_'+gameData.colors[c]+'_'+thisNumber, gameData.colors[c]);
				thisCard.cardType = 'number';
				thisCard.cardColor = gameData.colors[c];
				thisCard.cardValue = thisNumber;
				thisCard.cardPoint = thisNumber;
			}

			for(var l=0; l<2; l++){
				for(var n=0; n<cards_arr.actions.length; n++){
					var thisCard = 
					createCard('cardActions'+gameData.themeIndex+'_'+gameData.colors[c]+'_'+n, gameData.colors[c]);
					thisCard.cardType = cards_arr.actions[n].type;
					thisCard.cardColor = gameData.colors[c];
					thisCard.cardValue = '';
					thisCard.cardPoint = cards_arr.actions[n].point;
					gameData.actionArr.push(cards_arr.actions[n].type);
				}
			}

			for(var n=0; n<cards_arr.wilds.length; n++){
				var thisCard = createCard('cardWilds'+gameData.themeIndex+'_'+n, '');
				thisCard.cardType = cards_arr.wilds[n].type;
				thisCard.cardColor = '';
				thisCard.cardValue = '';
				thisCard.cardPoint = cards_arr.wilds[n].point;
				gameData.wildArr.push(cards_arr.wilds[n].type);
				gameData.excludeMatch.push(cards_arr.wilds[n].type);
				if(cards_arr.wilds[n].type == "wilddraw4"){
					gameData.excludeFirst.push(cards_arr.wilds[n].type);
				}
			}
		}
		
		if(gameData.fourcolors.special){
			for(var n=0; n<cards_arr.specials.length; n++){
				var thisCard = createCard('cardSpecial'+gameData.themeIndex+'_'+n, '');
				thisCard.cardType = cards_arr.specials[n].type;
				thisCard.cardColor = '';
				thisCard.cardValue = '';
				thisCard.cardPoint = cards_arr.specials[n].point;
				gameData.specialArr.push(cards_arr.specials[n].type);
				gameData.excludeMatch.push(cards_arr.specials[n].type);
				gameData.excludeFirst.push(cards_arr.specials[n].type);
			}
		}
	}

	gameData.actionArr = removeDuplicates(gameData.actionArr);
	gameData.wildArr = removeDuplicates(gameData.wildArr);
	gameData.specialArr = removeDuplicates(gameData.specialArr);
	gameData.excludeMatch = removeDuplicates(gameData.excludeMatch);
}

/*!
 * 
 * PREPARE CARDS - This is the function that runs to prepare cards
 * 
 */
function prepareCards(){
	gameData.prepared = false;
	gameData.complete = false;

	gameData.draw = [];
	gameData.discard = [];
	gameData.seq = [];
	gameData.cardIndex = 0;
	gameData.deal = {
		status:false,
		animation:false,
		cards:[],
		cardIndex:0,
	}
	gameData.flipSide = 'light';
	gameData.powerCards = [true, true, true, true];
	gameData.match = {
		count:0,
		type:'',
		color:'',
		lastColor:'',
		value:'',
		active:true
	}
	gameData.loopColors = {
		possible:[],
		color:0,
		index:0,
		round:0,
		roundMax:2
	}
	gameData.turn = {
		action:false,
		animating:false,
		reverse:false,
		reverseTurn:false,
		reverseCount:0,
		skip:false,
		highlight:false,
		played:false,
		pickColors:false,
		drawCount:0,
		drawCards:0,
		drawCardsTotal:0,
		drawCardsCount:0,
		drawCard:false,
		loseTurn:false,
		continuePlay:false,
		penalty:false,
		penaltyCards:0,
		revealCard:false,
		targetPlayerAim:false,
		targetPlayer:false,
		targetDrawCards:0,
		targetDrawCard:false,
		giveCards:0,
		giveCard:false,
		removePlayer:false,
		frozenPick:false,
		frozenColor:false,
		frozenReset:-1,
		frozenSkip:false,
		addPoints:0,
		lastCardType:'',
		shuffle:false,
		playerCards:[],
		swap:false,
		queue:[],
		pendingDrawStack:0,
		pendingDrawType:'',
		skipEveryone:false,
		isRoulette:false,
		isWildDrawColor:false
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var startCount = socketData.gameIndex;
		for(var n=0; n<gameData.players; n++){
			gameData.seq.push(startCount);
			startCount++;
			startCount = startCount > gameData.players-1 ? 0 : startCount;
		}
	}else{
		for(var n=0; n<gameData.players; n++){
			gameData.seq.push(n);
		}
	}
	playSound("soundCardShuffle");
	buildCards();
	
	//26 wild card
	//23 reverse
	//22 draw
	//skip
	//var cardArr = [91,29,34,36,48,24,74,51,49,55,61,21,16,1,27,23,19,22,103,84,107,119,118,117,113,115,116,110,6,18,3,0,111,112,9,109,108,98,114,89,13,57,53,2,72,105,25,44,99,60,41,102,69,64,26,90,66,67,81,101,88,11,38,31,40,8,83,43,33,82,12,5,62,42,92,37,50,70,93,17,7,56,63,100,97,106,73,46,71,76,96,75,58,10,104,78,86,15,77,65,4,32,54,28,80,95,52,30,47,85,39,14,45,59,68,20,94,35,87,79];
	//gameData.cards = [];

	//for(var n=0; n<cardArr.length; n++){
		//gameData.cards.push($.cards[cardArr[n]]);
	//}
	shuffle(gameData.cards);
}

function createCard(name, color){
	$.cards['front'+gameData.cardNum] = new createjs.Container();
	$.cards['content'+gameData.cardNum] = new createjs.Container();
	$.cards[gameData.cardNum] = new createjs.Container();
	$.cards[gameData.cardNum].frontContainer = $.cards['front'+gameData.cardNum]
	$.cards[gameData.cardNum].contentContainer = $.cards['content'+gameData.cardNum]
	$.cards[gameData.cardNum].contentContainer.visible = false;
	$.cards[gameData.cardNum].addChild($.cards[gameData.cardNum].frontContainer, $.cards[gameData.cardNum].contentContainer);
	$.cards[gameData.cardNum].cardIndex = gameData.cardNum;
	$.cards[gameData.cardNum].cardDeal = false;

	var cW = gameSettings.cardW || 100;
	var cH = gameSettings.cardH || 150;
	var hitShape = new createjs.Shape();
	hitShape.graphics.beginFill("#000").drawRect(-cW/2, -cH/2, cW, cH);
	$.cards[gameData.cardNum].hitArea = hitShape;
	$.cards[gameData.cardNum].mouseChildren = false;
	$.cards[gameData.cardNum].cursor = 'pointer';

	$.cards[gameData.cardNum].addEventListener("click", function(evt) {
		var targetCard = evt.currentTarget || $.cards[this.cardIndex];
		var cardIdx = (targetCard && targetCard.cardIndex !== undefined) ? targetCard.cardIndex : this.cardIndex;

		if(gameData.turn.animating || gameData.turn.played || colorsContainer.visible || gameData.turn.pickColors || !gameData.turn.action){
			return;
		}

		var proceedClick = checkIsPlayer(gameData.player);
		if(!proceedClick){
			// Check for Jump-In (exact identical color and value/type played out of turn)
			if(!colorsContainer.visible && !gameData.turn.pickColors && !gameData.turn.animating && gameSettings.houseRules && gameSettings.houseRules.jumpIn && gameData.discard.length > 0 && targetCard && targetCard.cardDeal){
				for(var p = 0; p < gameData.players; p++){
					if(checkIsPlayer(p) && p !== gameData.player && $.players[p] && $.players[p].cards.indexOf(cardIdx) !== -1){
						var topDiscard = $.cards[gameData.discard[gameData.discard.length - 1]];
						if(topDiscard && targetCard.cardColor === topDiscard.cardColor && String(targetCard.cardValue) === String(topDiscard.cardValue) && targetCard.cardColor !== ''){
							gameData.player = p;
							showGameStatus('jump_in');
							if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
								postSocketUpdate('wildaction', {card:'jumpin', player:p, cardData:cardIdx}, false);
							}
							discardPlayerCard(cardIdx, false);
							return;
						}
					}
				}
			}
			return;
		}

		// 1. Giving card mode (devil deal / charity)
		if(gameData.turn.giveCard){
			if($.players[gameData.player] && $.players[gameData.player].cards.indexOf(cardIdx) !== -1){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'givecard', cardData:cardIdx}, false);
				}
				giveCardToPlayer(cardIdx);
			}
			return;
		}

		// 2. Clicking the DRAW pile (only the top card of the draw pile)
		var isDrawPileCard = (gameData.draw.length > 0 && cardIdx === gameData.draw[0]);
		if(isDrawPileCard){
			if (gameData.turn.pendingDrawStack > 0) {
				var stackToDraw = gameData.turn.pendingDrawStack;
				gameData.turn.pendingDrawStack = 0;
				gameData.turn.pendingDrawType = '';
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = stackToDraw;
				gameData.turn.drawCardsCount = 0;
				gameData.turn.loseTurn = true;
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'stackdraw', cardData:stackToDraw}, false);
				}
				drawPlayerCard(true);
				return;
			}

			// If player already drew a card this turn (drawCount >= 1), clicking the deck again passes the turn
			if (gameData.turn.drawCount >= 1) {
				gameData.turn.drawCard = false;
				gameData.match.active = false;
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'passturn'}, false);
				}
				checkRoundEnd();
				return;
			}

			// Only allow 1 manual draw per turn
			if(gameData.turn.drawCount < 1 && (gameData.turn.drawCard || !gameData.turn.played)){
				gameData.turn.drawCount++;
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'drawplayercard', cardData:gameData.turn.drawCount}, false);
				}
				drawPlayerCard(false);
			}
			return;
		}

		// 3. Playing a card from player's hand
		var isCardInHand = ($.players[gameData.player] && $.players[gameData.player].cards.indexOf(cardIdx) !== -1);
		if(isCardInHand && targetCard.cardDeal){
			if(checkMatchCard(cardIdx)){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'discardplayercard', cardData:cardIdx}, false);
				}
				discardPlayerCard(cardIdx, false);
			}
			return;
		}
	});

	var bgCover = new createjs.Bitmap(loader.getResult('cardCover'+gameData.themeIndex));
	centerReg(bgCover);
	$.cards[gameData.cardNum].frontContainer.addChild(bgCover);

	if(color != ''){
		var bgBack = new createjs.Bitmap(loader.getResult('cardBg'+gameData.themeIndex+'_'+color));
		centerReg(bgBack);
		$.cards[gameData.cardNum].contentContainer.addChild(bgBack);
	}
	
	var bgContent = new createjs.Bitmap(loader.getResult(name));
	centerReg(bgContent);
	$.cards[gameData.cardNum].contentContainer.addChild(bgContent);

	$.cards['highlight'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardHighlight'+gameData.themeIndex));
	centerReg($.cards['highlight'+gameData.cardNum]);
	$.cards['eliminated'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardEliminated'+gameData.themeIndex));
	centerReg($.cards['eliminated'+gameData.cardNum]);
	$.cards['shadow'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardShadow'+gameData.themeIndex));
	centerReg($.cards['shadow'+gameData.cardNum]);

	// Avoid mouse event interception
	$.cards['highlight'+gameData.cardNum].mouseEnabled = false;
	$.cards['eliminated'+gameData.cardNum].mouseEnabled = false;
	$.cards['shadow'+gameData.cardNum].mouseEnabled = false;
	$.cards['highlight'+gameData.cardNum].visible = false;
	$.cards['eliminated'+gameData.cardNum].visible = false;

	$.cards[gameData.cardNum].highlight = $.cards['highlight'+gameData.cardNum];
	$.cards[gameData.cardNum].eliminated = $.cards['eliminated'+gameData.cardNum];
	$.cards[gameData.cardNum].shadow = $.cards['shadow'+gameData.cardNum];

	var returnCard = $.cards[gameData.cardNum];
	cardsPlayContainer.addChild($.cards['shadow'+gameData.cardNum], $.cards[gameData.cardNum], $.cards['highlight'+gameData.cardNum], $.cards['eliminated'+gameData.cardNum]);
	gameData.cards.push($.cards[gameData.cardNum]);
	gameData.cardNum++;

	return returnCard;
}

function toggleCardAction(card, con){
	if(con){
		card.cursor = 'pointer';
	}else{
		card.cursor = null;
	}
}

function highlightCard(card, con){
	if(!card) return;
	if(con){
		if(card.highlight){
			card.highlight.x = card.x;
			card.highlight.y = card.y;
			card.highlight.rotation = card.rotation;
			card.highlight.visible = true;
			animateBlink(card.highlight);
		}
	}else{
		if(card.highlight){
			card.highlight.visible = false;
			killAnimateBlink(card.highlight);
		}
	}
}

function discardPlayerCard(cardIndex, flip){
	gameData.turn.played = true;
	gameData.match.count++;
	var playerCardIndex = $.players[gameData.player].cards.indexOf(cardIndex);

	for(var n=0; n<$.players[gameData.player].cards.length; n++){
		highlightCard($.cards[$.players[gameData.player].cards[n]], false);
	}
	if(playerCardIndex !== -1){
		$.players[gameData.player].cards.splice(playerCardIndex, 1);
	}
	positionPlayerCards(gameData.player, true);

	showDiscardCard(cardIndex, flip);
}

/*!
 * 
 * PREPARE PLAYERS - This is the function that runs to prepare players
 * 
 */
function preparePlayers(){
	cardsPlayersContainer.removeAllChildren();
	gameData.cardIndex = 0;
	gameData.draw = [];

	buildPlayerSequence();

	//find total deal
	var playerTotalDeal = gameSettings.playerCards;

	for(var n=0; n<gameData.players; n++){
		$.players[n] = new createjs.Container();
		$.players[n].cards = [];
		$.players[n].score = 0;
		$.players[n].playerIndex = n;
		$.players[n].active = true;

		for(var p=0; p<playerTotalDeal; p++){
			var cardIndex = gameData.cards[gameData.cardIndex].cardIndex;
			$.players[n].cards.push(cardIndex);
			gameData.cardIndex++;
		}

		$.players["stats" + n] = new createjs.Container();
		var newPlayerLine = new createjs.Bitmap(loader.getResult('itemPlayerLine'));
		centerReg(newPlayerLine);

		var newPlayerName = new createjs.Text();
		newPlayerName.font = "18px bpreplaybold";
		newPlayerName.color = "#fff";
		newPlayerName.textAlign = "left";
		newPlayerName.textBaseline='middle';
		newPlayerName.text = textDisplay.playerName.replace("[NUMBER]", n+1);

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			newPlayerName.text = (gameData.names && gameData.names[n]) ? gameData.names[n] : textDisplay.playerName.replace("[NUMBER]", n+1);
		}

		var newPlayerScore = new createjs.Text();
		newPlayerScore.font = "22px bpreplaybold";
		newPlayerScore.color = "#fff";
		newPlayerScore.textAlign = "right";
		newPlayerScore.textBaseline='middle';
		newPlayerScore.text = textDisplay.playerScore.replace("[NUMBER]", playerData.scores[n]);

		$.players["stats" + n].playerLine = newPlayerLine;
		$.players["stats" + n].playerName = newPlayerName;
		$.players["stats" + n].playerScore = newPlayerScore;
		$.players["stats" + n].visible = false;
		$.players["stats" + n].addChild(newPlayerLine, newPlayerName, newPlayerScore);

		$.players["call" + n] = new createjs.Bitmap(loader.getResult('buttonCall'));
		$.players["call" + n].visible = false;
		$.players["called" + n] = new createjs.Bitmap(loader.getResult('buttonCalled'));
		$.players["called" + n].visible = false;
		centerReg($.players["call" + n]);
		centerReg($.players["called" + n]);

		$.players["call" + n].callIndex = n;
		$.players["call" + n].cursor = "pointer";
		$.players["call" + n].addEventListener("click", function(evt) {
			var cIdx = (evt.currentTarget && evt.currentTarget.callIndex !== undefined) ? evt.currentTarget.callIndex : evt.target.callIndex;
			if($.players[cIdx] && $.players[cIdx].cards.length === 1){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('called', socketData.gameIndex, true);
				}
				playSound('soundCall');
				if($.players["called" + cIdx]){
					$.players["called" + cIdx].visible = true;
					animateFocus($.players["called" + cIdx]);
				}
			}
		});

		$.players["aim" + n] = new createjs.Bitmap(loader.getResult('buttonAim'));
		$.players["aim" + n].visible = false;
		centerReg($.players["aim" + n]);
		$.players["aim" + n].playerIndex = n;
		$.players["aim" + n].cursor = "pointer";
		$.players["aim" + n].addEventListener("click", function(evt) {
			var proceedAction = checkIsPlayer(gameData.player);
			if(proceedAction){
				playSound('soundCall');
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('targetaim', evt.target.playerIndex, false);
				}

				toggleTargetIcon(evt.target.playerIndex);
				if(gameData.turn.swap){
					swapPlayerCards(evt.target.playerIndex);
				}else if(gameData.turn.revealCard){
					revealPlayerCards(evt.target.playerIndex);
				}else if(gameData.turn.giveCard){
					choosePlayerCards(evt.target.playerIndex);
				}else if(gameData.turn.removePlayer){
					removePlayers(evt.target.playerIndex);
				}else{
					targetedPlayerDraw(evt.target.playerIndex);
				}
			}
		});

		$.players["arrow" + n] = new createjs.Container();
		var itemArrowL = new createjs.Bitmap(loader.getResult('itemArrow'));
		centerReg(itemArrowL);
		var itemArrowR = new createjs.Bitmap(loader.getResult('itemArrow'));
		centerReg(itemArrowR);
		itemArrowR.visible = false;
		itemArrowR.scaleX = -1;
		$.players["arrow" + n].itemArrowL = itemArrowL;
		$.players["arrow" + n].itemArrowR = itemArrowR;
		$.players["arrow" + n].addChild(itemArrowL, itemArrowR);
		$.players["arrow" + n].visible = false;

		$.players["target" + n] = new createjs.Bitmap(loader.getResult('itemTarget'));
		$.players["target" + n].visible = false;
		centerReg($.players["target" + n]);

		$.players["skip" + n] = new createjs.Bitmap(loader.getResult('itemSkip'));
		$.players["skip" + n].visible = false;
		centerReg($.players["skip" + n]);

		$.players["eliminated" + n] = new createjs.Bitmap(loader.getResult('itemEliminated'));
		$.players["eliminated" + n].visible = false;
		centerReg($.players["eliminated" + n]);

		cardsPlayersContainer.addChild($.players[n], $.players["stats" + n], $.players["call" + n], $.players["called" + n], $.players["aim" + n], $.players["skip" + n], $.players["target" + n], $.players["eliminated" + n], $.players["arrow" + n]);
	}

	for(var n=gameData.cardIndex; n<gameData.cards.length; n++){
		var cardIndex = gameData.cards[n].cardIndex;
		gameData.draw.push(cardIndex);
	}

	gameData.prepared = true;
	resizeGameLayout();
	for(var n=0; n<gameData.players; n++){
		positionPlayerCards(n, false);
	}
	TweenMax.to(cardsContainer, .3, {overwrite:true, onComplete:function(){
		gameData.deal.status = true;
		gameData.deal.animation = true;
		startDealPlayerCards();
	}});
}

function startDealPlayerCards(){
	gameData.deal.cards = [];
	gameData.deal.cardIndex = 0;
	gameData.deal.total = 0;

	for(var n=0; n<gameSettings.playerCards; n++){
		for(var p=0; p<gameData.players; p++){
			if($.players[p] && $.players[p].cards[n] !== undefined){
				var thisCard = $.cards[$.players[p].cards[n]];
				if(thisCard){
					thisCard.cardDeal = false;
					gameData.deal.cards.push({card:thisCard, player:p});
					gameData.deal.total++;
				}
			}
		}
	}
	if(gameData.deal.cards.length > 0){
		dealPlayerCard();
	}else{
		gameData.deal.animation = false;
		showDrawCard(true);
	}
}

function checkPlayerCardsAnimation(){
	if(gameData.deal.animation){
		for(var n=0; n<gameData.players; n++){
			positionPlayerCards(n, false);
		}
	}else{
		for(var n=0; n<gameData.players; n++){
			positionPlayerCards(n, gameData.deal.status);
		}
	}

	if(gameData.drawing){
		toggleDrawPiles(true);
	}
}

/*!
 * 
 * DEAL PLAYER CARD - This is the function that runs to deal player card
 * 
 */
function dealPlayerCard(){
	if(!gameData.deal.cards || gameData.deal.cards.length === 0 || gameData.deal.cardIndex >= gameData.deal.cards.length){
		gameData.deal.animation = false;
		showDrawCard(true);
		return;
	}
	var thisCard = gameData.deal.cards[gameData.deal.cardIndex].card;
	var thisPlayer = gameData.deal.cards[gameData.deal.cardIndex].player;
	if(!thisCard){
		dealPlayerCardComplete(thisPlayer, thisCard);
		return;
	}
	thisCard.cardDeal = true;
	setCardDepth(thisCard);

	var showCardContent = checkIsPlayer(thisPlayer);
	if(showCardContent){
		toggleCardAction(thisCard, true);
		flipCard(thisCard);
	}else{
		toggleCardAction(thisCard, false);
		flipCardCover(thisCard);
	}

	playSound('soundCardDeal');
	positionPlayerCards(thisPlayer, true);

	var cardSpeed = gameSettings.cardDealSpeed || 0.2;
	TweenMax.to(cardsContainer, cardSpeed, {overwrite:false, onComplete:dealPlayerCardComplete, onCompleteParams:[thisPlayer, thisCard]});
}

function dealPlayerCardComplete(index, card){
	var showCardContent = checkIsPlayer(index);
	if(showCardContent){
		toggleCardAction(card, true);
	}

	gameData.deal.cardIndex++;
	if(gameData.deal.cardIndex < gameData.deal.cards.length){
		dealPlayerCard();
	}else{
		if(gameData.deal.animation){
			gameData.deal.animation = false;
			showDrawCard(true);
		}
	}
}

function getPlayerCardPosition(index){
	var horizontal = $.players[index].horizontal;
	var pt = cardsPlayContainer.globalToLocal($.players[index].x, $.players[index].y);
	var maxW = viewport.isLandscape ? 600 : Math.min(500, canvasW * 0.72);
	var maxH = viewport.isLandscape ? 380 : Math.min(300, canvasH * 0.32);
	var pos = {
		horizontal: horizontal,
		x: 0,
		y: 0,
		startX: 0,
		startY: 0,
		w: 0,
		h: 0,
		maxW: maxW,
		maxH: maxH,
		gap: 0,
		cardSpace: gameSettings.cardSpace || 45,
		totalCards: 0
	};

	for(var p=0; p<$.players[index].cards.length; p++){
		var thisCard = $.cards[$.players[index].cards[p]];
		if(thisCard && thisCard.cardDeal){
			pos.totalCards++;
		}
	}

	var cardCountForSpacing = Math.max(pos.totalCards - 1, 0);

	if(pos.horizontal){
		pos.w = cardCountForSpacing * pos.cardSpace;
		pos.gap = pos.cardSpace;

		if(cardCountForSpacing > 0 && pos.w > pos.maxW){
			pos.w = pos.maxW;
			pos.gap = pos.maxW / cardCountForSpacing;
		}

		pos.x = pos.startX = pt.x - (pos.w / 2);
		pos.y = pos.startY = pt.y;
	}else{
		pos.h = cardCountForSpacing * pos.cardSpace;
		pos.gap = pos.cardSpace;

		if(cardCountForSpacing > 0 && pos.h > pos.maxH){
			pos.h = pos.maxH;
			pos.gap = pos.maxH / cardCountForSpacing;
		}

		pos.x = pos.startX = pt.x;
		pos.y = pos.startY = pt.y - (pos.h / 2);
	}

	return pos;
}

/*!
 * 
 * CHECK IS PLAYER - Check if given player index is the active human player on this client
 * 
 */
function checkIsPlayer(playerIndex){
	if(playerIndex === undefined) playerIndex = gameData.player;
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		var isBot = (gameData.isBotArr && gameData.isBotArr[playerIndex]);
		if(isBot){
			return false;
		}
		return playerIndex === socketData.gameIndex;
	} else {
		return playerIndex === 0;
	}
}
window.checkIsPlayer = checkIsPlayer;

/*!
 * 
 * TOGGLE COLORS - This is the function that runs to toggle colors
 * 
 */
function toggleColors(con){
	colorsContainer.visible = con;

	if(con){
		gameData.turn.animating = true;
		gameData.turn.action = false;

		// Clear highlights during color picking
		if($.players[gameData.player]){
			for(var n=0; n<$.players[gameData.player].cards.length; n++){
				var cObj = $.cards[$.players[gameData.player].cards[n]];
				if(cObj) highlightCard(cObj, false);
			}
		}
		if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
			highlightCard($.cards[gameData.draw[0]], false);
		}

		var isPlayer = false;
		var isActivePlayer = false;
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			var isCurrentPlayerBot = (gameData.isBotArr && gameData.isBotArr[gameData.player]);
			if(isCurrentPlayerBot){
				isPlayer = false;
				isActivePlayer = false;
			}else{
				isPlayer = true;
				if(gameData.player == socketData.gameIndex){
					isActivePlayer = true;
				}
			}
		}else{
			if(gameData.player == 0){
				isPlayer = true;
				isActivePlayer = true;
			}
		}

		var curPlayerName = ($.players["stats" + gameData.player] && $.players["stats" + gameData.player].playerName) ? $.players["stats" + gameData.player].playerName.text : "PLAYER " + (gameData.player + 1);
		
		if(isPlayer){
			for(var n=0; n<4; n++){	
				$.colors[n].gotoAndStop(n);
				$.colors[n].alpha = isActivePlayer ? 1 : 0.4;
			}
			if(isActivePlayer){
				colorSelectTxt.text = "CHOOSE A COLOR";
				playSound('soundAlert');
			}else{
				colorSelectTxt.text = curPlayerName + " IS CHOOSING A COLOR...";
			}
		}else{
			colorSelectTxt.text = curPlayerName + " IS CHOOSING A COLOR...";

			gameData.loopColors.round = 0;
			gameData.loopColors.roundMax = 1;
			gameData.loopColors.index = 0;
			gameData.loopColors.possible = [];

			// Smart bot color selection: pick color with most cards in hand
			var colorCounts = {red:0, blue:0, yellow:0, green:0};
			for(var n=0; n<$.players[gameData.player].cards.length; n++){
				var cardIndex = $.players[gameData.player].cards[n];
				var cObj = $.cards[cardIndex];
				if(cObj && cObj.cardColor && colorCounts[cObj.cardColor] !== undefined){
					colorCounts[cObj.cardColor]++;
				}
			}
			
			var bestColor = 'red';
			var maxCount = -1;
			var colorKeys = ['red','blue','yellow','green'];
			for(var k=0; k<colorKeys.length; k++){
				var col = colorKeys[k];
				if(colorCounts[col] > maxCount){
					maxCount = colorCounts[col];
					bestColor = col;
				}
			}
			gameData.loopColors.color = gameData.colors.indexOf(bestColor);
			if(gameData.loopColors.color < 0) gameData.loopColors.color = Math.floor(Math.random() * 4);

			TweenMax.delayedCall(0.5, loopAutoColors);
		}
	}
}

function loopAutoColors(){
	playSound('soundColorPick');
	for(var n=0; n<4; n++){	
		$.colors[n].gotoAndStop(n+4);
		$.colors[n].alpha = 0.5;
	}
	$.colors[gameData.loopColors.index].gotoAndStop(gameData.loopColors.index);
	$.colors[gameData.loopColors.index].alpha = 1;

	var proceedLoop = true;
	if(gameData.loopColors.round >= gameData.loopColors.roundMax){
		if(gameData.loopColors.index == gameData.loopColors.color){
			proceedLoop = false;
			TweenMax.delayedCall(0.7, function(){
				var chosenColor = gameData.colors[gameData.loopColors.index];
				gameData.match.value = 0;
				gameData.match.color = chosenColor;
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
					postSocketUpdate('choosecolor', chosenColor, false);
				}
				toggleColors(false);
				getMatchDetail();

				var curPlayerName = ($.players["stats" + gameData.player] && $.players["stats" + gameData.player].playerName) ? $.players["stats" + gameData.player].playerName.text : "PLAYER " + (gameData.player + 1);
				showChosenColorStatus(curPlayerName, chosenColor, function(){
					if (gameData.turn.isRoulette) {
						gameData.turn.isRoulette = false;
						var victim = findNextPlayer(gameData.player);
						startColorRoulette(victim, chosenColor);
					} else if (gameData.turn.isWildDrawColor) {
						gameData.turn.isWildDrawColor = false;
						var victim = findNextPlayer(gameData.player);
						startWildDrawColor(victim, chosenColor);
					} else {
						checkRoundEnd();
					}
				});
			});
		}
	}

	if(proceedLoop){
		gameData.loopColors.index++;
		if(gameData.loopColors.index > gameData.colors.length-1){
			gameData.loopColors.index = 0;
			gameData.loopColors.round++;
		}

		TweenMax.delayedCall(0.22, loopAutoColors);
	}
}

function showChosenColorStatus(playerName, colorName, callback){
	statusTxt.text = colorName.toUpperCase() + " CHOSEN!";
	statusPlayerTxt.text = playerName + " selected " + colorName.toUpperCase();
	playSound('soundColorPick');

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, 0.3, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(statusContainer, 0.3, {delay:0.8, alpha:0, overwrite:true, onComplete:function(){
			if(typeof callback === 'function') callback();
		}});
	}});
}

/*!
 * 
 * SPECIAL CARDS FUNCTION - This is the function that runs to check special cards
 * 
 */
function revealPlayerCards(playerIndex){
	gameData.turn.revealCard = false;
	toggleTargetPlayers(false);

	var isPlayer = checkIsPlayer(playerIndex);
	if(!isPlayer){
		for(var n=0; n<$.players[playerIndex].cards.length; n++){
			var thisCard = $.cards[$.players[playerIndex].cards[n]];
			flipCard(thisCard);
		}
	}

	TweenMax.delayedCall(3, function(){
		if(!isPlayer){
			for(var n=0; n<$.players[playerIndex].cards.length; n++){
				var thisCard = $.cards[$.players[playerIndex].cards[n]];
				flipCardCover(thisCard);
			}
		}
		toggleTargetIcon();
		checkRoundEnd();
	});
}

function choosePlayerCards(playerIndex){
	gameData.targetPlayer = playerIndex;
	toggleTargetPlayers(false);
	showGameGuide('selectcards');

	gameData.turn.action = true;
	gameData.turn.played = false;

	var isPlayer = checkIsPlayer(playerIndex);
	if(!isPlayer){
		for(var n=0; n<$.players[gameData.player].cards.length; n++){
			var cardIndex = $.players[gameData.player].cards[n];
			highlightCard($.cards[cardIndex], true);
		}
	}
}

function removePlayers(playerIndex){
	gameData.turn.removePlayer = false;
	toggleTargetPlayers(false);
	toggleTargetIcon();
	$.players[playerIndex].active = false;
	$.players["called"+playerIndex].visible = false;
	$.players["call"+playerIndex].visible = false;
	$.players["eliminated"+playerIndex].visible = true;
	animateFocus($.players["eliminated"+playerIndex]);

	for(var n=0; n<$.players[playerIndex].cards.length; n++){
		var cardIndex = $.players[playerIndex].cards[n];
		$.cards[cardIndex].eliminated.visible = true;
	}

	playSound('soundEliminated');
	gameData.activePlayers--;
	checkRoundEnd();
}

function targetedPlayerDraw(playerIndex){
	toggleTargetPlayers(false);
	toggleTargetIcon();
	
	gameData.player = playerIndex;
	nextPlayerTurn(false);
}

function giveCardToPlayer(cardIndex){
	gameData.turn.giveCards--;
	var playerCardIndex = $.players[gameData.player].cards.indexOf(cardIndex);
	$.players[gameData.player].cards.splice(playerCardIndex, 1);
	$.players[gameData.targetPlayer].cards.push(cardIndex);
	
	var isPlayer = checkIsPlayer(gameData.player);
	var isTargetPlayer = checkIsPlayer(gameData.targetPlayer);

	var thisCard = $.cards[cardIndex];
	if(isPlayer){
		highlightCard(thisCard, false);
	}

	if(isTargetPlayer){
		flipCard(thisCard);
	}else{
		flipCardCover(thisCard);
	}
	
	positionPlayerCards(gameData.player, true);
	positionPlayerCards(gameData.targetPlayer, true);

	if(gameData.turn.giveCards == 0 || $.players[gameData.player].cards.length == 0){
		for(var n=0; n<$.players[gameData.player].cards.length; n++){
			var cardIndex = $.players[gameData.player].cards[n];
			highlightCard($.cards[cardIndex], false);
		}

		toggleTargetIcon();
		showGameGuide();
		gameData.turn.giveCard = false
		gameData.turn.action = false;
		gameData.turn.played = true;
		checkRoundEnd();
	}
}

function autoGiveCardToPlayer(){
	var possibleCards = $.players[gameData.player].cards.slice();
	shuffle(possibleCards);
	var cardIndex = possibleCards[0];
	
	gameData.turn.giveCards--;
	var playerCardIndex = $.players[gameData.player].cards.indexOf(cardIndex);
	$.players[gameData.player].cards.splice(playerCardIndex, 1);
	$.players[gameData.targetPlayer].cards.push(cardIndex);
	$.players["called" + gameData.targetPlayer].visible = false;
	
	var isPlayer = checkIsPlayer(gameData.targetPlayer);
	if(isPlayer){
		var thisCard = $.cards[cardIndex];
		flipCard(thisCard);
	}
	
	playSound('soundCardDeal');
	positionPlayerCards(gameData.player, true);
	positionPlayerCards(gameData.targetPlayer, true);

	TweenMax.delayedCall(0.2, function(){
		if(gameData.turn.giveCards == 0 || $.players[gameData.player].cards.length == 0){
			for(var n=0; n<$.players[gameData.player].cards.length; n++){
				var cardIndex = $.players[gameData.player].cards[n];
				highlightCard($.cards[cardIndex], false);
			}
	
			toggleTargetIcon();
			showGameGuide();
			gameData.turn.giveCard = false
			gameData.turn.action = false;
			gameData.turn.played = true;
			checkRoundEnd();
		}else{
			autoGiveCardToPlayer();
		}
	});
}

function swapPlayerCards(playerIndex){
	gameData.turn.swap = false;
	gameData.turn.animating = true;
	toggleTargetPlayers(false);
	toggleTargetIcon();

	var playerAimCards = $.players[playerIndex].cards.slice();
	var playerCards = $.players[gameData.player].cards.slice();
	$.players[playerIndex].cards = playerCards;
	$.players[gameData.player].cards = playerAimCards;

	for(var c=0; c<$.players[playerIndex].cards.length; c++){
		var thisCard = $.cards[$.players[playerIndex].cards[c]];
		if(!thisCard) continue;
		var showCardContent = checkIsPlayer(playerIndex);
		if(showCardContent){
			flipCard(thisCard);
			toggleCardAction(thisCard, true);
		}else{
			flipCardCover(thisCard);
			toggleCardAction(thisCard, false);
		}
	}

	for(var c=0; c<$.players[gameData.player].cards.length; c++){
		var thisCard = $.cards[$.players[gameData.player].cards[c]];
		if(!thisCard) continue;
		var showCardContent = checkIsPlayer(gameData.player);
		if(showCardContent){
			flipCard(thisCard);
			toggleCardAction(thisCard, true);
		}else{
			flipCardCover(thisCard);
			toggleCardAction(thisCard, false);
		}
	}

	positionPlayerCards(playerIndex, true);
	positionPlayerCards(gameData.player, true);

	var moveSpeed = gameSettings.cardMoveSpeed || 0.3;
	TweenMax.delayedCall(moveSpeed + 0.1, function(){
		gameData.turn.animating = false;
		checkRoundEnd();
	});
}

function toggleTargetIcon(playerIndex){
	if(playerIndex != undefined){
		playSound('soundTarget');
		gameData.lastPlayerIndex = playerIndex;
		$.players["target"+playerIndex].visible = true;
		$.players["call"+playerIndex].alpha = 0;
		$.players["called"+playerIndex].alpha = 0;

		$.players["target"+playerIndex].alpha = 0;
		$.players["target"+playerIndex].scaleX = $.players["target"+playerIndex].scaleY = 3;
		TweenMax.to($.players["target"+playerIndex], .5, {alpha:1, scaleX:1, scaleY:1, overwrite:true});
	}else{
		$.players["target"+gameData.lastPlayerIndex].visible = false;
		$.players["call"+gameData.lastPlayerIndex].alpha = 1;
		$.players["called"+gameData.lastPlayerIndex].alpha = 1;
	}
}

/*!
 * 
 * TOGGLE TARGET PLAYERS - This is the function that runs to target players
 * 
 */
function toggleTargetPlayers(con){
	for(var n=0; n<gameData.players; n++){
		killAnimateBlink($.players["aim" + n]);
		$.players["aim" + n].visible = false;
		$.players["call" + n].alpha = 1;
		$.players["called" + n].alpha = 1;
	}

	if(con){
		var isPlayer = checkIsPlayer(gameData.player);

		showGameGuide('targetplayer');
		for(var n=0; n<gameData.players; n++){
			if(n != gameData.player && $.players[n].active){
				$.players["call" + n].alpha = 0;
				$.players["called" + n].alpha = 0;
				$.players["aim" + n].visible = true;
				animateBlink($.players["aim" + n]);
			}
		}
		
		if(!isPlayer){
			if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && !socketData.host) {
				return;
			}
			var possiblePlayer = [];
			for(var n=0; n<gameData.players; n++){
				if(n != gameData.player && $.players[n].active){
					possiblePlayer.push({index:n, cards:$.players[n].cards.length});
				}
			}
			sortOnObject(possiblePlayer, 'cards', false);
			toggleTargetPlayers(false);
			toggleTargetIcon(possiblePlayer[0].index);

			var aiSpeed = gameSettings.aiThinkSpeed || 0.5;
			TweenMax.delayedCall(aiSpeed, function(){
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
					postSocketUpdate('targetaim', possiblePlayer[0].index, false);
				}
				if(gameData.turn.swap){
					swapPlayerCards(possiblePlayer[0].index);
				}else if(gameData.turn.revealCard){
					gameData.turn.revealCard = false;
					toggleTargetIcon();
					checkRoundEnd();
				}else if(gameData.turn.giveCard){
					gameData.targetPlayer = possiblePlayer[0].index;
					autoGiveCardToPlayer();
				}else if(gameData.turn.removePlayer){
					removePlayers(possiblePlayer[0].index);
				}else{
					targetedPlayerDraw(possiblePlayer[0].index);
				}
			});
		}
	}else{
		showGameGuide();
	}
}

/*!
 * 
 * POSITION CARDS - This is the function that runs to position cards
 * 
 */
function positionPlayerCards(index, animation){
	if(!$.players[index]) return;
	var pos = getPlayerCardPosition(index);

	for(var p=0; p<$.players[index].cards.length; p++){
		$.players[index].cardX = pos.x;
		$.players[index].cardY = pos.y;

		var thisCard = $.cards[$.players[index].cards[p]];
		if(!thisCard) continue;

		if(thisCard.cardDeal){
			thisCard.oriX = pos.x;
			thisCard.oriY = pos.y;

			if(pos.horizontal){
				var rotationNum = $.players[index].dir == 'bottom' ? 0 : 180;
				pos.x += pos.gap;
			}else{
				var rotationNum = $.players[index].dir == 'right' ? -90 : 90;
				pos.y += pos.gap;
			}

			setCardDepth(thisCard);
			if(thisCard.highlight){
				thisCard.highlight.x = thisCard.oriX;
				thisCard.highlight.y = thisCard.oriY;
				thisCard.highlight.rotation = rotationNum;
			}
			if(thisCard.shadow){
				thisCard.shadow.x = thisCard.oriX + (gameSettings.cardShadowX || 5);
				thisCard.shadow.y = thisCard.oriY + (gameSettings.cardShadowY || 5);
				thisCard.shadow.rotation = rotationNum;
			}
			if(thisCard.eliminated){
				thisCard.eliminated.x = thisCard.oriX;
				thisCard.eliminated.y = thisCard.oriY;
				thisCard.eliminated.rotation = rotationNum;
			}

			var showCardContent = checkIsPlayer(index);
			if(showCardContent){
				if(!thisCard.contentContainer.visible || thisCard.contentContainer.scaleX === 0){
					flipCard(thisCard);
				}
				toggleCardAction(thisCard, true);
			}else{
				if(thisCard.contentContainer.visible && thisCard.contentContainer.scaleX === 1){
					flipCardCover(thisCard);
				}
				toggleCardAction(thisCard, false);
			}

			if(animation){
				var cardSpeed = gameSettings.cardMoveSpeed;
				TweenMax.to(thisCard, cardSpeed, {x:thisCard.oriX, y:thisCard.oriY, rotation:rotationNum, scaleX:1, scaleY:1, overwrite:true});
				if(thisCard.shadow){
					TweenMax.to(thisCard.shadow, cardSpeed, {x:thisCard.shadow.x, y:thisCard.shadow.y, rotation:rotationNum, overwrite:true});
				}
				if(thisCard.highlight){
					TweenMax.to(thisCard.highlight, cardSpeed, {x:thisCard.oriX, y:thisCard.oriY, rotation:rotationNum, overwrite:true});
				}
			}else{
				thisCard.x = thisCard.oriX;
				thisCard.y = thisCard.oriY;
				thisCard.rotation = rotationNum;
				thisCard.scaleX = 1;
				thisCard.scaleY = 1;
			}
		}
	}

	var gapX = (gameSettings.cardW/2) + 15;
	var gapY = (gameSettings.cardH/2) + 15;
	var buttonSpace = 20;

	$.players["stats" + index].playerName.y = $.players["stats" + index].playerScore.y = -12;
	$.players["stats" + index].playerName.x = -150;
	$.players["stats" + index].playerScore.x = 150;

	$.players["stats" + index].playerName.textAlign = "left";
	$.players["stats" + index].playerScore.textAlign = "right";

	var arrowTopBottom = 450;
	var arrowLeftRight = 250;
	if(!viewport.isLandscape){
		arrowTopBottom = 250;
		arrowLeftRight = 350;
	}

	if($.players[index].dir == "bottom"){
		$.players["stats" + index].rotation = 0;
		$.players["stats" + index].x = $.players[index].x;
		$.players["stats" + index].y = $.players[index].y - gapY;
		$.players["call" + index].x = $.players[index].x;
		$.players["call" + index].y = $.players[index].y - (gapY + buttonSpace);
		$.players["arrow" + index].x = $.players[index].x - arrowTopBottom;
		$.players["arrow" + index].y = $.players[index].y;
		$.players["arrow" + index].rotation = 0;
	}else if($.players[index].dir == "top"){
		$.players["stats" + index].rotation = 0;
		$.players["stats" + index].x = $.players[index].x;
		$.players["stats" + index].y = $.players[index].y + gapY;
		$.players["call" + index].x = $.players[index].x;
		$.players["call" + index].y = $.players[index].y + (gapY + buttonSpace);
		$.players["stats" + index].playerName.y = $.players["stats" + index].playerScore.y = 16;
		$.players["stats" + index].playerName.x = 150;
		$.players["stats" + index].playerScore.x = -150;
		$.players["stats" + index].playerName.textAlign = "right";
		$.players["stats" + index].playerScore.textAlign = "left";
		$.players["arrow" + index].x = $.players[index].x + arrowTopBottom;
		$.players["arrow" + index].y = $.players[index].y;
		$.players["arrow" + index].rotation = 180;
	}else if($.players[index].dir == "left"){
		$.players["stats" + index].rotation = 90;
		$.players["stats" + index].x = $.players[index].x + gapY;
		$.players["stats" + index].y = $.players[index].y;
		$.players["call" + index].x = $.players[index].x + (gapY + buttonSpace);
		$.players["call" + index].y = $.players[index].y;
		$.players["arrow" + index].x = $.players[index].x;
		$.players["arrow" + index].y = $.players[index].y - arrowLeftRight;
		$.players["arrow" + index].rotation = 90;
	}else if($.players[index].dir == "right"){
		$.players["stats" + index].rotation = -90;
		$.players["stats" + index].x = $.players[index].x - gapY;
		$.players["stats" + index].y = $.players[index].y;
		$.players["call" + index].x = $.players[index].x - (gapY + buttonSpace);
		$.players["call" + index].y = $.players[index].y;
		$.players["arrow" + index].x = $.players[index].x;
		$.players["arrow" + index].y = $.players[index].y + arrowLeftRight;
		$.players["arrow" + index].rotation = -90;
	}

	$.players["called" + index].x = $.players["aim" + index].x = $.players["target" + index].x = $.players["skip" +index].x = $.players["eliminated" +index].x = $.players["call" + index].x;
	$.players["called" + index].y = $.players["aim" + index].y = $.players["target" + index].y = $.players["skip" +index].y = $.players["eliminated" +index].y = $.players["call" + index].y;
}

function flipCard(card){
	playSound('soundCardFlip');
	card.contentContainer.visible = true;
	card.contentContainer.scaleX = 0;

	var flipSpeed = gameSettings.cardFlipSpeed;
	TweenMax.to(card.frontContainer, flipSpeed, {scaleX:0});
	TweenMax.to(card.contentContainer, flipSpeed, {delay:flipSpeed, scaleX:1});
	TweenMax.to(card.shadow, flipSpeed, {scaleX:0});
	TweenMax.to(card.shadow, flipSpeed, {delay:flipSpeed, scaleX:1});
}

function flipCardCover(card){
	playSound('soundCardFlip');
	card.frontContainer.visible = true;
	card.frontContainer.scaleX = 0;

	var flipSpeed = gameSettings.cardFlipSpeed;
	TweenMax.to(card.contentContainer, flipSpeed, {scaleX:0});
	TweenMax.to(card.frontContainer, flipSpeed, {delay:flipSpeed, scaleX:1});
	TweenMax.to(card.shadow, flipSpeed, {scaleX:0});
	TweenMax.to(card.shadow, flipSpeed, {delay:flipSpeed, scaleX:1});
}

function recycleDiscardPile(){
	if(gameData.discard.length > 1){
		var topCard = gameData.discard[gameData.discard.length - 1];
		var cardsToRecycle = gameData.discard.slice(0, gameData.discard.length - 1);
		gameData.discard = [topCard];
		for(var i = 0; i < cardsToRecycle.length; i++){
			var cIdx = cardsToRecycle[i];
			var cObj = $.cards[cIdx];
			if(cObj){
				cObj.cardDeal = false;
				cObj.frontContainer.visible = true;
				cObj.frontContainer.scaleX = 1;
				cObj.contentContainer.visible = false;
				cObj.contentContainer.scaleX = 0;
				cObj.visible = false;
			}
			gameData.draw.push(cIdx);
		}
		shuffle(gameData.draw);
	}
}

/*!
 * 
 * SHOW DRAW CARD - This is the function that runs to show draw card
 * 
 */
function showDrawCard(pileCard){
	if(gameData.draw.length === 0){
		recycleDiscardPile();
	}

	if(gameData.draw.length > 0){
		var cardW = gameSettings.cardW;
		var cardSpeed = gameSettings.cardMoveSpeed;
		var cardIndex = gameData.draw[0];
		if(pileCard){
			gameData.draw.splice(0,1);
		}

		for(var d=0; d<gameData.draw.length; d++){
			var thisCard = $.cards[gameData.draw[d]];
			if(!thisCard) continue;
			if(d == 0){
				thisCard.frontContainer.scaleX = 1;
				thisCard.frontContainer.visible = true;
				thisCard.contentContainer.visible = false;
				thisCard.visible = true;
				setCardDepth(thisCard);
			}else{
				thisCard.visible = false;
			}
			TweenMax.to(thisCard, cardSpeed, {x:-(cardW/2), y:0, rotation:0, overwrite:true});
		}

		if(pileCard){
			showDiscardCard(cardIndex, true);
		}else{
			if(gameData.discard.length > 0){
				var discardCardIndex = gameData.discard[gameData.discard.length-1];
				var thisCard = $.cards[discardCardIndex];
				if(thisCard) setCardDepth(thisCard);
			}
		}
	}else{
		recycleDiscardPile();
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('shuffledrawcards', socketData.gameIndex);
		}else{
			if(gameData.draw.length > 0){
				showDrawCard(pileCard);
			}
		}
	}
}

function setCardDepth(thisCard){
	if(!thisCard) return;
	if(thisCard.shadow && cardsPlayContainer.contains(thisCard.shadow)){
		cardsPlayContainer.setChildIndex(thisCard.shadow, cardsPlayContainer.numChildren-1);
	}
	if(cardsPlayContainer.contains(thisCard)){
		cardsPlayContainer.setChildIndex(thisCard, cardsPlayContainer.numChildren-1);
	}
	if(thisCard.highlight && cardsPlayContainer.contains(thisCard.highlight)){
		cardsPlayContainer.setChildIndex(thisCard.highlight, cardsPlayContainer.numChildren-1);
	}
	if(thisCard.eliminated && cardsPlayContainer.contains(thisCard.eliminated)){
		cardsPlayContainer.setChildIndex(thisCard.eliminated, cardsPlayContainer.numChildren-1);
	}
}

function showDiscardCard(cardIndex, flip){
	var cardW = gameSettings.cardW;
	var cardSpeed = gameSettings.cardMoveSpeed;

	gameData.discard.push(cardIndex);
	var discardCardIndex = gameData.discard[gameData.discard.length-1];
	var thisCard = $.cards[discardCardIndex];
	if(thisCard){
		thisCard.cardDeal = false;
		toggleCardAction(thisCard, false);
		setCardDepth(thisCard);

		if(flip || !thisCard.contentContainer.visible || thisCard.contentContainer.scaleX === 0){
			flipCard(thisCard);
		}
		playSound('soundCardDeal');
		TweenMax.to(thisCard, cardSpeed, {x:(cardW/2), y:0, rotation:0, overwrite:true, onComplete:showDiscardCardComplete, onCompleteParams:[thisCard]});
	}
	getMatchDetail();
}

function showDiscardCardComplete(thisCard){
	var proceedCheck = true;
	if(gameData.match.count == 0){
		//begin
		for(var n=0; n<gameData.players; n++){
			$.players["stats" + n].visible = true;
			$.players["arrow" + n].visible = true;
		}

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			$.players["call" + socketData.gameIndex].visible = true;
		}else{
			$.players["call" + 0].visible = true;
		}
		itemColors.alpha = 1;

		if(gameData.excludeFirst.indexOf(thisCard.cardType) != -1){
			proceedCheck = false;
			showDrawCard(true);
		}else{
			toggleArrowTurn();
			displayPlayerTurn();	
		}
	}

	if(proceedCheck){
		checkDiscardCard(thisCard.cardType);
	}
}

function checkDiscardCard(cardType){
	gameData.turn.lastCardType = cardType;
	gameData.turn.drawCardsTotal = 0;
	if($.players[gameData.player].cards.length == 0){
		//end
		highlightPlayer(false);
		showGameStatus("emptycards");
	}else if(gameData.activePlayers == 1){
		//end
		highlightPlayer(false);
		showGameStatus("nomoreplayers");
	}else if(isAttackMode()){
		// --- UNO ATTACK DISPATCHER ---
		if(cardType == "hit2"){
			var victim = findNextPlayer(gameData.player);
			triggerAttackLauncher(victim, 2);
		}else if(cardType == "wildattack"){
			gameData.turn.pickColors = true;
			var victim = findNextPlayer(gameData.player);
			triggerAttackLauncher(victim, 2);
		}else if(cardType == "discardall"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var dumpColor = (topCard ? topCard.cardColor : gameData.match.color);
			executeDiscardAll(gameData.player, dumpColor);
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else{
			checkRoundEnd();
		}
	}else if(isAllWildMode()){
		// --- UNO ALL WILD DISPATCHER ---
		if(cardType == "wildreverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus('reverse');
		}else if(cardType == "wildskip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus('skip');
		}else if(cardType == "wildskipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus('skipeveryone');
		}else if(cardType == "wilddraw2"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}else if(cardType == "wilddraw4"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
			showGameStatus(cardType);
		}else if(cardType == "wildtargeteddraw2"){
			gameData.turn.targetPlayerAim = true;
			var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
			gameData.turn.queue.push(nextAction);
			showGameStatus('targeteddraw2');
		}else if(cardType == "wildswap"){
			gameData.turn.swap = true;
			gameData.turn.targetPlayerAim = true;
			showGameStatus('seven_swap');
		}else{
			checkRoundEnd();
		}
	}else if(isFlexMode()){
		// --- UNO FLEX DISPATCHER ---
		var discardCardIndex = gameData.discard[gameData.discard.length - 1];
		var topCard = $.cards[discardCardIndex];

		if(cardType == "flexdraw2"){
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				forceAllOtherPlayersDraw(gameData.player, 1);
				showGameStatus('flex_draw1_all');
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
				showGameStatus('draw2');
			}
		}else if(cardType == "flexskip"){
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				gameData.turn.skipEveryone = true;
				showGameStatus('skipeveryone');
			} else {
				gameData.turn.skip = true;
				togglePlayerSkip(true, true);
				showGameStatus('skip');
			}
		}else if(cardType == "flexdraw4"){
			gameData.turn.pickColors = true;
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				gameData.turn.targetPlayerAim = true;
				var nextAction = {action:'draw4', data:[{obj:'targetDrawCards', value:4}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
				gameData.turn.queue.push(nextAction);
				showGameStatus('targeteddraw4');
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
				showGameStatus('draw4');
			}
		}else if(cardType == "flexwildalldraw"){
			gameData.turn.pickColors = true;
			forceAllOtherPlayersDraw(gameData.player, 2);
			showGameStatus('flex_wildalldraw');
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else if(cardType == "flexnumber" || cardType == "number"){
			if(topCard && topCard.isPowerFlip && gameData.powerCards){
				gameData.powerCards[gameData.player] = true;
				showGameStatus('power_recharged');
			} else {
				checkRoundEnd();
			}
		}else{
			checkRoundEnd();
		}
	}else if(isFlipMode()){
		// --- UNO FLIP! DISPATCHER ---
		if(cardType == "flip"){
			executeFlip();
		}else if(cardType == "draw1"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 1;
			showGameStatus(cardType);
		}else if(cardType == "draw5"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 5;
			showGameStatus(cardType);
		}else if(cardType == "darkskipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus('skipeveryone');
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wilddraw2"){
			gameData.turn.pickColors = true;
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}else if(cardType == "wilddrawcolor"){
			gameData.turn.pickColors = true;
			gameData.turn.isWildDrawColor = true;
			showGameStatus(cardType);
		}else if(cardType == "wild" || cardType == "darkwild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else{
			checkRoundEnd();
		}
	}else if(isNoMercyMode()){
		// --- UNO SHOW 'EM NO MERCY DISPATCHER ---
		if(cardType == "draw2" || cardType == "draw4" || cardType == "wilddraw6" || cardType == "wilddraw10" || cardType == "wildreversdraw4" || cardType == "wilddraw4"){
			var dVal = getDrawValueOfCard(cardType);
			var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
			
			if (isStackingEnabled) {
				gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + dVal;
				gameData.turn.pendingDrawType = cardType;
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = dVal;
			}

			if(cardType.indexOf('wild') !== -1 || cardType === 'wilddraw4'){
				gameData.turn.pickColors = true;
			}
			if(cardType === 'wildreversdraw4'){
				gameData.turn.reverseTurn = true;
				gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			}
			showGameStatus(isStackingEnabled ? 'drawstack' : cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "skipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus(cardType);
		}else if(cardType == "discardall"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var dumpColor = (topCard ? topCard.cardColor : gameData.match.color);
			executeDiscardAll(gameData.player, dumpColor);
		}else if(cardType == "wildcolorroulette"){
			gameData.turn.pickColors = true;
			gameData.turn.isRoulette = true;
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else if(cardType == "number"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var isSwap70Enabled = (gameSettings.houseRules && gameSettings.houseRules.swap70 !== false);
			if(isSwap70Enabled && topCard && (topCard.cardValue === 7 || topCard.isNoMercy7)){
				gameData.turn.swap = true;
				gameData.turn.targetPlayerAim = true;
				showGameStatus('seven_swap');
			}else if(isSwap70Enabled && topCard && (topCard.cardValue === 0 || topCard.isNoMercy0)){
				passZeroAllHands();
				checkRoundEnd();
			}else{
				checkRoundEnd();
			}
		}else{
			checkRoundEnd();
		}
	}else if(cardType == "draw2"){
		var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
		if (isStackingEnabled) {
			gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + 2;
			gameData.turn.pendingDrawType = 'draw2';
			showGameStatus('drawstack');
		} else {
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}
	}else if(cardType == "draw3"){
		gameData.turn.drawCards = gameData.turn.drawCardsTotal = 3;
		showGameStatus(cardType);
	}else if(cardType == "reverse"){
		gameData.turn.reverseTurn = true;
		if(gameData.activePlayers == 2){
			gameData.turn.reverseCount = 1;
		}else{
			if(gameData.match.count == 0){
				gameData.turn.reverseCount = 1;
			}else{
				gameData.turn.reverseCount = 2;
			}
		}
		showGameStatus(cardType);
	}else if(cardType == "skip"){
		gameData.turn.skip = true;
		togglePlayerSkip(true, true);
		showGameStatus(cardType);
	}else if(cardType == "wild"){
		gameData.turn.pickColors = true;
		showGameStatus(cardType);
	}else if(cardType == "wilddraw4"){
		var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
		gameData.turn.pickColors = true;
		if (isStackingEnabled) {
			gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + 4;
			gameData.turn.pendingDrawType = 'wilddraw4';
			showGameStatus('drawstack');
		} else {
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
			showGameStatus(cardType);
		}
	}else if(cardType == "truesight"){
		gameData.turn.revealCard = true;
		gameData.turn.targetPlayerAim = true;
		showGameStatus(cardType);
	}else if(cardType == "oneforme"){
		gameData.turn.targetPlayer = gameData.player;
		gameData.turn.targetDrawCards = 1;
		gameData.turn.targetDrawCard = true;
		showGameStatus(cardType);
	}else if(cardType == "devildeal"){
		//Reverse, Skip then Draw 2 cards.
		var nextAction = {action:'reverse', data:[{obj:'reverseTurn', value:true}, {obj:'reverseCount', value:2}]};
		gameData.turn.queue.push(nextAction);
		var nextAction = {action:'skip', data:[]};
		gameData.turn.queue.push(nextAction);
		var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'played', value:true}]};
		gameData.turn.queue.push(nextAction);

		showGameStatus(cardType);
	}else if(cardType == "charity"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.giveCards = 2;
		gameData.turn.giveCard = true;
		showGameStatus(cardType);
	}else if(cardType == "targeteddraw2"){
		gameData.turn.targetPlayerAim = true;
		var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
		gameData.turn.queue.push(nextAction);
		showGameStatus(cardType);
	}else if(cardType == "eliminatedplayer"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.removePlayer = true;
		showGameStatus(cardType);
	}else if(cardType == "frozencolor"){
		gameData.turn.pickColors = true;
		gameData.turn.frozenPick = true;
		gameData.turn.frozenSkip = true;
		gameData.turn.frozenReset = gameData.player;
		showGameStatus(cardType);
	}else if(cardType == "add50points"){
		gameData.turn.addPoints = 50;
		showGameStatus(cardType);
	}else if(cardType == "targeteddraw3"){
		gameData.turn.targetPlayerAim = true;
		var nextAction = {action:'draw3', data:[{obj:'targetDrawCards', value:3}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
		gameData.turn.queue.push(nextAction);
		showGameStatus(cardType);
	}else if(cardType == "shufflehandcards"){
		gameData.turn.shuffle = true;
		showGameStatus(cardType);
	}else if(cardType == "swapcards"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.swap = true;
		showGameStatus(cardType);
	}else if(cardType == "itsatrap"){
		gameData.turn.targetPlayer = gameData.player;
		gameData.turn.targetDrawCards = 4;
		gameData.turn.targetDrawCard = true;
		showGameStatus(cardType);
	}else{
		checkRoundEnd();
	}
}

function drawPlayerCard(turn){
	gameData.turn.animating = true;
	if ($.players["called" + gameData.player]) {
		$.players["called" + gameData.player].visible = false;
	}

	if(turn){
		if(gameData.turn.penalty){
			if(gameData.turn.penaltyCards > 0){
				gameData.turn.penaltyCards--;
			}
		}else{
			if(gameData.turn.drawCards > 0){
				gameData.turn.drawCards--;
			}
		}
	}

	if(gameData.draw.length === 0){
		recycleDiscardPile();
	}

	if(gameData.draw.length === 0){
		// No cards left in deck or discard to draw
		gameData.turn.animating = false;
		gameData.turn.drawCard = false;
		checkRoundEnd();
		return;
	}

	var drawCardIndex = gameData.draw[0];
	gameData.draw.splice(0,1);
	showDrawCard(false);

	var thisPlayer = gameData.player;
	if(!$.players[thisPlayer]){
		gameData.turn.animating = false;
		checkRoundEnd();
		return;
	}
	$.players[thisPlayer].cards.push(drawCardIndex);

	var thisCard = $.cards[drawCardIndex];
	if(!thisCard){
		gameData.turn.animating = false;
		checkRoundEnd();
		return;
	}
	thisCard.cardDeal = true;
	highlightCard(thisCard, false);

	var cardW = gameSettings.cardW;
	thisCard.x = -(cardW / 2);
	thisCard.y = 0;
	thisCard.rotation = 0;
	thisCard.scaleX = 1;
	thisCard.scaleY = 1;
	if(thisCard.shadow){
		thisCard.shadow.x = -(cardW / 2) + (gameSettings.cardShadowX || 5);
		thisCard.shadow.y = 0 + (gameSettings.cardShadowY || 5);
		thisCard.shadow.rotation = 0;
	}

	var showCardContent = checkIsPlayer(thisPlayer);
	if(showCardContent){
		toggleCardAction(thisCard, true);
		flipCard(thisCard);
	}else{
		toggleCardAction(thisCard, false);
		flipCardCover(thisCard);
	}

	setCardDepth(thisCard);
	playSound('soundCardDeal');
	positionPlayerCards(thisPlayer, true);

	var cardSpeed = gameSettings.cardDealSpeed || 0.2;
	TweenMax.delayedCall(cardSpeed, drawPlayerCardComplete, [thisPlayer, thisCard]);
}

function drawPlayerCardComplete(index, card){
	gameData.turn.animating = false;

	var showCardContent = checkIsPlayer(index);
	if(showCardContent){
		toggleCardAction(card, true);
	}

	positionPlayerCards(index, true);

	if (checkMercyElimination(index)) {
		checkRoundEnd();
		return;
	}

	if (gameSettings.houseRules && gameSettings.houseRules.drawUntilPlayable && gameData.turn.drawCount > 0 && checkPossibleCard(index).length === 0 && !gameData.turn.loseTurn) {
		TweenMax.delayedCall(0.2, function(){
			drawPlayerCard(false);
		});
		return;
	}

	loopCardAction();
}

function getMatchDetail(){
	var discardCardIndex = gameData.discard[gameData.discard.length-1];
	var thisCard = $.cards[discardCardIndex];
	
	gameData.match.type = thisCard.cardType;
	if(gameData.excludeMatch.indexOf(thisCard.cardType) == -1){
		gameData.match.color = thisCard.cardColor;
		gameData.match.value = thisCard.cardValue;
	}

	var frozenColor = gameData.turn.frozenColor;
	if(gameData.turn.frozenPick){
		frozenColor = false;
		gameData.turn.frozenPick = false;
		gameData.turn.frozenColor = true;
		itemFrozen.alpha = 1;
		playSound('soundFreeze');
		animateFocus(itemFrozen);
	}

	if(gameData.match.lastColor != gameData.match.color && !frozenColor){
		playSound('soundColor');
		gameData.match.lastColor = gameData.match.color;
		itemColors.gotoAndStop(gameData.colors.indexOf(gameData.match.color));
		TweenMax.to(itemColors, .2, {scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
			TweenMax.to(itemColors, .2, {scaleX:.7, scaleY:.7, overwrite:true});	
		}});
	}
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display player turn
 * 
 */
function tryAIMove(possibleCardArr){
	var isBot = (gameData.isBotArr && gameData.isBotArr[gameData.player]);
	if(!gameData.ai && !(socketData.online && socketData.host && isBot)){
		return;
	}

	var aiSpeed = gameSettings.aiThinkSpeed || 1.1;

	if(gameData.turn.pendingDrawStack > 0){
		if(possibleCardArr.length > 0){
			TweenMax.delayedCall(aiSpeed, function(){
				var chosenCard = possibleCardArr[0];
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
					postSocketUpdate('wildaction', {card:'discardplayercard', cardData:chosenCard}, false);
				}
				discardPlayerCard(chosenCard, true);
			});
		}else{
			TweenMax.delayedCall(aiSpeed, function(){
				var stackToDraw = gameData.turn.pendingDrawStack;
				gameData.turn.pendingDrawStack = 0;
				gameData.turn.pendingDrawType = '';
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = stackToDraw;
				gameData.turn.drawCardsCount = 0;
				gameData.turn.loseTurn = true;
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
					postSocketUpdate('wildaction', {card:'stackdraw', cardData:stackToDraw}, false);
				}
				drawPlayerCard(true);
			});
		}
		return;
	}

	if(gameData.turn.loseTurn){
		checkRoundEnd();
	}else{
		var moveSpeed = gameData.turn.drawCount > 0 ? 0.8 : aiSpeed;
		if(possibleCardArr.length > 0){
			TweenMax.delayedCall(moveSpeed, function(){
				var chosenCard = possibleCardArr[0];
				// AI smart prioritization for No Mercy actions
				for (var i = 0; i < possibleCardArr.length; i++) {
					var cObj = $.cards[possibleCardArr[i]];
					if (cObj) {
						if (cObj.cardType === 'discardall') {
							chosenCard = possibleCardArr[i];
							break;
						} else if (cObj.cardType === 'skipeveryone' || cObj.cardType === 'wilddraw10' || cObj.cardType === 'wilddraw6') {
							chosenCard = possibleCardArr[i];
						}
					}
				}
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
					postSocketUpdate('wildaction', {card:'discardplayercard', cardData:chosenCard}, false);
				}
				discardPlayerCard(chosenCard, true);
			});
		}else{
			if(gameData.turn.drawCount >= 1){
				TweenMax.delayedCall(0.7, function(){
					checkRoundEnd();
				});
			}else{
				TweenMax.delayedCall(moveSpeed, function(){
					gameData.turn.drawCount++;
					if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
						postSocketUpdate('wildaction', {card:'drawplayercard', cardData:gameData.turn.drawCount}, false);
					}
					drawPlayerCard(false);
				});
			}
		}
	}
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display player turn
 * 
 */
function displayPlayerTurn(){
	gameData.match.active = true;
	gameData.turn.highlight = true;
	gameData.turn.played = false;
	gameData.turn.drawCount = 0;
	gameData.turn.drawCardsCount = 0;
	gameData.turn.drawCard = false;
	gameData.turn.loseTurn = false;
	gameData.turn.continuePlay = false;
	gameData.turn.penalty = false;

	var actionCard = false;
	if(gameData.turn.queue.length > 0){
		for(var n=0; n<gameData.turn.queue[0].data.length; n++){
			gameData.turn[gameData.turn.queue[0].data[n].obj] = gameData.turn.queue[0].data[n].value;
		}
		if(gameData.turn.queue[0].action == 'draw2'){
			gameData.turn.targetPlayer = gameData.player;
		}else if(gameData.turn.queue[0].action == 'draw3'){
			gameData.turn.targetPlayer = gameData.player;
		}else if(gameData.turn.queue[0].action == 'skip'){
			togglePlayerSkip(true, false);
		}
		showGameStatus(gameData.turn.queue[0].action);
		gameData.turn.queue.splice(0,1);
		actionCard = true;
	}

	if(gameData.turn.pendingDrawStack > 0){
		showGameStatus('drawstack');
	}

	if(!actionCard){
		if(gameData.turn.drawCards > 0){
			gameData.turn.highlight = false;
		}
		loopCardAction();
	}

	if(gameData.turn.highlight){
		highlightPlayer(true);
	}

	if(!gameData.turn.played){
		if(!actionCard){
			playerReadyAction();
		}
	}
}

function playerReadyAction(){
	var proceedAction = checkIsPlayer(gameData.player);
	if(proceedAction){
		gameData.turn.action = true;
	}
}

function loopCardAction(){
	if(gameData.turn.penaltyCards > 0){
		drawPlayerCard(true);
	}else if(gameData.turn.drawCards > 0 && !gameData.turn.penalty){
		gameData.turn.drawCardsCount++;
		drawPlayerCard(true);
	}else{
		if(gameData.turn.drawCardsCount == gameData.turn.drawCardsTotal && gameData.turn.drawCardsTotal != 0){
			if(gameData.turn.continuePlay){
				gameData.turn.action = true;
				gameData.turn.continuePlay = false;
			}else{
				gameData.turn.loseTurn = true;
			}
		}

		if(!gameData.turn.played){
			var possibleCardArr = checkPossibleCard(gameData.player);
			var proceedAction = checkIsPlayer(gameData.player);
			if(proceedAction){
				gameData.turn.action = true;
				if(gameData.turn.loseTurn){
					gameData.turn.drawCard = false;
					checkRoundEnd();
				}else{
					if(possibleCardArr.length > 0){
						//play card
						for(var n=0; n<possibleCardArr.length; n++){
							highlightCard($.cards[possibleCardArr[n]], true);
						}
						// If facing pending stack, clicking draw pile surrenders and draws the penalty stack
						if (gameData.turn.pendingDrawStack > 0) {
							gameData.turn.drawCard = true;
							var thisCard = $.cards[gameData.draw[0]];
							if(thisCard){
								toggleCardAction(thisCard, true);
							}
						} else {
							gameData.turn.drawCard = false;
							if(gameData.draw.length > 0){
								highlightCard($.cards[gameData.draw[0]], false);
								toggleCardAction($.cards[gameData.draw[0]], false);
							}
						}
					}else{
						if (gameData.turn.pendingDrawStack > 0) {
							gameData.turn.drawCard = true;
							var thisCard = $.cards[gameData.draw[0]];
							if(thisCard){
								toggleCardAction(thisCard, true);
								highlightCard(thisCard, true);
							}
						} else {
							//draw card
							if(gameData.turn.drawCount >= 1){
								gameData.turn.drawCard = false;
								gameData.match.active = false;
								checkRoundEnd();
							}else{
								gameData.turn.drawCard = true;
								var thisCard = $.cards[gameData.draw[0]];
								if(thisCard){
									toggleCardAction(thisCard, true);
									highlightCard(thisCard, true);
								}
							}
						}
					}
				}
			}else{
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					var isBotPlayer = gameData.isBotArr && gameData.isBotArr[gameData.player];
					if (socketData.host && isBotPlayer) {
						tryAIMove(possibleCardArr);
					} else if(gameData.turn.loseTurn){
						checkRoundEnd();
					}else if(gameData.turn.drawCount >= 1 && possibleCardArr.length == 0){
						gameData.turn.drawCard = false;
						gameData.match.active = false;
						checkRoundEnd();
					}
				}else{
					tryAIMove(possibleCardArr);
				}
			}	
		}else{
			checkRoundEnd();
		}
	}
}

/*!
 * 
 * POSSIBLE MOVES - This is the function that runs to check possible moves
 * 
 */
function checkPossibleCard(index){
	var possibleCardArr = [];

	for(var c=0; c<$.players[index].cards.length; c++){
		if(checkMatchCard($.players[index].cards[c])){
			possibleCardArr.push($.players[index].cards[c]);
		}
	}

	return possibleCardArr;
}

function checkMatchCard(cardIndex){
	var matchCard = false;
	var thisCard = $.cards[cardIndex];
	if(!thisCard) return false;

	if(gameData.turn && gameData.turn.pendingDrawStack > 0){
		var currentPenalty = getDrawValueOfCard(gameData.turn.pendingDrawType || 'draw2');
		var cardPenalty = getDrawValueOfCard(thisCard.cardType);
		if(cardPenalty >= currentPenalty && cardPenalty > 0){
			return true;
		}
		return false;
	}

	if(gameData.specialArr.indexOf(thisCard.cardType) != -1){
		matchCard = true;
	}else if(gameData.wildArr.indexOf(thisCard.cardType) != -1){
		matchCard = true;
	}else if(gameData.match.color === thisCard.cardColor && gameData.actionArr.indexOf(thisCard.cardType) != -1){
		matchCard = true;
	}else if(gameData.match.type === thisCard.cardType && gameData.actionArr.indexOf(thisCard.cardType) != -1){
		matchCard = true; 
	}else if(gameData.match.color === thisCard.cardColor){
		matchCard = true;
	}else if(gameData.match.value !== '' && gameData.match.value !== undefined && String(gameData.match.value) === String(thisCard.cardValue)){
		matchCard = true;
	}else if(isFlexMode() && gameData.powerCards && gameData.powerCards[gameData.player]){
		// Power Card is active (Green) - check Flex secondary attributes!
		if(thisCard.flexColor && thisCard.flexColor === gameData.match.color){
			matchCard = true;
		}else if(thisCard.flexType && thisCard.flexType === gameData.match.type){
			matchCard = true;
		}else if(thisCard.flexValue !== '' && thisCard.flexValue !== undefined && String(gameData.match.value) === String(thisCard.flexValue)){
			matchCard = true;
		}
	}
	return matchCard;
}

/*!
 * 
 * HIGHLIGHT PLAYER - This is the function that runs to highlight player
 * 
 */
function highlightPlayer(con){
	for(var n=0; n<gameData.players; n++){
		TweenMax.to($.players["stats" + n].playerName, .2, {alpha:1, overwrite:true});	
		$.players["stats" + n].alpha = .5;
	}

	if(con){
		playSound('soundAlert');
		animatePlayerFocus($.players["stats" + gameData.player]);
		animateBlink($.players["stats" + gameData.player].playerName);
		$.players["stats" + gameData.player].alpha = 1;
	}
}

function animatePlayerFocus(obj){
	TweenMax.to(obj, .2, {delay:.5, scaleX:1.3, scaleY:1.3, ease:Sine.easeIn,  overwrite:true, onComplete:function(){
		TweenMax.to(obj, .2, {scaleX:1, scaleY:1, ease:Sine.easeOut, overwrite:true});	
	}});
}

function animateFocus(obj){
	TweenMax.to(obj, .2, {scaleX:1.3, scaleY:1.3, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .2, {scaleX:1, scaleY:1, overwrite:true});	
	}});
}

function animateBlink(obj, alpha){
	var alphaNum = alpha == undefined ? .5 : alpha;
	obj.visible = true;
	obj.alpha = alphaNum;
	TweenMax.to(obj, .3, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .3, {alpha:alphaNum, overwrite:true, onComplete:animateBlink, onCompleteParams:[obj, alpha]});	
	}});
}

function killAnimateBlink(obj){
	obj.visible = false;
	TweenMax.killTweensOf(obj);
}

/*!
 * 
 * CHECK ROUND END - This is the function that runs to check round end
 * 
 */
function checkRoundEnd(){
	gameData.turn.action = false;
	gameData.turn.animating = false;
	togglePlayerSkip(false);
	
	if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
		highlightCard($.cards[gameData.draw[0]], false);
		toggleCardAction($.cards[gameData.draw[0]], false);
	}
	if($.players[gameData.player]){
		for(var n=0; n<$.players[gameData.player].cards.length; n++){
			var cObj = $.cards[$.players[gameData.player].cards[n]];
			if(cObj){
				highlightCard(cObj, false);
			}
		}
	}

	if($.players[gameData.player] && $.players[gameData.player].cards.length == 0){
		//end
		highlightPlayer(false);
		showGameStatus("emptycards");
	}else if(gameData.activePlayers <= 1){
		//end
		highlightPlayer(false);
		showGameStatus("nomoreplayers");
	}else if(gameData.turn.addPoints > 0){
		tweenData.tweenScore = playerData.scores[gameData.player];
		playerData.scores[gameData.player] += gameData.turn.addPoints;
		gameData.turn.addPoints = 0;
		TweenMax.to(tweenData, .5, {tweenScore:playerData.scores[gameData.player], overwrite:true, onUpdate:function(){
			$.players["stats" + gameData.player].playerScore.text = textDisplay.playerScore.replace("[NUMBER]", Math.round(tweenData.tweenScore));
		}, onComplete:function(){
			TweenMax.delayedCall(1, function(){
				checkRoundEnd();
			});
		}});
	}else if(gameData.turn.shuffle){
		gameData.turn.shuffle = false;
		gameData.turn.playerCards = [];
		for(var n=0; n<gameData.players; n++){
			if($.players[n].active){
				for(var c=0; c<$.players[n].cards.length; c++){
					gameData.turn.playerCards.push($.players[n].cards[c]);
				}
			}
		}
		shuffle(gameData.turn.playerCards);
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('shuffleplayercards', {index:socketData.gameIndex, allCards:gameData.turn.playerCards});
		}else{
			shufflePlayerCards(gameData.turn.playerCards);
		}
	}else if(gameData.turn.targetDrawCard && gameData.turn.targetPlayer == gameData.player){
		gameData.turn.targetDrawCard = false;
		gameData.turn.drawCards = gameData.turn.drawCardsTotal = gameData.turn.targetDrawCards;
		loopCardAction();
	}else if(gameData.turn.pickColors){
		gameData.turn.pickColors = false;
		toggleColors(true);
	}else if(gameData.turn.targetPlayerAim){
		gameData.turn.targetPlayerAim = false;
		toggleTargetPlayers(true);
	}else if(gameData.match.count == 0 && gameData.match.active){
		if(gameData.turn.drawCount > 0 || gameData.turn.loseTurn){
			nextPlayerTurn(true);
		}else{
			//stay
			nextPlayerTurn(false);
		}
	}else if(gameData.turn.frozenSkip){
		gameData.turn.frozenSkip = false;
		nextPlayerTurn(true);
	}else{
		if($.players[gameData.player] && $.players[gameData.player].cards.length === 1){
			playSound('soundCall');
			if($.players["called" + gameData.player]){
				$.players["called" + gameData.player].visible = true;
				animateFocus($.players["called" + gameData.player]);
			}
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('called', gameData.player, true);
			}
		}
		nextPlayerTurn(true);
	}
}

function shufflePlayerCards(allCards){
	var playerCards = [];
	for(var n=0; n<gameData.players; n++){
		var totalCards = $.players[n].cards.length;
		if($.players[n].active){
			$.players[n].cards.length = 0;
		}
		playerCards.push({index:n, totalCards:totalCards});
	}
	var allCardsIndex = 0;
	for(var n=0; n<gameData.players; n++){
		if($.players[n].active){
			for(var c=0; c<playerCards[n].totalCards; c++){
				var cardIndex = allCards[allCardsIndex];
				$.players[n].cards.push(cardIndex);

				var thisCard = $.cards[cardIndex];
				var showCardContent = checkIsPlayer(n);
				if(showCardContent){
					flipCard(thisCard);
				}else{
					flipCardCover(thisCard);
				}
				allCardsIndex++;
			}
			positionPlayerCards(n, true);
		}
	}

	TweenMax.delayedCall(1, function(){
		checkRoundEnd();
	});
}

function updatePlayerScore(player){
	tweenData.tweenScore = playerData.scores[player];
	playerData.scores[player] += gameData.turn.addPoints;
	gameData.turn.addPoints = 0;

	TweenMax.to(tweenData, .5, {tweenScore:playerData.scores[player], overwrite:true, onUpdate:function(){
		$.players["stats" + player].playerScore.text = textDisplay.playerScore.replace("[NUMBER]", Math.round(tweenData.tweenScore));
	}});
}

function checkCallPenalty(){
	// if($.players["called" + gameData.player].visible){
		nextPlayerTurn(true);
	// }else{
	// 	//penalty
	// 	gameData.turn.penalty = true;
	// 	gameData.turn.penaltyCards = 2;
	// 	showGameStatus('penalty');
	// 	animateFocus($.players["call"+gameData.player]);
	// }
}

/*!
 * 
 * NEXT PLAYER - This is the function that runs to next player
 * 
 */
function nextPlayerTurn(next){
	if (gameData.turn.skipEveryone) {
		gameData.turn.skipEveryone = false;
		displayPlayerTurn();
		return;
	}

	if(next){
		//if(gameData.turn.lastCardType != 'devildeal'){
			gameData.player = findNextPlayer(gameData.player);
		//}
		gameData.turn.lastCardType = '';
	}

	if(gameData.turn.frozenColor && gameData.player == gameData.turn.frozenReset){
		itemFrozen.alpha = 0;
		gameData.turn.frozenColor = false;
	}

	if(!$.players[gameData.player] || !$.players[gameData.player].active){
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.skip){
		gameData.turn.skip = false;
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.reverseTurn){
		gameData.turn.reverseCount--;
		if(gameData.players == 2){

		}
		gameData.turn.reverse = gameData.turn.reverse == true ? false : true;
		gameData.turn.reverseTurn = false;
		toggleArrowTurn();
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.reverseCount > 0){
		gameData.turn.reverseCount--;
		nextPlayerTurn(true);
		return;
	}

	displayPlayerTurn();
}

function findNextPlayer(nextPlayer){
	if(!gameData.turn.reverse){
		nextPlayer++;
		nextPlayer = nextPlayer > gameData.players-1 ? 0 : nextPlayer;
	}else{
		nextPlayer--;
		nextPlayer = nextPlayer < 0 ? gameData.players-1 : nextPlayer;
	}
	return nextPlayer;
}

function togglePlayerSkip(con, next){
	var skipPlayer = gameData.player;
	if(con){
		if(gameData.match.count != 0 && next){
			skipPlayer = findNextPlayer(gameData.player);
		}
	}else{
		skipPlayer = -1;
	}

	for(var n=0; n<gameData.players; n++){
		$.players["skip" + n].visible = false;
		$.players["call"+n].alpha = 1;
		$.players["called"+n].alpha = 1;

		if(skipPlayer == n){
			$.players["skip" + n].visible = true;
			$.players["call"+n].alpha = 0;
			$.players["called"+n].alpha = 0;
		}
	}
}

function toggleArrowTurn(){
	for(var n=0; n<gameData.players; n++){
		$.players["arrow" + n].itemArrowL.visible = false;
		$.players["arrow" + n].itemArrowR.visible = false;
		if(!gameData.turn.reverse){
			$.players["arrow" + n].itemArrowL.rotation = -90;
			$.players["arrow" + n].itemArrowL.visible = true;
			TweenMax.to($.players["arrow" + n].itemArrowL, .5, {rotation:0, overwrite:true});
			playSound('soundDirection');
		}else{
			$.players["arrow" + n].itemArrowR.rotation = 180;
			$.players["arrow" + n].itemArrowR.visible = true;
			TweenMax.to($.players["arrow" + n].itemArrowR, .5, {rotation:90, overwrite:true});
			playSound('soundDirectionReverse');
		}
	}
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		for(var n=0; n<gameData.cards.length; n++){
			var thisCard = gameData.cards[n];
			thisCard.highlight.x = thisCard.x;
			thisCard.highlight.y = thisCard.y;
			thisCard.highlight.rotation = thisCard.rotation;
			thisCard.eliminated.x = thisCard.x;
			thisCard.eliminated.y = thisCard.y;
			thisCard.eliminated.rotation = thisCard.rotation;

			thisCard.shadow.x = thisCard.x + gameSettings.cardShadowX;
			thisCard.shadow.y = thisCard.y + gameSettings.cardShadowY;
			thisCard.shadow.rotation = thisCard.rotation;
			thisCard.shadow.visible = thisCard.visible;
		}
	}
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	var delayStart = 0;
	var delayMessage = 1;
	var soundName = "soundAlert";
	statusPlayerTxt.text = $.players["stats" + gameData.player] ? $.players["stats" + gameData.player].playerName.text : '';
	statusIconContainer.removeAllChildren();
	statusTxt.font = "25px bpreplaybold";
	itemStatus.visible = true;
	itemStatusLong.visible = false;

	var shouldAdvanceTurn = false;

	if(con == 'penalty'){
		soundName = "soundWarning";
		delayStart = .5;
		statusTxt.text = textDisplay.playerPenalty;
		TweenMax.delayedCall(2, function(){
			loopCardAction();
		});
	}else if(con == 'emptycards'){
		soundName = "soundWinner";
		delayStart = 1;
		statusTxt.text = textDisplay.emptyCards;
		statusPlayerTxt.text = statusPlayerTxt.text + textDisplay.playerWon;
		TweenMax.delayedCall(3, function(){
			toggleRoundScore(true, true);
		});
	}else if(con == 'nomoreplayers'){
		soundName = "soundWinner";
		delayStart = 1;
		statusTxt.text = textDisplay.noMorePlayers;
		statusPlayerTxt.text = statusPlayerTxt.text + textDisplay.playerWon;
		TweenMax.delayedCall(3, function(){
			toggleRoundScore(true, true);
		});
	}else if(con == 'drawstack'){
		soundName = "soundWarning";
		delayStart = .2;
		delayMessage = 1.2;
		statusTxt.text = "STACK: +" + gameData.turn.pendingDrawStack + " CARDS!";
		statusPlayerTxt.text = "Defend or Draw Stack";
		shouldAdvanceTurn = true;
	}else if(con == 'jump_in'){
		soundName = "soundAction";
		delayStart = .1;
		delayMessage = 1.2;
		statusTxt.text = "⚡ JUMP-IN!";
		statusPlayerTxt.text = "Exact match out-of-turn!";
	}else if(con == 'seven_swap'){
		soundName = "soundAction";
		delayStart = .3;
		statusTxt.text = "7-SWAP HANDS!";
		statusPlayerTxt.text = "Choose a player to swap";
		shouldAdvanceTurn = true;
	}else if(con == 'zero_pass'){
		soundName = "soundDirection";
		delayStart = .3;
		statusTxt.text = "0-PASS ALL HANDS!";
		statusPlayerTxt.text = "Hands rotate!";
	}else if(con == 'mercy_ko'){
		soundName = "soundEliminated";
		delayStart = .5;
		delayMessage = 1.5;
		statusTxt.text = "MERCY KNOCKOUT!";
		statusPlayerTxt.text = "Eliminated (25+ Cards)";
	}else if(con == 'flip_dark'){
		soundName = "soundDirection";
		delayStart = .2;
		delayMessage = 1.4;
		statusTxt.text = "FLIPPED TO DARK SIDE! 🌙";
		statusPlayerTxt.text = "Dark cards & colors active!";
		shouldAdvanceTurn = true;
	}else if(con == 'flip_light'){
		soundName = "soundDirection";
		delayStart = .2;
		delayMessage = 1.4;
		statusTxt.text = "FLIPPED TO LIGHT SIDE! ☀️";
		statusPlayerTxt.text = "Light cards & colors active!";
		shouldAdvanceTurn = true;
	}else if(con == 'flex_draw1_all'){
		soundName = "soundWarning";
		delayStart = .2;
		delayMessage = 1.4;
		statusTxt.text = "FLEX: +1 TO ALL PLAYERS! ⚡";
		statusPlayerTxt.text = "All opponents draw 1 card!";
		shouldAdvanceTurn = true;
	}else if(con == 'flex_wildalldraw'){
		soundName = "soundWarning";
		delayStart = .2;
		delayMessage = 1.4;
		statusTxt.text = "FLEX: ALL DRAW 2! ⚡";
		statusPlayerTxt.text = "All opponents draw 2 cards!";
		shouldAdvanceTurn = true;
	}else if(con == 'power_recharged'){
		soundName = "soundColorPick";
		delayStart = .2;
		delayMessage = 1.2;
		statusTxt.text = "POWER RECHARGED! ⚡";
		statusPlayerTxt.text = "Power Card is active (Green)";
		shouldAdvanceTurn = true;
	}else if(con == 'attack_safe'){
		soundName = "soundAlert";
		delayStart = .2;
		delayMessage = 1.2;
		statusTxt.text = "CLICK! SAFE (0 CARDS)! 🚀";
		statusPlayerTxt.text = "Survived launcher press!";
	}else if(con == 'attack_burst'){
		soundName = "soundWarning";
		delayStart = .2;
		delayMessage = 1.4;
		statusTxt.text = "LAUNCHER BURST! 🚀";
		statusPlayerTxt.text = "Cards ejected!";
	}else if(con == 'targeteddraw2' || con == 'targeteddraw4' || con == 'wildtargeteddraw2'){
		soundName = "soundAction";
		delayStart = .2;
		delayMessage = 1.2;
		statusTxt.text = con == 'targeteddraw4' ? "TARGETED DRAW 4!" : "TARGETED DRAW 2!";
		statusPlayerTxt.text = "Choose target player";
		shouldAdvanceTurn = true;
	}else{
		soundName = "soundAction";
		delayStart = .5;
		delayMessage = 1;
		statusTxt.text = findCardText(con);
		statusPlayerTxt.text = '';
		shouldAdvanceTurn = true;
	}

	if(shouldAdvanceTurn){
		if($.players[gameData.player]){
			for(var n=0; n<$.players[gameData.player].cards.length; n++){
				var cObj = $.cards[$.players[gameData.player].cards[n]];
				if(cObj) highlightCard(cObj, false);
			}
		}
		if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
			highlightCard($.cards[gameData.draw[0]], false);
		}
		var waitTime = (con == 'drawstack' || con.indexOf('flex') !== -1 || con.indexOf('flip') !== -1) ? 1.2 : 2.0;
		TweenMax.delayedCall(waitTime, function(){
			checkRoundEnd();
		});
	}

	if(statusTxt.getMeasuredWidth() > 260){
		itemStatus.visible = false;
		itemStatusLong.visible = true;
	}

	for(var n=25; n>=0; n--){
		statusTxt.font = n+"px bpreplaybold";
		if(statusTxt.getMeasuredWidth() < 360){
			n = -1;
		}
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {delay:delayStart, alpha:1, overwrite:true, onStart:function(){
		playSound(soundName);
	},onComplete:function(){
		TweenMax.to(statusContainer, .5, {delay:delayMessage, alpha:0, overwrite:true});
	}});
}

function findCardText(con){
	var cardText = '';
	var cardIconName = '';
	guideTxt.font = "20px bpreplaybold";

	if(con === 'flip'){
		cardText = 'FLIP THE DECK!';
	}else if(con === 'hit2'){
		cardText = 'HIT 2 (PRESS LAUNCHER)';
	}else if(con === 'wildattack'){
		cardText = 'WILD ATTACK-ATTACK';
	}else if(con === 'wildreverse'){
		cardText = 'WILD REVERSE';
	}else if(con === 'wildskip'){
		cardText = 'WILD SKIP';
	}else if(con === 'wildskipeveryone'){
		cardText = 'WILD SKIP EVERYONE';
	}else if(con === 'wildtargeteddraw2'){
		cardText = 'WILD TARGETED DRAW 2';
	}else if(con === 'flexdraw2'){
		cardText = 'FLEX DRAW 2';
	}else if(con === 'flexskip'){
		cardText = 'FLEX SKIP';
	}else if(con === 'flexdraw4'){
		cardText = 'FLEX TARGET DRAW 4';
	}else if(con === 'flexwildalldraw'){
		cardText = 'FLEX ALL DRAW 2';
	}else if(con === 'flexnumber'){
		cardText = 'FLEX CARD';
	}else if(con === 'draw1'){
		cardText = 'DRAW 1 CARD';
	}else if(con === 'draw5'){
		cardText = 'DRAW 5 CARDS';
	}else if(con === 'darkskipeveryone'){
		cardText = 'DARK SKIP EVERYONE';
	}else if(con === 'wilddraw2'){
		cardText = 'WILD DRAW 2';
	}else if(con === 'wilddrawcolor'){
		cardText = 'WILD DRAW COLOR';
	}else if(con === 'darkwild'){
		cardText = 'DARK WILD CARD';
	}else if(con === 'wilddraw10'){
		cardText = 'WILD DRAW 10 (NO MERCY)';
	}else if(con === 'wilddraw6'){
		cardText = 'WILD DRAW 6';
	}else if(con === 'wildreversdraw4'){
		cardText = 'WILD REVERSE DRAW 4';
	}else if(con === 'wildcolorroulette'){
		cardText = 'WILD COLOR ROULETTE';
	}else if(con === 'discardall'){
		cardText = 'DISCARD ALL COLOR';
	}else if(con === 'skipeveryone'){
		cardText = 'SKIP EVERYONE';
	}else if(con === 'draw4'){
		cardText = 'DRAW 4 CARDS';
	}

	for(var n=0; n<cards_arr.actions.length; n++){
		if(con == cards_arr.actions[n].type){
			cardText = cards_arr.actions[n].text;
			cardIconName = 'cardActions'+n;
		}
	}

	for(var n=0; n<cards_arr.wilds.length; n++){
		if(con == cards_arr.wilds[n].type){
			cardText = cards_arr.wilds[n].text;
			cardIconName = 'cardWilds'+n;
		}
	}

	for(var n=0; n<cards_arr.specials.length; n++){
		if(con == cards_arr.specials[n].type){
			cardText = cards_arr.specials[n].text;
			cardIconName = 'cardSpecials'+n;
		}
	}

	for(var n=0; n<cards_arr.otherActions.length; n++){
		if(con == cards_arr.otherActions[n].type){
			cardText = cards_arr.otherActions[n].text;
			cardIconName = 'cardOtherActions'+n;
		}
	}

	for(var n=20; n>=0; n--){
		guideTxt.font = n+"px bpreplaybold";
		if(guideTxt.getMeasuredWidth() < 250){
			n = -1;
		}
	}

	if(cardIconName){
		var imgRes = loader.getResult(cardIconName);
		if(imgRes){
			var cardIcon = new createjs.Bitmap(imgRes);
			centerReg(cardIcon);
			if(cardIcon.image && cardIcon.image.naturalHeight){
				cardIcon.regY = cardIcon.image.naturalHeight;
			}
			statusIconContainer.addChild(cardIcon);
		}
	}

	return cardText || con;
}

function showGameGuide(con){
	var isPlayer = checkIsPlayer(gameData.player);	
	if(con == 'targetplayer'){
		guideTxt.text = isPlayer == true ? textDisplay.playerTarget : textDisplay.playerTargeting;
	}else if(con == 'selectcards'){
		guideTxt.text = isPlayer == true ? textDisplay.selectCards : textDisplay.selectingCards;
	}
	
	var alphaNum = con == undefined ? 0 : 1;
	TweenMax.to(guideContainer, .5, {alpha:alphaNum, overwrite:true});
}

/*!
 * 
 * TOGGLE ROUND SCORE - This is the function that runs to toggle round score
 * 
 */
function toggleRoundScore(con, win){
	cardScoreListContainer.removeAllChildren();
	cardScoreContainer.visible = con;

	if(con){
		//calculate
		playSound("soundPoint");
		var finalScore = 0;
		var scoreListArr = [];
		var roundEnd = false;

		for(var n=0; n<gameData.players; n++){
			var totalPoints = 0;
			for(var p=0; p<$.players[n].cards.length; p++){
				var thisCard = $.cards[$.players[n].cards[p]];
				thisCard.eliminated.visible = false;

				var notPlayer = false;
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if(n != socketData.gameIndex){
						notPlayer = true;
					}
				}else{
					if(n != 0){
						notPlayer = true;
					}
				}
				
				if(notPlayer){
					flipCard(thisCard);
				}
				totalPoints += thisCard.cardPoint;
			}

			if(win){
				finalScore += totalPoints;
			}else{
				scoreListArr.push({total:totalPoints, player:n});
			}
		}

		if(!win){
			sortOnObject(scoreListArr, "total", false);
			gameData.player = scoreListArr[0].player;

			finalScore = 0;
			for(var n=1; n<scoreListArr.length; n++){
				finalScore += scoreListArr[n].total;
			}
		}

		//display score
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(win && $.players[gameData.player].playerIndex == socketData.gameIndex){
				roundStatusTxt.text = textDisplay.playerRoundWin;
			}else{
				roundStatusTxt.text = textDisplay.playerRoundLose;
			}
		}else{
			if(win && $.players[gameData.player].playerIndex == 0){
				roundStatusTxt.text = textDisplay.playerRoundWin;
			}else{
				roundStatusTxt.text = textDisplay.playerRoundLose;
			}
		}

		var pos = {startY:50, x:-150, y:0, spaceY:45, scoreX:300, titleSpace:50};
		pos.y = pos.startY - (((gameData.players-1) * pos.spaceY));
		pos.y -= pos.titleSpace;
		itemScoreTop.y = pos.y - pos.spaceY;

		var goalPointTitle = new createjs.Text();
		goalPointTitle.font = "23px bpreplaybold";
		goalPointTitle.color = '#fff';
		goalPointTitle.textAlign = "center";
		goalPointTitle.textBaseline='alphabetic';
		var curGoal = gameData.fourcolors.point || (gameSettings.points[gameData.pointIndex] !== undefined ? gameSettings.points[gameData.pointIndex] : 500);
		if (curGoal === 1) {
			goalPointTitle.text = "1 ROUND MATCH";
		} else {
			goalPointTitle.text = textDisplay.goalPointTitle.replace("[NUMBER]", curGoal);
		}
		goalPointTitle.y = pos.y;

		var titleDivide = new createjs.Bitmap(loader.getResult('itemScoreDivide'));
		centerReg(titleDivide);
		titleDivide.y = pos.y + 15;

		pos.y += pos.titleSpace;
		cardScoreListContainer.addChild(goalPointTitle, titleDivide);

		var targetScoreTxt = null;
		var targetScore = 0;
		for(var n=0; n<gameData.players; n++){
			var playerName = new createjs.Text();
			playerName.font = "23px bpreplaybold";
			playerName.color = '#fff';
			playerName.textAlign = "left";
			playerName.textBaseline='alphabetic';
			playerName.text = $.players["stats" + n].playerName.text;

			var playerScore = new createjs.Text();
			playerScore.font = "23px bpreplaybold";
			playerScore.color = '#fff';
			playerScore.textAlign = "right";
			playerScore.textBaseline='alphabetic';
			playerScore.text = textDisplay.playerScore.replace("[NUMBER]", playerData.scores[n]);

			if(n == gameData.player){
				tweenData.tweenScore = playerData.scores[n];
				targetScoreTxt = playerScore;
				playerData.scores[n] += finalScore;
				playerName.text = playerName.text + textDisplay.playerScoreAdd.replace("[NUMBER]", finalScore);
				targetScore = playerData.scores[n];

				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if($.players[gameData.player].playerIndex == socketData.gameIndex){
						roundStatusTxt.text = textDisplay.playerRoundWin;
					}
				}else{
					if($.players[gameData.player].playerIndex == 0){
						roundStatusTxt.text = textDisplay.playerRoundWin;
					}
				}

				if(playerData.scores[n] >= gameData.fourcolors.point){
					if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
						if($.players[gameData.player].playerIndex == socketData.gameIndex){
							roundStatusTxt.text = textDisplay.userWin;
						}else{
							roundStatusTxt.text = textDisplay.playerWin.replace("[NAME]", $.players["stats" + n].playerName.text);
						}
					}else{
						if($.players[gameData.player].playerIndex == 0){
							roundStatusTxt.text = textDisplay.userWin;
						}else{
							roundStatusTxt.text = textDisplay.playerWin.replace("[NAME]", $.players["stats" + n].playerName.text);
						}
					}
					roundEnd = true;
				}

				playerName.color = playerScore.color = '#FF7F0B';
				animateBlink(playerName, .6);
				animateBlink(playerScore, .6);
			}

			var playerDivide = new createjs.Bitmap(loader.getResult('itemScoreDivide'));
			centerReg(playerDivide);

			playerName.x = pos.x;
			playerName.y = pos.y;

			playerScore.x = pos.x + pos.scoreX;
			playerScore.y = pos.y;

			playerDivide.y = pos.y + (pos.spaceY/4);
			playerDivide.visible = n == gameData.players-1 ? false : true;

			pos.y += pos.spaceY;
			cardScoreListContainer.addChild(playerName, playerScore, playerDivide);
			$.players["stats" + n].playerScore.text = textDisplay.playerScore.replace("[NUMBER]", playerData.scores[n]);
		}

		if(targetScoreTxt != null){
			TweenMax.to(tweenData, .5, {delay:1, tweenScore:targetScore, overwrite:true, onUpdate:function(){
				targetScoreTxt.text = textDisplay.playerScore.replace("[NUMBER]", Math.round(tweenData.tweenScore));
			}});
		}
		sendEvent("showInterstitialInGame","endRound");
		cardScoreContainer.alpha = 0;
		TweenMax.to(cardScoreContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
			TweenMax.to(cardScoreContainer, 4, {overwrite:true, onComplete:function(){

				if(roundEnd){
					endGame();
				}else{
					TweenMax.to(cardScoreContainer, .5, {alpha:0, overwrite:true, onComplete:function(){
						playSound("soundCardShuffle");
						for(var n=0; n<gameData.cards.length; n++){
							var thisCard = gameData.cards[n];
							thisCard.eliminated.visible = false;
							if(thisCard.contentContainer.visible){
								flipCardCover(thisCard);
							}
							TweenMax.to(thisCard, gameSettings.cardDealSpeed, {x:0, y:0, rotation:0, scaleX:1, scaleY:1, overwrite:true});
						}

						itemColors.alpha = 0;
						for(var n=0; n<gameData.players; n++){
							$.players[n].active = true;
							$.players["stats" + n].visible = false;
							$.players["call" + n].visible = false;
							$.players["called" + n].visible = false;
							$.players["arrow" + n].visible = false;
							$.players["eliminated"+n].visible = false;
						}
						
						TweenMax.to(cardScoreContainer, .5, {alpha:0, overwrite:true, onComplete:function(){
							if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
								postSocketUpdate('resultcomplete', socketData.gameIndex);
							}else{
								startCards();
							}
						}});
					}});
				}
			}});
		}});
	}
}

/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;
	TweenMax.to(gameContainer, 1, {overwrite:true, onComplete:function(){
		goPage('result')
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}

