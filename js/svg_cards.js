/**
 * Modular SVG Card Loader and Renderer
 * Loads individual, standalone SVG card asset files from assets/svg/
 * No hardcoded SVGs in JS - all graphics are separate SVG files.
 */

var SVGCards = (function() {
	var canvasCache = {};
	var imgCache = {};

	var colorPalette = {
		red: { main: '#ff2d55', dark: '#b30024', light: '#ff6b8b' },
		blue: { main: '#007aff', dark: '#004db3', light: '#4da3ff' },
		green: { main: '#34c759', dark: '#1e8238', light: '#6ddb89' },
		yellow: { main: '#ffcc00', dark: '#b38f00', light: '#ffdc4d' },
		pink: { main: '#ff2a85', dark: '#990045', light: '#ff70a6' },
		teal: { main: '#00f0ff', dark: '#008b99', light: '#66f6ff' },
		orange: { main: '#ff6b00', dark: '#b34700', light: '#ff994d' },
		purple: { main: '#9d4edd', dark: '#5a189a', light: '#c77dff' },
		wild: { main: '#ffffff', dark: '#111119', light: '#ffffff' },
		darkwild: { main: '#ffffff', dark: '#06060a', light: '#ffffff' }
	};

	/**
	 * Resolves the relative path to the standalone SVG file for any card
	 */
	function getCardSVGPath(cardType, cardColor, cardValue) {
		var type = String(cardType || 'number').toLowerCase();
		var color = (cardColor && colorPalette[cardColor]) ? cardColor.toLowerCase() : '';
		var val = cardValue !== undefined ? cardValue : '';

		// 1. Specials
		var specials = [
			'truesight', 'oneforme', 'devildeal', 'charity',
			'targeteddraw2', 'targeteddraw4', 'eliminatedplayer', 'frozencolor'
		];
		if (specials.indexOf(type) !== -1 && (!color || color === 'wild')) {
			return 'assets/svg/card_special_' + type + '.svg';
		}

		// 2. Wilds
		var wilds = [
			'wild', 'darkwild', 'wilddraw4', 'wilddraw', 'wilddraw2', 'wilddraw6',
			'wilddraw10', 'wildreversdraw4', 'wildcolorroulette', 'wilddrawcolor',
			'wildattack', 'wildswap', 'wildreverse', 'wildskip', 'wildskipeveryone',
			'wildtargeteddraw2', 'flexdraw4', 'flexwildalldraw'
		];
		if (wilds.indexOf(type) !== -1) {
			var wName = (type === 'wilddraw') ? 'wilddraw4' : type;
			return 'assets/svg/card_' + wName + '.svg';
		}

		// 3. Numbers
		if (type === 'number' || (!isNaN(Number(type)) && type.trim() !== '')) {
			var numVal = (val !== '' && val !== undefined) ? val : type;
			var colName = color || 'red';
			return 'assets/svg/card_' + colName + '_' + numVal + '.svg';
		}

		// 4. Color Actions (draw2, draw4, draw1, draw5, skip, reverse, discardall, skipeveryone, flip, hit2, flexnumber, flexdraw2, flexskip)
		var colName = color || 'red';
		var actName = (type === 'draw') ? 'draw2' : type;
		return 'assets/svg/card_' + colName + '_' + actName + '.svg';
	}

	/**
	 * Loads or retrieves a cached HTML Image element for an SVG path
	 */
	function getLoadedImage(svgPath, onLoadCallback) {
		if (imgCache[svgPath] && imgCache[svgPath].complete) {
			if (typeof onLoadCallback === 'function') {
				onLoadCallback(imgCache[svgPath]);
			}
			return imgCache[svgPath];
		}

		if (!imgCache[svgPath]) {
			var img = new Image();
			img.src = svgPath;
			imgCache[svgPath] = img;
		}

		var img = imgCache[svgPath];
		var prevOnload = img.onload;
		img.onload = function() {
			if (typeof prevOnload === 'function') prevOnload();
			if (typeof onLoadCallback === 'function') onLoadCallback(img);
		};

		return img;
	}

	/**
	 * Returns an HTML5 Canvas containing the rendered standalone SVG card
	 */
	function getCardCanvas(cardType, cardColor, cardValue) {
		var key = (cardType || 'number') + '_' + (cardColor || 'wild') + '_' + (cardValue !== undefined ? cardValue : '');
		if (canvasCache[key]) {
			return canvasCache[key];
		}

		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 300;
		var ctx = canvas.getContext('2d');

		var svgPath = getCardSVGPath(cardType, cardColor, cardValue);
		getLoadedImage(svgPath, function(img) {
			ctx.clearRect(0, 0, 200, 300);
			ctx.drawImage(img, 0, 0, 200, 300);
			if (typeof stage !== 'undefined' && stage && stage.update) {
				stage.update();
			}
		});

		canvasCache[key] = canvas;
		return canvas;
	}

	/**
	 * Card Cover (Back) Canvas
	 */
	function getCardCoverCanvas(isDark) {
		var key = 'cover_' + (isDark ? 'dark' : 'classic');
		if (canvasCache[key]) {
			return canvasCache[key];
		}

		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 300;
		var ctx = canvas.getContext('2d');

		var svgPath = isDark ? 'assets/svg/card_cover_dark.svg' : 'assets/svg/card_cover_light.svg';
		getLoadedImage(svgPath, function(img) {
			ctx.clearRect(0, 0, 200, 300);
			ctx.drawImage(img, 0, 0, 200, 300);
			if (typeof stage !== 'undefined' && stage && stage.update) {
				stage.update();
			}
		});

		canvasCache[key] = canvas;
		return canvas;
	}

	/**
	 * Highlight Canvas
	 */
	function getHighlightCanvas() {
		var key = 'overlay_highlight';
		if (canvasCache[key]) {
			return canvasCache[key];
		}

		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 300;
		var ctx = canvas.getContext('2d');

		var svgPath = 'assets/svg/card_highlight.svg';
		getLoadedImage(svgPath, function(img) {
			ctx.clearRect(0, 0, 200, 300);
			ctx.drawImage(img, 0, 0, 200, 300);
			if (typeof stage !== 'undefined' && stage && stage.update) {
				stage.update();
			}
		});

		canvasCache[key] = canvas;
		return canvas;
	}

	/**
	 * Eliminated Overlay Canvas
	 */
	function getEliminatedCanvas() {
		var key = 'overlay_eliminated';
		if (canvasCache[key]) {
			return canvasCache[key];
		}

		var canvas = document.createElement('canvas');
		canvas.width = 200;
		canvas.height = 300;
		var ctx = canvas.getContext('2d');

		var svgPath = 'assets/svg/card_eliminated.svg';
		getLoadedImage(svgPath, function(img) {
			ctx.clearRect(0, 0, 200, 300);
			ctx.drawImage(img, 0, 0, 200, 300);
			if (typeof stage !== 'undefined' && stage && stage.update) {
				stage.update();
			}
		});

		canvasCache[key] = canvas;
		return canvas;
	}

	return {
		getCardSVGPath: getCardSVGPath,
		getCardCanvas: getCardCanvas,
		getCardCoverCanvas: getCardCoverCanvas,
		getHighlightCanvas: getHighlightCanvas,
		getEliminatedCanvas: getEliminatedCanvas,
		colorPalette: colorPalette
	};
})();

if (typeof window !== 'undefined') {
	window.SVGCards = SVGCards;
}
