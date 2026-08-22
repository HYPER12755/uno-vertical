import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgOutputDir = path.join(__dirname, '../assets/svg');

if (!fs.existsSync(svgOutputDir)) {
  fs.mkdirSync(svgOutputDir, { recursive: true });
}

const colorPalette = {
  red: {
    main: '#ff2d55',
    dark: '#b30024',
    light: '#ff6b8b',
    bgGradStart: '#26040a',
    bgGradEnd: '#420812',
    ovalStart: '#ff4d6d',
    ovalEnd: '#c9002b',
    accent: '#ffccd5',
    glow: 'rgba(255, 45, 85, 0.7)'
  },
  blue: {
    main: '#007aff',
    dark: '#004db3',
    light: '#4da3ff',
    bgGradStart: '#021326',
    bgGradEnd: '#06264d',
    ovalStart: '#3395ff',
    ovalEnd: '#0055cc',
    accent: '#cce4ff',
    glow: 'rgba(0, 122, 255, 0.7)'
  },
  green: {
    main: '#34c759',
    dark: '#1e8238',
    light: '#6ddb89',
    bgGradStart: '#041f0c',
    bgGradEnd: '#093d18',
    ovalStart: '#4cd964',
    ovalEnd: '#1b9438',
    accent: '#d4f5dc',
    glow: 'rgba(52, 199, 89, 0.7)'
  },
  yellow: {
    main: '#ffcc00',
    dark: '#b38f00',
    light: '#ffdc4d',
    bgGradStart: '#261f00',
    bgGradEnd: '#4d3e00',
    ovalStart: '#ffd633',
    ovalEnd: '#cc9900',
    accent: '#fff5cc',
    glow: 'rgba(255, 204, 0, 0.7)'
  },
  pink: {
    main: '#ff2a85',
    dark: '#990045',
    light: '#ff70a6',
    bgGradStart: '#290315',
    bgGradEnd: '#4d0528',
    ovalStart: '#ff5c9f',
    ovalEnd: '#c4005b',
    accent: '#ffcce1',
    glow: 'rgba(255, 42, 133, 0.7)'
  },
  teal: {
    main: '#00f0ff',
    dark: '#008b99',
    light: '#66f6ff',
    bgGradStart: '#011e21',
    bgGradEnd: '#033a40',
    ovalStart: '#33f3ff',
    ovalEnd: '#009cb0',
    accent: '#ccfcff',
    glow: 'rgba(0, 240, 255, 0.7)'
  },
  orange: {
    main: '#ff6b00',
    dark: '#b34700',
    light: '#ff994d',
    bgGradStart: '#261000',
    bgGradEnd: '#4d2000',
    ovalStart: '#ff8533',
    ovalEnd: '#cc5200',
    accent: '#ffe1cc',
    glow: 'rgba(255, 107, 0, 0.7)'
  },
  purple: {
    main: '#9d4edd',
    dark: '#5a189a',
    light: '#c77dff',
    bgGradStart: '#180429',
    bgGradEnd: '#330954',
    ovalStart: '#b066f0',
    ovalEnd: '#6e1fba',
    accent: '#ebccff',
    glow: 'rgba(157, 78, 221, 0.7)'
  },
  wild: {
    main: '#ffffff',
    dark: '#111119',
    light: '#ffffff',
    bgGradStart: '#0a0a12',
    bgGradEnd: '#1a1a26',
    ovalStart: '#222233',
    ovalEnd: '#101018',
    accent: '#ff007f',
    glow: 'rgba(255, 0, 127, 0.7)'
  },
  darkwild: {
    main: '#ffffff',
    dark: '#06060a',
    light: '#ffffff',
    bgGradStart: '#040408',
    bgGradEnd: '#0f0f18',
    ovalStart: '#181826',
    ovalEnd: '#08080e',
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

function sanitizeId(str) {
  return String(str).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function renderCornerText(text, color, fontSize) {
  const escaped = escapeXml(text);
  return `
    <!-- Top-Left Corner Pip -->
    <text x="14" y="32" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="left" fill="${color}" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.85))">${escaped}</text>
    <!-- Bottom-Right Corner Pip (Rotated 180) -->
    <g transform="translate(186, 268) rotate(180)">
      <text x="0" y="0" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="${fontSize}" text-anchor="left" fill="${color}" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.85))">${escaped}</text>
    </g>
  `;
}

function generateSVG(cardColor, cardType, cardValue) {
  const normColor = (cardColor && colorPalette[cardColor]) ? cardColor : 'wild';
  const color = colorPalette[normColor] || colorPalette.wild;
  const isWild = (normColor === 'wild' || normColor === 'darkwild' || !cardColor);
  const type = String(cardType || 'number').toLowerCase();
  const val = cardValue !== undefined ? cardValue : '';
  const idPrefix = sanitizeId('svg_' + normColor + '_' + type + '_' + val);

  const defs = `
  <defs>
    <linearGradient id="${idPrefix}_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color.bgGradStart}" />
      <stop offset="50%" stop-color="${color.bgGradEnd}" />
      <stop offset="100%" stop-color="${color.bgGradStart}" />
    </linearGradient>

    <linearGradient id="${idPrefix}_oval" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color.ovalStart}" />
      <stop offset="100%" stop-color="${color.ovalEnd}" />
    </linearGradient>

    <radialGradient id="${idPrefix}_wildbg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2e2e42" />
      <stop offset="100%" stop-color="#0a0a10" />
    </radialGradient>

    <linearGradient id="${idPrefix}_gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff9c4" />
      <stop offset="50%" stop-color="#fbc02d" />
      <stop offset="100%" stop-color="#f57f17" />
    </linearGradient>

    <linearGradient id="${idPrefix}_flame" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff0055" />
      <stop offset="50%" stop-color="#ff6600" />
      <stop offset="100%" stop-color="#ffcc00" />
    </linearGradient>

    <linearGradient id="${idPrefix}_ice" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f7fa" />
      <stop offset="50%" stop-color="#80deea" />
      <stop offset="100%" stop-color="#00acc1" />
    </linearGradient>

    <filter id="${idPrefix}_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="${idPrefix}_shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>
  `;

  const baseBorderColor = isWild ? '#ff007f' : color.main;
  const baseBgFill = `url(#${idPrefix}_bg)`;

  const cardBase = `
    <!-- Card Outer Boundary & Frame -->
    <rect x="2" y="2" width="196" height="296" rx="16" ry="16" fill="${baseBgFill}" stroke="${baseBorderColor}" stroke-width="3.5" />
    <rect x="7" y="7" width="186" height="286" rx="12" ry="12" fill="none" stroke="${isWild ? '#00f0ff' : '#ffffff'}" stroke-width="1.2" stroke-opacity="0.4" />
    <rect x="11" y="11" width="178" height="278" rx="9" ry="9" fill="none" stroke="${baseBorderColor}" stroke-width="1" stroke-opacity="0.25" />
  `;

  let centerOval = '';
  if (isWild) {
    centerOval = `
      <ellipse cx="100" cy="150" rx="72" ry="105" transform="rotate(-28 100 150)" fill="url(#${idPrefix}_wildbg)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.35" filter="url(#${idPrefix}_shadow)" />
    `;
  } else {
    centerOval = `
      <ellipse cx="100" cy="150" rx="70" ry="105" transform="rotate(-28 100 150)" fill="url(#${idPrefix}_oval)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.9" filter="url(#${idPrefix}_shadow)" />
    `;
  }

  let cornerPip = '';
  let centerArtwork = '';

  // 1. Number Cards (0 - 9)
  if (type === 'number' || (!isNaN(Number(type)) && type.trim() !== '')) {
    const numVal = (val !== '' && val !== undefined) ? val : type;
    const numStr = String(numVal);
    cornerPip = renderCornerText(numStr, '#ffffff', 25);

    let subBadge = '';
    if (String(numVal) === '7') {
      subBadge = `
        <rect x="38" y="186" width="124" height="22" rx="5" fill="#ffffff" filter="url(#${idPrefix}_shadow)" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="${color.dark}" letter-spacing="0.5">🔀 7-SWAP HANDS</text>
      `;
    } else if (String(numVal) === '0') {
      subBadge = `
        <rect x="38" y="186" width="124" height="22" rx="5" fill="#ffffff" filter="url(#${idPrefix}_shadow)" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="${color.dark}" letter-spacing="0.5">🔁 0-PASS ALL</text>
      `;
    }

    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="168" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="96" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">${numStr}</text>
        ${subBadge}
      </g>
    `;
  }
  // 2. Action: Draw 2 / +2
  else if (type === 'draw2' || type === 'draw') {
    cornerPip = renderCornerText('+2', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="82" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">+2</text>
      </g>
    `;
  }
  // 3. Action: Draw 4
  else if (type === 'draw4') {
    cornerPip = renderCornerText('+4', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">+4</text>
      </g>
    `;
  }
  // 4. Action: Draw 1 (Flip Light)
  else if (type === 'draw1') {
    cornerPip = renderCornerText('+1', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="162" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="84" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">+1</text>
      </g>
    `;
  }
  // 5. Action: Draw 5 (Flip Dark)
  else if (type === 'draw5') {
    cornerPip = renderCornerText('+5', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <circle cx="100" cy="138" r="52" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.6" filter="url(#${idPrefix}_glow)" />
        <text x="100" y="156" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="78" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">+5</text>
        <rect x="35" y="185" width="130" height="24" rx="6" fill="#ffffff" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1">DRAW 5</text>
      </g>
    `;
  }
  // 6. Action: Skip (⊘)
  else if (type === 'skip') {
    cornerPip = renderCornerText('⊘', '#ffffff', 25);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)" transform="translate(100, 150)">
        <circle cx="0" cy="0" r="42" fill="none" stroke="#ffffff" stroke-width="9" />
        <line x1="-30" y1="-30" x2="30" y2="30" stroke="#ffffff" stroke-width="9" />
      </g>
    `;
  }
  // 7. Action: Reverse (⇄)
  else if (type === 'reverse') {
    cornerPip = renderCornerText('⇄', '#ffffff', 25);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <path d="M 65 125 A 35 35 0 0 1 135 125 L 135 110 L 155 132 L 135 154 L 135 139 A 21 21 0 0 0 79 139 Z" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
        <path d="M 135 175 A 35 35 0 0 1 65 175 L 65 190 L 45 168 L 65 146 L 65 161 A 21 21 0 0 0 121 161 Z" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
      </g>
    `;
  }
  // 8. Action: Discard All
  else if (type === 'discardall') {
    cornerPip = renderCornerText('⬇', '#ffffff', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 118)">
          <rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" opacity="0.5" transform="rotate(-20)" />
          <rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" opacity="0.75" transform="rotate(20)" />
          <rect x="-14" y="-22" width="28" height="40" rx="3" fill="#ffffff" stroke="${color.dark}" stroke-width="1.5" />
          <path d="M 0 -8 L 0 8 M -6 2 L 0 8 L 6 2" stroke="${color.dark}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <rect x="25" y="158" width="150" height="28" rx="6" fill="#ffffff" />
        <text x="100" y="177" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1">DISCARD ALL</text>
      </g>
    `;
  }
  // 9. Action: Skip Everyone
  else if (type === 'skipeveryone' || type === 'darkskipeveryone' || type === 'wildskipeveryone') {
    cornerPip = renderCornerText('⊘⊘', '#ffffff', 19);
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
        <rect x="30" y="162" width="140" height="25" rx="6" fill="#ffffff" />
        <text x="100" y="179" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="${color.dark}" letter-spacing="1">SKIP EVERYONE</text>
      </g>
    `;
  }
  // 10. Action: Flip
  else if (type === 'flip') {
    cornerPip = renderCornerText('🌓', '#ffffff', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
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
  }
  // 11. Wild Cards
  else if (type === 'wild' || type === 'darkwild') {
    cornerPip = renderCornerText('★', '#ffffff', 24);
    const isDark = (type === 'darkwild');
    const c1 = isDark ? '#ff2a85' : '#ff2d55';
    const c2 = isDark ? '#00f0ff' : '#007aff';
    const c3 = isDark ? '#ff6b00' : '#ffcc00';
    const c4 = isDark ? '#9d4edd' : '#34c759';
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 142)">
          <path d="M 0 0 L 0 -44 A 44 44 0 0 1 44 0 Z" fill="${c1}" />
          <path d="M 0 0 L 44 0 A 44 44 0 0 1 0 44 Z" fill="${c2}" />
          <path d="M 0 0 L 0 44 A 44 44 0 0 1 -44 0 Z" fill="${c3}" />
          <path d="M 0 0 L -44 0 A 44 44 0 0 1 0 -44 Z" fill="${c4}" />
          <circle cx="0" cy="0" r="18" fill="#111118" stroke="#ffffff" stroke-width="2" />
          <text x="0" y="4" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffffff">WILD</text>
        </g>
      </g>
    `;
  } else if (type === 'wilddraw4' || type === 'wilddraw') {
    cornerPip = renderCornerText('+4', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 118)">
          <path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#007aff" />
          <path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#34c759" />
        </g>
        <text x="100" y="174" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="52" text-anchor="middle" fill="#ffffff" stroke="#111" stroke-width="3.5">+4</text>
      </g>
    `;
  } else if (type === 'wilddraw2') {
    cornerPip = renderCornerText('+2', '#ffffff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 122)">
          <path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#007aff" />
          <path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#34c759" />
        </g>
        <text x="100" y="178" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="52" text-anchor="middle" fill="#ffffff" stroke="#111" stroke-width="3.5">+2</text>
      </g>
    `;
  } else if (type === 'wilddraw10') {
    cornerPip = renderCornerText('+10', '#ff3344', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <circle cx="100" cy="135" r="58" fill="none" stroke="url(#${idPrefix}_flame)" stroke-width="5" opacity="0.95" filter="url(#${idPrefix}_glow)" />
        <text x="100" y="148" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="58" text-anchor="middle" fill="#ffffff" stroke="#d6001c" stroke-width="3" filter="url(#${idPrefix}_glow)">+10</text>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#d6001c" stroke="#ff8080" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="#ffffff" letter-spacing="1.5">💥 NO MERCY</text>
      </g>
    `;
  } else if (type === 'wilddraw6') {
    cornerPip = renderCornerText('+6', '#ff9100', 23);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <circle cx="100" cy="135" r="54" fill="none" stroke="#ff9100" stroke-width="4.5" opacity="0.95" filter="url(#${idPrefix}_glow)" />
        <text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="70" text-anchor="middle" fill="#ffffff" stroke="#e65100" stroke-width="3" filter="url(#${idPrefix}_glow)">+6</text>
        <rect x="35" y="182" width="130" height="24" rx="6" fill="#e65100" stroke="#ffb74d" stroke-width="1.5" />
        <text x="100" y="199" font-family="'Arial Black', sans-serif" font-weight="900" font-size="12" text-anchor="middle" fill="#ffffff" letter-spacing="1.5">DRAW 6</text>
      </g>
    `;
  } else if (type === 'wildreversdraw4') {
    cornerPip = renderCornerText('⇄4', '#d500f9', 19);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <path d="M 60 115 A 35 35 0 0 1 140 115 L 140 102 L 158 122 L 140 142 L 140 128 A 22 22 0 0 0 75 128 Z" fill="#d500f9" stroke="#ffffff" stroke-width="1.5" />
        <path d="M 140 165 A 35 35 0 0 1 60 165 L 60 178 L 42 158 L 60 138 L 60 152 A 22 22 0 0 0 125 152 Z" fill="#00e5ff" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="40" text-anchor="middle" fill="#ffffff" stroke="#aa00ff" stroke-width="2.5">+4</text>
        <rect x="25" y="185" width="150" height="24" rx="6" fill="#4a148c" stroke="#ea80fc" stroke-width="1.2" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">REV DRAW 4</text>
      </g>
    `;
  } else if (type === 'wildcolorroulette') {
    cornerPip = renderCornerText('🎰', '#ffea00', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 135)">
          <path d="M 0 0 L 0 -45 A 45 45 0 0 1 45 0 Z" fill="#ff2d55" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L 45 0 A 45 45 0 0 1 0 45 Z" fill="#ffcc00" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L 0 45 A 45 45 0 0 1 -45 0 Z" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L -45 0 A 45 45 0 0 1 0 -45 Z" fill="#007aff" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="0" cy="0" r="14" fill="url(#${idPrefix}_gold)" stroke="#222" stroke-width="2" />
          <circle cx="0" cy="0" r="5" fill="#ffffff" />
        </g>
        <rect x="22" y="190" width="156" height="24" rx="6" fill="#212121" stroke="#fbc02d" stroke-width="1.5" />
        <text x="100" y="207" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffee58" letter-spacing="0.5">🎰 COLOR ROULETTE</text>
      </g>
    `;
  } else if (type === 'wilddrawcolor') {
    cornerPip = renderCornerText('🎨', '#ffffff', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 130)">
          <path d="M 0 0 L 0 -44 A 44 44 0 0 1 44 0 Z" fill="#ff2a85" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L 44 0 A 44 44 0 0 1 0 44 Z" fill="#00f0ff" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L 0 44 A 44 44 0 0 1 -44 0 Z" fill="#ff6b00" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 0 0 L -44 0 A 44 44 0 0 1 0 -44 Z" fill="#9d4edd" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="0" cy="0" r="14" fill="#0c0c14" stroke="#ffffff" stroke-width="2" />
          <text x="0" y="4" font-family="'Arial Black', sans-serif" font-weight="900" font-size="9" text-anchor="middle" fill="#ffffff">COLOR</text>
        </g>
        <rect x="22" y="185" width="156" height="25" rx="6" fill="#111119" stroke="#9d4edd" stroke-width="1.5" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#00f0ff" letter-spacing="0.5">WILD DRAW COLOR</text>
      </g>
    `;
  } else if (type === 'wildattack') {
    cornerPip = renderCornerText('★🚀', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 115)">
          <path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#007aff" />
          <path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#34c759" />
        </g>
        <rect x="15" y="172" width="170" height="30" rx="6" fill="#ff2d55" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="192" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">WILD ATTACK-ATTACK</text>
      </g>
    `;
  } else if (type === 'wildswap') {
    cornerPip = renderCornerText('★🔀', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 115)">
          <path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#007aff" />
          <path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#34c759" />
        </g>
        <rect x="20" y="172" width="160" height="30" rx="6" fill="#6c5ce7" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="192" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">WILD FORCED SWAP</text>
      </g>
    `;
  } else if (type === 'wildreverse') {
    cornerPip = renderCornerText('★⇄', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <path d="M 65 125 A 35 35 0 0 1 135 125 L 135 110 L 155 132 L 135 154 L 135 139 A 21 21 0 0 0 79 139 Z" fill="#ff2d55" stroke="#ffffff" stroke-width="1.5" />
        <path d="M 135 175 A 35 35 0 0 1 65 175 L 65 190 L 45 168 L 65 146 L 65 161 A 21 21 0 0 0 121 161 Z" fill="#007aff" stroke="#ffffff" stroke-width="1.5" />
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#111119" stroke="#ffffff" stroke-width="1" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">WILD REVERSE</text>
      </g>
    `;
  } else if (type === 'wildskip') {
    cornerPip = renderCornerText('★⊘', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)" transform="translate(100, 130)">
        <circle cx="0" cy="0" r="36" fill="none" stroke="#ffffff" stroke-width="7" />
        <line x1="-25" y1="-25" x2="25" y2="25" stroke="#ffffff" stroke-width="7" />
      </g>
      <rect x="25" y="180" width="150" height="26" rx="6" fill="#111119" stroke="#ffffff" stroke-width="1" />
      <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">WILD SKIP</text>
    `;
  } else if (type === 'wildtargeteddraw2' || type === 'targeteddraw2' || type === 'targeteddraw4') {
    const drawAmt = type === 'targeteddraw4' ? '+4' : '+2';
    cornerPip = renderCornerText('🎯' + drawAmt, '#ffffff', 19);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="34" fill="none" stroke="#ff2d55" stroke-width="3" />
          <circle cx="0" cy="0" r="22" fill="none" stroke="#ffffff" stroke-width="2.5" />
          <circle cx="0" cy="0" r="8" fill="#ff2d55" />
          <line x1="-42" y1="0" x2="42" y2="0" stroke="#ff2d55" stroke-width="2.5" />
          <line x1="0" y1="-42" x2="0" y2="42" stroke="#ff2d55" stroke-width="2.5" />
        </g>
        <text x="100" y="175" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="38" text-anchor="middle" fill="#ffffff" stroke="#111" stroke-width="2.5">${drawAmt}</text>
        <rect x="20" y="185" width="160" height="24" rx="5" fill="#ff2d55" stroke="#ffffff" stroke-width="1" />
        <text x="100" y="201" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">TARGETED DRAW</text>
      </g>
    `;
  } else if (type === 'hit2') {
    cornerPip = renderCornerText('HIT 2', '#ffffff', 18);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <rect x="35" y="70" width="130" height="90" rx="15" fill="#1e272e" stroke="#ffffff" stroke-width="3" />
        <text x="100" y="125" font-family="'Arial Black', sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="#ff2d55">HIT 2</text>
        <text x="100" y="150" font-family="'Arial Black', sans-serif" font-weight="900" font-size="14" text-anchor="middle" fill="#ffffff">🚀 PRESS x2</text>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#ffffff" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="${color.dark}" letter-spacing="1">ATTACK LAUNCHER</text>
      </g>
    `;
  }
  // 12. Flex Cards
  else if (type === 'flexnumber') {
    const numStr = String(val !== undefined ? val : 0);
    cornerPip = renderCornerText(numStr, '#ffffff', 25);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <path d="M 140 20 L 180 20 L 180 60 Z" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
        <text x="166" y="38" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311">⚡</text>
        <text x="100" y="166" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="94" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4.5">${numStr}</text>
        <rect x="35" y="186" width="130" height="22" rx="5" fill="#34c759" stroke="#ffffff" stroke-width="1" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">⚡ FLEX CARD</text>
      </g>
    `;
  } else if (type === 'flexdraw2') {
    cornerPip = renderCornerText('+2⚡', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="152" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="74" text-anchor="middle" fill="#ffffff" stroke="${color.dark}" stroke-width="4">+2</text>
        <rect x="25" y="182" width="150" height="26" rx="6" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="200" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">FLEX: +1 ALL</text>
      </g>
    `;
  } else if (type === 'flexskip') {
    cornerPip = renderCornerText('⊘⚡', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" stroke-width="6" />
          <line x1="-20" y1="-20" x2="20" y2="20" stroke="#ffffff" stroke-width="6" />
        </g>
        <rect x="25" y="178" width="150" height="26" rx="6" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="196" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#003311" letter-spacing="1">FLEX: SKIP ALL</text>
      </g>
    `;
  } else if (type === 'flexdraw4') {
    cornerPip = renderCornerText('+4⚡', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 118)">
          <path d="M 0 0 L 0 -36 A 36 36 0 0 1 36 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 36 0 A 36 36 0 0 1 0 36 Z" fill="#007aff" />
          <path d="M 0 0 L 0 36 A 36 36 0 0 1 -36 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -36 0 A 36 36 0 0 1 0 -36 Z" fill="#34c759" />
        </g>
        <text x="100" y="170" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="44" text-anchor="middle" fill="#ffffff" stroke="#000" stroke-width="3">+4</text>
        <rect x="20" y="184" width="160" height="26" rx="6" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="202" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#003311" letter-spacing="0.5">FLEX: TARGET DRAW 4</text>
      </g>
    `;
  } else if (type === 'flexwildalldraw') {
    cornerPip = renderCornerText('★⚡', '#ffffff', 20);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 118)">
          <path d="M 0 0 L 0 -38 A 38 38 0 0 1 38 0 Z" fill="#ff2d55" />
          <path d="M 0 0 L 38 0 A 38 38 0 0 1 0 38 Z" fill="#007aff" />
          <path d="M 0 0 L 0 38 A 38 38 0 0 1 -38 0 Z" fill="#ffcc00" />
          <path d="M 0 0 L -38 0 A 38 38 0 0 1 0 -38 Z" fill="#34c759" />
        </g>
        <rect x="18" y="175" width="164" height="28" rx="6" fill="#34c759" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="194" font-family="'Arial Black', sans-serif" font-weight="900" font-size="10.5" text-anchor="middle" fill="#003311" letter-spacing="0.5">FLEX: ALL DRAW 2</text>
      </g>
    `;
  }
  // 13. Special Power Cards
  else if (type === 'truesight') {
    cornerPip = renderCornerText('👁', '#00f0ff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 130)">
          <path d="M -50 0 Q 0 -35 50 0 Q 0 35 -50 0 Z" fill="#051923" stroke="#00f0ff" stroke-width="3" />
          <circle cx="0" cy="0" r="18" fill="#00a8ff" stroke="#ffffff" stroke-width="2" />
          <circle cx="0" cy="0" r="8" fill="#000814" />
          <circle cx="-3" cy="-3" r="3" fill="#ffffff" />
        </g>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#003566" stroke="#00f0ff" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#00f0ff" letter-spacing="1">TRUE SIGHT 👁</text>
      </g>
    `;
  } else if (type === 'oneforme') {
    cornerPip = renderCornerText('+1 ME', '#ffcc00', 18);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <rect x="-24" y="-32" width="48" height="64" rx="6" fill="url(#${idPrefix}_gold)" stroke="#ffffff" stroke-width="2" />
          <text x="0" y="12" font-family="'Arial Black', sans-serif" font-weight="900" font-size="32" text-anchor="middle" fill="#111">+1</text>
        </g>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#f57f17" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">ONE FOR ME</text>
      </g>
    `;
  } else if (type === 'devildeal') {
    cornerPip = renderCornerText('😈', '#ff2d55', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <path d="M -30 -25 Q -40 -45 -15 -35 Q -20 -15 -15 0 L 15 0 Q 20 -15 15 -35 Q 40 -45 30 -25 Z" fill="#ff2d55" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="0" cy="8" r="22" fill="#800020" stroke="#ff2d55" stroke-width="2" />
          <text x="0" y="16" font-family="'Arial Black', sans-serif" font-weight="900" font-size="18" text-anchor="middle" fill="#ffffff">DEVIL</text>
        </g>
        <rect x="20" y="180" width="160" height="26" rx="6" fill="#800020" stroke="#ff2d55" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="0.5">DEVIL'S DEAL 😈</text>
      </g>
    `;
  } else if (type === 'charity') {
    cornerPip = renderCornerText('🎁', '#34c759', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <rect x="-28" y="-18" width="56" height="46" rx="4" fill="#34c759" stroke="#ffffff" stroke-width="2" />
          <rect x="-32" y="-28" width="64" height="12" rx="3" fill="#ffd600" stroke="#ffffff" stroke-width="1.5" />
          <line x1="0" y1="-28" x2="0" y2="28" stroke="#ffd600" stroke-width="6" />
          <path d="M 0 -28 C -18 -45 -2 -45 0 -28 C 2 -45 18 -45 0 -28 Z" fill="#ffd600" stroke="#ffffff" stroke-width="1.5" />
        </g>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#1b5e20" stroke="#ffd600" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">CHARITY 🎁</text>
      </g>
    `;
  } else if (type === 'eliminatedplayer') {
    cornerPip = renderCornerText('💀', '#ff2d55', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <path d="M -22 -15 A 24 24 0 1 1 22 -15 C 22 2 12 12 12 24 L -12 24 C -12 12 -22 2 -22 -15 Z" fill="#ffffff" stroke="#111" stroke-width="2" />
          <circle cx="-8" cy="-5" r="5" fill="#111" />
          <circle cx="8" cy="-5" r="5" fill="#111" />
          <line x1="-5" y1="18" x2="-5" y2="24" stroke="#111" stroke-width="2" />
          <line x1="5" y1="18" x2="5" y2="24" stroke="#111" stroke-width="2" />
        </g>
        <rect x="20" y="180" width="160" height="26" rx="6" fill="#b71540" stroke="#ffffff" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#ffffff" letter-spacing="1">ELIMINATE 💀</text>
      </g>
    `;
  } else if (type === 'frozencolor') {
    cornerPip = renderCornerText('❄', '#00f0ff', 24);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <g transform="translate(100, 125)">
          <circle cx="0" cy="0" r="32" fill="none" stroke="#00f0ff" stroke-width="2" opacity="0.4" filter="url(#${idPrefix}_glow)" />
          <path d="M 0 -30 L 0 30 M -30 0 L 30 0 M -21 -21 L 21 21 M -21 21 L 21 -21" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <circle cx="0" cy="0" r="7" fill="#00f0ff" stroke="#ffffff" stroke-width="2" />
        </g>
        <rect x="25" y="180" width="150" height="26" rx="6" fill="#006064" stroke="#00f0ff" stroke-width="1.5" />
        <text x="100" y="198" font-family="'Arial Black', sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="#00f0ff" letter-spacing="1">FREEZE COLOR ❄</text>
      </g>
    `;
  } else {
    cornerPip = renderCornerText('★', '#ffffff', 22);
    centerArtwork = `
      <g filter="url(#${idPrefix}_shadow)">
        <text x="100" y="160" font-family="'Arial Black', sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="#ffffff">${escapeXml(type.toUpperCase())}</text>
      </g>
    `;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
  ${defs}
  ${cardBase}
  ${centerOval}
  ${cornerPip}
  ${centerArtwork}
</svg>`.trim();
}

function generateCardCoverSVG(isDark) {
  const bgStart = isDark ? '#140224' : '#29040a';
  const bgEnd = isDark ? '#330847' : '#520814';
  const ovalCol1 = isDark ? '#9d4edd' : '#ff2d55';
  const ovalCol2 = isDark ? '#ff2a85' : '#c9002b';
  const logoText = isDark ? 'UNO FLIP!' : 'UNO';
  const strokeCol = isDark ? '#00f0ff' : '#ffea00';

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
  <defs>
    <linearGradient id="cover_bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}" />
      <stop offset="50%" stop-color="${bgEnd}" />
      <stop offset="100%" stop-color="${bgStart}" />
    </linearGradient>
    <linearGradient id="cover_oval" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${ovalCol1}" />
      <stop offset="100%" stop-color="${ovalCol2}" />
    </linearGradient>
    <filter id="cover_shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.9" />
    </filter>
  </defs>
  <rect x="2" y="2" width="196" height="296" rx="16" ry="16" fill="url(#cover_bg)" stroke="${strokeCol}" stroke-width="3.5" />
  <rect x="7" y="7" width="186" height="286" rx="12" ry="12" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" />
  <ellipse cx="100" cy="150" rx="72" ry="105" transform="rotate(-28 100 150)" fill="url(#cover_oval)" stroke="#ffffff" stroke-width="3" filter="url(#cover_shadow)" />
  <g filter="url(#cover_shadow)" transform="translate(100, 150) rotate(-22)">
    <text x="0" y="16" font-family="'Arial Black', 'Impact', sans-serif" font-weight="900" font-size="${isDark ? '38' : '52'}" text-anchor="middle" fill="#ffea00" stroke="#d50000" stroke-width="3.5" letter-spacing="1">${logoText}</text>
  </g>
</svg>`.trim();
}

function generateHighlightSVG() {
  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
  <defs>
    <filter id="hl_glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="3" y="3" width="194" height="294" rx="16" ry="16" fill="none" stroke="#ffea00" stroke-width="6" opacity="0.9" filter="url(#hl_glow)" />
  <rect x="6" y="6" width="188" height="288" rx="13" ry="13" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.8" />
</svg>`.trim();
}

function generateEliminatedSVG() {
  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" width="200" height="300">
  <defs>
    <linearGradient id="elim_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255, 0, 50, 0.45)" />
      <stop offset="100%" stop-color="rgba(100, 0, 20, 0.75)" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="196" height="296" rx="16" ry="16" fill="url(#elim_grad)" stroke="#ff0033" stroke-width="3" />
  <line x1="20" y1="20" x2="180" y2="280" stroke="#ff0033" stroke-width="8" stroke-linecap="round" />
  <line x1="180" y1="20" x2="20" y2="280" stroke="#ff0033" stroke-width="8" stroke-linecap="round" />
</svg>`.trim();
}

function writeSVG(filename, content) {
  const fullPath = path.join(svgOutputDir, filename);
  fs.writeFileSync(fullPath, content, 'utf8');
}

// 1. Generate Cover and Overlay SVGs
writeSVG('card_cover_light.svg', generateCardCoverSVG(false));
writeSVG('card_cover_dark.svg', generateCardCoverSVG(true));
writeSVG('card_highlight.svg', generateHighlightSVG());
writeSVG('card_eliminated.svg', generateEliminatedSVG());

// 2. Generate Number Cards for Light (red, blue, yellow, green) and Dark (pink, teal, orange, purple)
const allColors = ['red', 'blue', 'yellow', 'green', 'pink', 'teal', 'orange', 'purple'];
for (const col of allColors) {
  for (let num = 0; num <= 9; num++) {
    writeSVG(`card_${col}_${num}.svg`, generateSVG(col, 'number', num));
  }
}

// 3. Generate Action Cards
const actionTypes = [
  'draw2', 'draw4', 'draw1', 'draw5', 'skip', 'reverse',
  'discardall', 'skipeveryone', 'flip', 'hit2',
  'flexnumber', 'flexdraw2', 'flexskip'
];

for (const col of allColors) {
  for (const act of actionTypes) {
    writeSVG(`card_${col}_${act}.svg`, generateSVG(col, act, ''));
  }
}

// 4. Generate Wild Cards
const wildTypes = [
  'wild', 'darkwild', 'wilddraw4', 'wilddraw2', 'wilddraw6', 'wilddraw10',
  'wildreversdraw4', 'wildcolorroulette', 'wilddrawcolor', 'wildattack',
  'wildswap', 'wildreverse', 'wildskip', 'wildskipeveryone',
  'wildtargeteddraw2', 'flexdraw4', 'flexwildalldraw'
];

for (const wt of wildTypes) {
  const normCol = wt === 'darkwild' ? 'darkwild' : 'wild';
  writeSVG(`card_${wt}.svg`, generateSVG(normCol, wt, ''));
}

// 5. Generate Special Power Cards
const specialTypes = [
  'truesight', 'oneforme', 'devildeal', 'charity',
  'targeteddraw2', 'targeteddraw4', 'eliminatedplayer', 'frozencolor'
];

for (const st of specialTypes) {
  writeSVG(`card_special_${st}.svg`, generateSVG('wild', st, ''));
}

console.log('All individual card SVGs have been generated in assets/svg/ successfully!');
