/**
 * SVG Vector Card Generator for UNO Show 'Em No Mercy, UNO Flip!, and Custom Cards
 * Generates pure Scalable Vector Graphics (SVG) with high-fidelity vector definitions.
 */

var SVGCards = (function() {
	var svgCache = {};

	var colorPalette = {
		// Classic / Light Side Colors
		red: {
			main: '#ff3344',
			dark: '#b30018',
			bgGradStart: '#200508',
			bgGradEnd: '#3a090e',
			ovalStart: '#ff4d5e',
			ovalEnd: '#d6001c',
			accent: '#ff99a8',
			glow: 'rgba(255, 51, 68, 0.6)'
		},
		blue: {
			main: '#00a8ff',
			dark: '#005bb5',
			bgGradStart: '#041021',
			bgGradEnd: '#071f3f',
			ovalStart: '#33baff',
			ovalEnd: '#0066cc',
			accent: '#99deff',
			glow: 'rgba(0, 168, 255, 0.6)'
		},
		green: {
			main: '#00e676',
			dark: '#008a43',
			bgGradStart: '#031a0e',
			bgGradEnd: '#07331c',
			ovalStart: '#33eb91',
			ovalEnd: '#00a852',
			accent: '#99f5c8',
			glow: 'rgba(0, 230, 118, 0.6)'
		},
		yellow: {
			main: '#ffea00',
			dark: '#bfae00',
			bgGradStart: '#1f1c03',
			bgGradEnd: '#3d3706',
			ovalStart: '#ffee33',
			ovalEnd: '#cca700',
			accent: '#fff799',
			glow: 'rgba(255, 234, 0, 0.6)'
		},
		// Dark Side Colors (UNO Flip!)
		pink: {
			main: '#ff2a85',
			dark: '#990045',
			bgGradStart: '#240212',
			bgGradEnd: '#420422',
			ovalStart: '#ff5c9f',
			ovalEnd: '#c4005b',
			accent: '#ff9ec9',
			glow: 'rgba(255, 42, 133, 0.6)'
		},
		teal: {
			main: '#00f0ff',
			dark: '#008b99',
			bgGradStart: '#01191c',
			bgGradEnd: '#033136',
			ovalStart: '#5cf5ff',
			ovalEnd: '#009cb0',
			accent: '#b8fbff',
			glow: 'rgba(0, 240, 255, 0.6)'
		},
		orange: {
			main: '#ff7700',
			dark: '#b34700',
			bgGradStart: '#1f0d01',
			bgGradEnd: '#3b1b04',
			ovalStart: '#ff9933',
			ovalEnd: '#cc5500',
			accent: '#ffd1a3',
			glow: 'rgba(255, 119, 0, 0.6)'
		},
		purple: {
			main: '#9d4edd',
			dark: '#5a189a',
			bgGradStart: '#140224',
			bgGradEnd: '#290647',
			ovalStart: '#b877f0',
			ovalEnd: '#6e1fba',
			accent: '#debdff',
			glow: 'rgba(157, 78, 221, 0.6)'
		},
		wild: {
			main: '#ffffff',
			dark: '#1a1a24',
			bgGradStart: '#0d0d12',
			bgGradEnd: '#1a1a24',
			ovalStart: '#242433',
			ovalEnd: '#12121a',
			accent: '#ff007f',
			glow: 'rgba(255, 0, 127, 0.7)'
		},
		darkwild: {
			main: '#ffffff',
			dark: '#0a0a0f',
			bgGradStart: '#050508',
			bgGradEnd: '#111119',
			ovalStart: '#191924',
			ovalEnd: '#09090d',
			accent: '#9d4edd',
			glow: 'rgba(157, 78, 221, 0.7)'
		}
	};

	function escapeXml(unsafe) {
		return String(unsafe).replace(/[<>&'"]/g, function (c) {
			switch (c) {
				case '<': return '&lt;';
				case '>': return '&gt;';
				case '&': return '&amp;';
				case '\'': return '&apos;';
				case '"': return '&quot;';
			}
		});
	}

	function generateSVG(cardColor, cardType, cardValue) {
		var color = colorPalette[cardColor] || colorPalette.wild;
		var isWild = (cardColor === 'wild' || cardColor === 'darkwild' || !colorPalette[cardColor]);
		var idPrefix = 'svg_' + cardColor + '_' + cardType + '_' + (cardValue !== undefined ? cardValue : '');

		var defs = `
		<defs>
			<linearGradient id="${idPrefix}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="${color.bgGradStart}" />
				<stop offset="100%" stop-color="${color.bgGradEnd}" />
			</linearGradient>

			<linearGradient id="${idPrefix}_oval" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="${color.ovalStart}" />
				<stop offset="100%" stop-color="${color.ovalEnd}" />
			</linearGradient>

			<radialGradient id="${idPrefix}_wildbg" cx="50%" cy="50%" r="50%">
				<stop offset="0%" stop-color="#2c2c3d" />
				<stop offset="100%" stop-color="#0a0a0f" />
			</radialGradient>

			<linearGradient id="${idPrefix}_gold" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#fff59d" />
				<stop offset="50%" stop-color="#fbc02d" />
				<stop offset="100%" stop-color="#f57f17" />
			</linearGradient>

			<linearGradient id="${idPrefix}_flame" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#ff0055" />
				<stop offset="50%" stop-color="#ff5500" />
				<stop offset="100%" stop-color="#ffcc00" />
			</linearGradient>

			<filter id="${idPrefix}_glow" x="-20%" y="-20%" width="140%" height="140%">
				<feGaussianBlur stdDeviation="4" result="blur" />
				<feComposite in="SourceGraphic" in2="blur" operator="over" />
			</filter>

			<filter id="${idPrefix}_shadow" x="-10%" y="-10%" width="120%" height="120%">
				<feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.8" />
			</filter>
		</defs>
		`;

		var baseBorderColor = isWild ? '#ff007f' : color.main;
		var baseBgFill = `url(#${idPrefix}_bg)`;

		var cardBase = `
			<!-- Card Outer Shadow & Shape -->
			<rect x="2" y="2" width="196" height="296" rx="16" ry="16" fill="${baseBgFill}" stroke="${baseBorderColor}" stroke-width="3.5" />
			<rect x="7" y="7" width="186" height="286" rx="12" ry="12" fill="none" stroke="${isWild ? '#00e5ff' : '#ffffff'}" stroke-width="1.2" stroke-opacity="0.5" />
			<rect x="11" y="11" width="178" height="278" rx="9" ry="9" fill="none" stroke="${baseBorderColor}" stroke-width="1" stroke-opacity="0.3" />
		`;

		// Center angled oval / stadium
		var centerOval = '';
		if (isWild) {
			centerOval = `
				<ellipse cx="100" cy="150" rx="72" ry="105" transform="rotate(-28 100 150)" fill="url(#${idPrefix}_wildbg)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.3" filter="url(#${idPrefix}_shadow)" />
			`;
		} else {
			centerOval = `
				<ellipse cx="100" cy="150" rx="70" ry="105" transform="rotate(-28 100 150)" fill="url(#${idPrefix}_oval)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85" filter="url(#${idPrefix}_shadow)" />
			`;
		}

		// Corner pips & center artwork
		var cornerPip = '';
		var centerArtwork = '';

		if (cardType === 'flip') {
			cornerPip = renderCornerText('🌓', '#ffffff', 22);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<!-- Flip Orbiting Cycle Vector -->
					<g transform="translate(100, 136)">
						<path d="M -25 -25 A 36 36 0 0 1 25 -25 L 25 -38 L 45 -18 L 25 2 L 25 -12 A 22 22 0 0 0 -20 -12 Z" fill="#ffffff" />
						<path d="M 25 25 A 36 36 0 0 1 -25 25 L -25 38 L -45 18 L -25 -2 L -25 12 A 22 22 0 0 0 20 12 Z" fill="#ffffff" />
						<circle cx="0" cy="0" r="14" fill="${color.dark}" stroke="#ffffff" stroke-width="2" />
						<text x="0" y="5" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="#ffffff">FLIP</text>
					</g>
					<rect x="35" y="184" width="130" height="24" rx="6" fill="#ffffff" />
					<text x="100" y="201" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1.5">FLIP SIDE</text>
				</g>
			`;
		} else if (cardType === 'draw1') {
			cornerPip = renderCornerText('+1', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="82" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4">+1</text>
				</g>
			`;
		} else if (cardType === 'draw5') {
			cornerPip = renderCornerText('+5', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<circle cx="100" cy="140" r="54" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.6" filter="url(#${idPrefix}_glow)" />
					<text x="100" y="156" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="78" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">+5</text>
					<rect x="35" y="185" width="130" height="24" rx="6" fill="#ffffff" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1">DRAW 5</text>
				</g>
			`;
		} else if (cardType === 'wilddraw2') {
			cornerPip = renderCornerText('+2', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 125)">
						<path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff3344" />
						<path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#00a8ff" />
						<path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffea00" />
						<path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#00e676" />
					</g>
					<text x="100" y="185" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="52" text-anchor="middle" fill="#ffffff" stroke="#111" stroke-width="3">+2</text>
				</g>
			`;
		} else if (cardType === 'wilddrawcolor') {
			cornerPip = renderCornerText('🎨', '#ffffff', 22);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 130)">
						<!-- 4 Dark Side Quadrants: Pink, Teal, Orange, Purple -->
						<path d="M 0 0 L 0 -44 A 44 44 0 0 1 44 0 Z" fill="#ff2a85" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L 44 0 A 44 44 0 0 1 0 44 Z" fill="#00f0ff" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L 0 44 A 44 44 0 0 1 -44 0 Z" fill="#ff7700" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L -44 0 A 44 44 0 0 1 0 -44 Z" fill="#9d4edd" stroke="#ffffff" stroke-width="1.5" />
						<circle cx="0" cy="0" r="14" fill="#0c0c14" stroke="#ffffff" stroke-width="2" />
						<text x="0" y="4" font-family="'Arial Black', sans-serif" font-weight="900" font-size="9" text-anchor="middle" fill="#ffffff">COLOR</text>
					</g>
					<rect x="25" y="185" width="150" height="25" rx="6" fill="#111119" stroke="#9d4edd" stroke-width="1.5" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#00f0ff" letter-spacing="1">WILD DRAW COLOR</text>
				</g>
			`;
		} else if (cardType === 'wilddraw10') {
			cornerPip = renderCornerText('+10', '#ff3344', 22);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<circle cx="100" cy="135" r="58" fill="none" stroke="url(#${idPrefix}_flame)" stroke-width="5" opacity="0.9" filter="url(#${idPrefix}_glow)" />
					<text x="100" y="148" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="58" text-anchor="middle" fill="#ffffff" stroke="#d6001c" stroke-width="3" filter="url(#${idPrefix}_glow)">+10</text>
					<rect x="30" y="180" width="140" height="26" rx="6" fill="#d6001c" stroke="#ff8080" stroke-width="1.5" />
					<text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="#ffffff" letter-spacing="1.5">💥 NO MERCY</text>
				</g>
			`;
		} else if (cardType === 'wilddraw6') {
			cornerPip = renderCornerText('+6', '#ff9100', 23);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<circle cx="100" cy="135" r="54" fill="none" stroke="#ff9100" stroke-width="4.5" opacity="0.9" filter="url(#${idPrefix}_glow)" />
					<text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="70" text-anchor="middle" fill="#ffffff" stroke="#e65100" stroke-width="3" filter="url(#${idPrefix}_glow)">+6</text>
					<rect x="35" y="182" width="130" height="24" rx="6" fill="#e65100" stroke="#ffb74d" stroke-width="1.5" />
					<text x="100" y="199" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="#ffffff" letter-spacing="1.5">DRAW 6</text>
				</g>
			`;
		} else if (cardType === 'wildreversdraw4') {
			cornerPip = renderCornerText('⇄4', '#d500f9', 19);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<path d="M 60 115 A 35 35 0 0 1 140 115 L 140 102 L 158 122 L 140 142 L 140 128 A 22 22 0 0 0 75 128 Z" fill="#d500f9" stroke="#ffffff" stroke-width="1.5" />
					<path d="M 140 165 A 35 35 0 0 1 60 165 L 60 178 L 42 158 L 60 138 L 60 152 A 22 22 0 0 0 125 152 Z" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="40" text-anchor="middle" fill="#ffffff" stroke="#aa00ff" stroke-width="2.5">+4</text>
					<rect x="30" y="185" width="140" height="22" rx="5" fill="#4a148c" stroke="#ea80fc" stroke-width="1" />
					<text x="100" y="201" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffffff" letter-spacing="1">REV DRAW 4</text>
				</g>
			`;
		} else if (cardType === 'wildcolorroulette') {
			cornerPip = renderCornerText('🎰', '#ffea00', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 135)">
						<path d="M 0 0 L 0 -45 A 45 45 0 0 1 45 0 Z" fill="#ff3344" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L 45 0 A 45 45 0 0 1 0 45 Z" fill="#ffea00" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L 0 45 A 45 45 0 0 1 -45 0 Z" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
						<path d="M 0 0 L -45 0 A 45 45 0 0 1 0 -45 Z" fill="#00a8ff" stroke="#ffffff" stroke-width="1.5" />
						<circle cx="0" cy="0" r="14" fill="url(#${idPrefix}_gold)" stroke="#222" stroke-width="2" />
						<circle cx="0" cy="0" r="5" fill="#ffffff" />
					</g>
					<rect x="25" y="190" width="150" height="24" rx="6" fill="#212121" stroke="#fbc02d" stroke-width="1.5" />
					<text x="100" y="207" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffee58" letter-spacing="1">🎰 COLOR ROULETTE</text>
				</g>
			`;
		} else if (cardType === 'wild' || cardType === 'darkwild') {
			cornerPip = renderCornerText('★', '#ffffff', 22);
			var isDark = (cardType === 'darkwild');
			var c1 = isDark ? '#ff2a85' : '#ff3344';
			var c2 = isDark ? '#00f0ff' : '#00a8ff';
			var c3 = isDark ? '#ff7700' : '#ffea00';
			var c4 = isDark ? '#9d4edd' : '#00e676';
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 142)">
						<path d="M 0 0 L 0 -42 A 42 42 0 0 1 42 0 Z" fill="${c1}" />
						<path d="M 0 0 L 42 0 A 42 42 0 0 1 0 42 Z" fill="${c2}" />
						<path d="M 0 0 L 0 42 A 42 42 0 0 1 -42 0 Z" fill="${c3}" />
						<path d="M 0 0 L -42 0 A 42 42 0 0 1 0 -42 Z" fill="${c4}" />
						<circle cx="0" cy="0" r="18" fill="#111118" stroke="#ffffff" stroke-width="2" />
						<text x="0" y="4" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10" text-anchor="middle" fill="#ffffff">WILD</text>
					</g>
				</g>
			`;
		} else if (cardType === 'draw4') {
			cornerPip = renderCornerText('+4', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="78" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4">+4</text>
				</g>
			`;
		} else if (cardType === 'draw2') {
			cornerPip = renderCornerText('+2', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4">+2</text>
				</g>
			`;
		} else if (cardType === 'skipeveryone' || cardType === 'darkskipeveryone') {
			cornerPip = renderCornerText('⊘⊘', '#ffffff', 18);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(76, 125)">
						<circle cx="0" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="5" />
						<line x1="-15" y1="-15" x2="15" y2="15" stroke="#ffffff" stroke-width="5" />
					</g>
					<g transform="translate(124, 125)">
						<circle cx="0" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="5" />
						<line x1="-15" y1="-15" x2="15" y2="15" stroke="#ffffff" stroke-width="5" />
					</g>
					<rect x="35" y="162" width="130" height="24" rx="6" fill="#ffffff" />
					<text x="100" y="179" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1">SKIP ALL</text>
				</g>
			`;
		} else if (cardType === 'discardall') {
			cornerPip = renderCornerText('⬇', '#ffffff', 22);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 118)">
						<rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(-20)" />
						<rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" opacity="0.75" transform="rotate(20)" />
						<rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
						<path d="M 0 -8 L 0 8 M -6 2 L 0 8 L 6 2" stroke="${color.dark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
					</g>
					<rect x="25" y="156" width="150" height="28" rx="6" fill="#ffffff" />
					<text x="100" y="175" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12.5" text-anchor="middle" fill="${color.dark}" letter-spacing="1">DISCARD ALL</text>
				</g>
			`;
		} else if (cardType === 'skip') {
			cornerPip = renderCornerText('⊘', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)" transform="translate(100, 150)">
					<circle cx="0" cy="0" r="42" fill="none" stroke="#ffffff" stroke-width="9" />
					<line x1="-30" y1="-30" x2="30" y2="30" stroke="#ffffff" stroke-width="9" />
				</g>
			`;
		} else if (cardType === 'reverse') {
			cornerPip = renderCornerText('⇄', '#ffffff', 24);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<path d="M 65 125 A 35 35 0 0 1 135 125 L 135 110 L 155 132 L 135 154 L 135 139 A 21 21 0 0 0 79 139 Z" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
					<path d="M 135 175 A 35 35 0 0 1 65 175 L 65 190 L 45 168 L 65 146 L 65 161 A 21 21 0 0 0 121 161 Z" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
				</g>
			`;
		} else if (cardType === 'flexnumber') {
			var numStr = String(cardValue !== undefined ? cardValue : 0);
			cornerPip = renderCornerText(numStr, '#ffffff', 25);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<!-- Flex Diagonal Accent Ribbon -->
					<path d="M 140 20 L 180 20 L 180 60 Z" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
					<text x="166" y="38" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311">⚡</text>
					<text x="100" y="166" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="94" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">${numStr}</text>
					<rect x="35" y="186" width="130" height="22" rx="5" fill="#00e676" stroke="#ffffff" stroke-width="1" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">⚡ FLEX CARD</text>
				</g>
			`;
		} else if (cardType === 'flexdraw2') {
			cornerPip = renderCornerText('+2⚡', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="74" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4">+2</text>
					<rect x="25" y="182" width="150" height="26" rx="6" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="200" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">FLEX: +1 ALL</text>
				</g>
			`;
		} else if (cardType === 'flexskip') {
			cornerPip = renderCornerText('⊘⚡', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 125)">
						<circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" stroke-width="6" />
						<line x1="-20" y1="-20" x2="20" y2="20" stroke="#ffffff" stroke-width="6" />
					</g>
					<rect x="25" y="178" width="150" height="26" rx="6" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="196" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">FLEX: SKIP ALL</text>
				</g>
			`;
		} else if (cardType === 'flexdraw4') {
			cornerPip = renderCornerText('+4⚡', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 118)">
						<path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff3344" />
						<path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#00a8ff" />
						<path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffea00" />
						<path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#00e676" />
					</g>
					<text x="100" y="170" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="44" text-anchor="middle" fill="#ffffff" stroke="#000" stroke-width="3">+4</text>
					<rect x="20" y="184" width="160" height="26" rx="6" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#003311" letter-spacing="1">FLEX: TARGET DRAW 4</text>
				</g>
			`;
		} else if (cardType === 'flexwildalldraw') {
			cornerPip = renderCornerText('★⚡', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 118)">
						<path d="M 0 0 L 0 -38 A 38 38 0 0 1 38 0 Z" fill="#ff3344" />
						<path d="M 0 0 L 38 0 A 38 38 0 0 1 0 38 Z" fill="#00a8ff" />
						<path d="M 0 0 L 0 38 A 38 38 0 0 1 -38 0 Z" fill="#ffea00" />
						<path d="M 0 0 L -38 0 A 38 38 0 0 1 0 -38 Z" fill="#00e676" />
					</g>
					<rect x="18" y="175" width="164" height="28" rx="6" fill="#00e676" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="194" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10" text-anchor="middle" fill="#003311" letter-spacing="0.5">FLEX: ALL DRAW 2</text>
				</g>
			`;
		} else if (cardType === 'hit2') {
			cornerPip = renderCornerText('HIT 2', '#ffffff', 18);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<rect x="35" y="70" width="130" height="90" rx="15" fill="#1e272e" stroke="#ffffff" stroke-width="3" />
					<text x="100" y="125" font-family="'Arial Black', sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="#ff3344">HIT 2</text>
					<text x="100" y="150" font-family="'Arial Black', sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="#ffffff">🚀 PRESS x2</text>
					<rect x="25" y="180" width="150" height="26" rx="6" fill="#ffffff" />
					<text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="${color.dark}" letter-spacing="1">ATTACK LAUNCHER</text>
				</g>
			`;
		} else if (cardType === 'wildattack') {
			cornerPip = renderCornerText('★🚀', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 115)">
						<path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff3344" />
						<path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#00a8ff" />
						<path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffea00" />
						<path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#00e676" />
					</g>
					<rect x="15" y="172" width="170" height="30" rx="6" fill="#ff3344" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="192" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">WILD ATTACK-ATTACK</text>
				</g>
			`;
		} else if (cardType === 'wildswap') {
			cornerPip = renderCornerText('★🔀', '#ffffff', 20);
			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<g transform="translate(100, 115)">
						<path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff3344" />
						<path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#00a8ff" />
						<path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffea00" />
						<path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#00e676" />
					</g>
					<rect x="20" y="172" width="160" height="30" rx="6" fill="#6c5ce7" stroke="#ffffff" stroke-width="1.5" />
					<text x="100" y="192" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">WILD FORCED SWAP</text>
				</g>
			`;
		} else if (cardType === 'number') {
			var numStr = String(cardValue !== undefined ? cardValue : 0);
			cornerPip = renderCornerText(numStr, '#ffffff', 25);
			var subBadge = '';
			if (cardValue === 7) {
				subBadge = `
					<rect x="42" y="186" width="116" height="22" rx="5" fill="#ffffff" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="${color.dark}" letter-spacing="1">🔀 7-SWAP</text>
				`;
			} else if (cardValue === 0) {
				subBadge = `
					<rect x="42" y="186" width="116" height="22" rx="5" fill="#ffffff" />
					<text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="${color.dark}" letter-spacing="1">🔁 0-PASS</text>
				`;
			}

			centerArtwork = `
				<g filter="url(#${idPrefix}_shadow)">
					<text x="100" y="166" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="94" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">${numStr}</text>
					${subBadge}
				</g>
			`;
		}

		return `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
			${defs}
			${cardBase}
			${centerOval}
			${cornerPip}
			${centerArtwork}
		</svg>
		`.trim();
	}

	function renderCornerText(text, color, fontSize) {
		var escaped = escapeXml(text);
		return `
			<!-- Top-Left Corner Pip -->
			<text x="14" y="32" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="left" fill="${color}" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.8))">${escaped}</text>
			<!-- Bottom-Right Corner Pip (Rotated 180) -->
			<g transform="translate(186, 268) rotate(180)">
				<text x="0" y="0" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="left" fill="${color}" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.8))">${escaped}</text>
			</g>
		`;
	}

	function getSVGString(cardColor, cardType, cardValue) {
		var key = cardColor + '_' + cardType + '_' + (cardValue !== undefined ? cardValue : '');
		if (!svgCache[key]) {
			svgCache[key] = generateSVG(cardColor, cardType, cardValue);
		}
		return svgCache[key];
	}

	function getSVGDataURL(cardColor, cardType, cardValue) {
		var svgStr = getSVGString(cardColor, cardType, cardValue);
		return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
	}

	return {
		generateSVG: generateSVG,
		getSVGString: getSVGString,
		getSVGDataURL: getSVGDataURL,
		colorPalette: colorPalette
	};
})();

if (typeof window !== 'undefined') {
	window.SVGCards = SVGCards;
}
