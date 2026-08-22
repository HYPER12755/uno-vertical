/*!
 * SVGCards - Ultra-Clean High-Definition UNO & Four Colors Card Canvas Renderer
 * Generates crisp 200x300 canvas surfaces for all classic, action, and special cards.
 */
(function() {
  'use strict';

  var COLOR_PALETTES = {
    red: { bgTop: '#ff4d4d', bgBottom: '#c0292b', accent: '#ff7675', border: '#ffffff' },
    blue: { bgTop: '#2980b9', bgBottom: '#1a5276', accent: '#54a0ff', border: '#ffffff' },
    green: { bgTop: '#27ae60', bgBottom: '#1e8449', accent: '#2ecc71', border: '#ffffff' },
    yellow: { bgTop: '#f1c40f', bgBottom: '#d4ac0d', accent: '#f9ca24', border: '#ffffff' },
    purple: { bgTop: '#8e44ad', bgBottom: '#5b2c6f', accent: '#9b59b6', border: '#ffffff' },
    pink: { bgTop: '#e84393', bgBottom: '#ad1457', accent: '#fd79a8', border: '#ffffff' },
    teal: { bgTop: '#00cec9', bgBottom: '#00838f', accent: '#81ecec', border: '#ffffff' },
    orange: { bgTop: '#e67e22', bgBottom: '#d35400', accent: '#f39c12', border: '#ffffff' },
    wild: { bgTop: '#2d3436', bgBottom: '#1e272e', accent: '#636e72', border: '#f1c40f' }
  };

  var cardCache = {};

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function getCardCanvas(cardType, cardColor, cardValue) {
    var type = String(cardType || 'number').toLowerCase();
    var color = String(cardColor || '').toLowerCase();
    if (!color || color === 'undefined' || color === 'null' || type.startsWith('wild') || type === 'wild') {
      color = 'wild';
    }
    var val = cardValue !== undefined && cardValue !== null ? String(cardValue) : '';
    var cacheKey = type + '_' + color + '_' + val;

    if (cardCache[cacheKey]) {
      return cardCache[cacheKey];
    }

    var canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    renderCard(ctx, type, color, val, 200, 300);
    cardCache[cacheKey] = canvas;
    return canvas;
  }

  function renderCard(ctx, type, color, val, w, h) {
    ctx.save();
    ctx.clearRect(0, 0, w, h);

    var palette = COLOR_PALETTES[color] || COLOR_PALETTES.wild;
    var isWild = color === 'wild' || type.startsWith('wild') || type === 'wild';

    // 1. Base card shadow / outer boundary
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;
    drawRoundedRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // 2. Card background gradient
    var bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, palette.bgTop);
    bgGrad.addColorStop(1, palette.bgBottom);
    drawRoundedRect(ctx, 9, 9, w - 18, h - 18, 14);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // 3. Inner Gloss / Reflection Arc
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w / 2, -20, w * 0.7, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();
    ctx.restore();

    // 4. Center Oval / Emblem
    var centerX = w / 2;
    var centerY = h / 2;

    if (isWild) {
      // 4-Quadrant Wild Oval
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-22 * Math.PI / 180);

      // Black background for center oval
      ctx.beginPath();
      ctx.ellipse(0, 0, 68, 98, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#111111';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw 4 colorful slices
      var rX = 64;
      var rY = 94;
      var wildColors = ['#ff4d4d', '#2980b9', '#27ae60', '#f1c40f']; // Red, Blue, Green, Yellow

      // Top-Left (Red)
      ctx.save();
      ctx.beginPath();
      ctx.rect(-rX, -rY, rX, rY);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.fillStyle = wildColors[0];
      ctx.fill();
      ctx.restore();

      // Top-Right (Blue)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, -rY, rX, rY);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.fillStyle = wildColors[1];
      ctx.fill();
      ctx.restore();

      // Bottom-Left (Yellow)
      ctx.save();
      ctx.beginPath();
      ctx.rect(-rX, 0, rX, rY);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.fillStyle = wildColors[3];
      ctx.fill();
      ctx.restore();

      // Bottom-Right (Green)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, rX, rY);
      ctx.clip();
      ctx.beginPath();
      ctx.ellipse(0, 0, rX, rY, 0, 0, Math.PI * 2);
      ctx.fillStyle = wildColors[2];
      ctx.fill();
      ctx.restore();

      ctx.restore();
    } else {
      // Classic White Rotated Ellipse
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-25 * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, 64, 96, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
    }

    // 5. Draw Center Symbol & Corner Indicators
    var symbol = getSymbolForType(type, val);
    renderCardSymbols(ctx, type, color, val, symbol, w, h, isWild, palette);

    ctx.restore();
  }

  function getSymbolForType(type, val) {
    if (type === 'number' || (!isNaN(parseInt(val, 10)) && val !== '')) {
      return val || '0';
    }
    switch (type) {
      case 'draw1': return '+1';
      case 'draw2': case 'flexdraw2': return '+2';
      case 'draw3': return '+3';
      case 'draw4': return '+4';
      case 'draw5': return '+5';
      case 'skip': case 'flexskip': return '⊘';
      case 'skipeveryone': case 'wildskipeveryone': return '⊘⊘';
      case 'reverse': case 'wildreverse': return '⇄';
      case 'discardall': return '🗑';
      case 'flip': return '🌓';
      case 'hit2': return '💥2';
      case 'attack': case 'wildattack': return '⚔️';
      case 'wild': return 'WILD';
      case 'wilddraw2': return '+2';
      case 'wilddraw4': case 'wildreversdraw4': return '+4';
      case 'wilddraw6': return '+6';
      case 'wilddraw10': return '+10';
      case 'wildcolorroulette': return '🎡';
      case 'wildswap': case 'swap': return '🤝';
      case 'wildtruesight': case 'truesight': return '👁️';
      case 'charity': return '🎁';
      case 'devildeal': return '😈';
      case 'frozencolor': return '❄️';
      case 'oneforme': return '⭐';
      case 'targeteddraw2': case 'wildtargeteddraw2': return '🎯+2';
      case 'targeteddraw4': return '🎯+4';
      case 'eliminatedplayer': return '💀';
      default: return val || type.toUpperCase();
    }
  }

  function renderCardSymbols(ctx, type, color, val, symbol, w, h, isWild, palette) {
    var centerX = w / 2;
    var centerY = h / 2;

    // Corner font and Center font
    var isNumber = (type === 'number' || (!isNaN(parseInt(symbol, 10)) && symbol.length <= 2));
    var isDrawPlus = symbol.startsWith('+') || symbol.startsWith('🎯+');

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // --- CENTER ART / TEXT ---
    if (isWild && symbol === 'WILD') {
      // Classic WILD Text in center with stroke
      ctx.save();
      ctx.font = '900 28px "Arial Black", Impact, sans-serif';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000000';
      ctx.strokeText('WILD', centerX, centerY);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('WILD', centerX, centerY);
      ctx.restore();
    } else if (isNumber) {
      ctx.save();
      ctx.font = '900 84px "Arial Black", Impact, sans-serif';
      ctx.fillStyle = palette.bgBottom;
      // Shadow & Drop
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;
      ctx.fillText(symbol, centerX, centerY + 4);
      ctx.restore();
    } else if (isDrawPlus) {
      ctx.save();
      var fontSize = symbol.length > 3 ? 46 : (symbol.length === 3 ? 56 : 68);
      ctx.font = '900 ' + fontSize + 'px "Arial Black", Impact, sans-serif';
      if (isWild) {
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(symbol, centerX, centerY + 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(symbol, centerX, centerY + 2);
      } else {
        ctx.fillStyle = palette.bgBottom;
        ctx.fillText(symbol, centerX, centerY + 2);
      }
      ctx.restore();
    } else if (type === 'skip' || type === 'flexskip') {
      // Draw crisp vectorized Skip sign in center
      ctx.save();
      ctx.strokeStyle = palette.bgBottom;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX - 26, centerY - 26);
      ctx.lineTo(centerX + 26, centerY + 26);
      ctx.stroke();
      ctx.restore();
    } else if (type === 'reverse' || type === 'wildreverse') {
      // Draw crisp Reverse arrows in center
      ctx.save();
      ctx.font = '900 70px "Arial Black", Impact, sans-serif';
      if (isWild) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#000000';
        ctx.strokeText('⇄', centerX, centerY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('⇄', centerX, centerY);
      } else {
        ctx.fillStyle = palette.bgBottom;
        ctx.fillText('⇄', centerX, centerY);
      }
      ctx.restore();
    } else {
      // Generic / Emoji / Action symbol in center
      ctx.save();
      var fSize = symbol.length > 4 ? 24 : (symbol.length > 2 ? 38 : 52);
      ctx.font = 'bold ' + fSize + 'px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      if (isWild) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = palette.bgBottom;
      }
      ctx.fillText(symbol, centerX, centerY);
      ctx.restore();
    }

    // --- CORNER ICONS (Top-Left & Bottom-Right) ---
    var cornerSymbol = symbol;
    if (cornerSymbol === 'WILD') cornerSymbol = '★';

    // Top-Left Corner
    ctx.save();
    ctx.translate(28, 30);
    renderCornerIndicator(ctx, cornerSymbol, isWild, palette);
    ctx.restore();

    // Bottom-Right Corner (Rotated 180 deg)
    ctx.save();
    ctx.translate(w - 28, h - 30);
    ctx.rotate(Math.PI);
    renderCornerIndicator(ctx, cornerSymbol, isWild, palette);
    ctx.restore();
  }

  function renderCornerIndicator(ctx, sym, isWild, palette) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    var isShort = sym.length <= 2;
    var fontSize = isShort ? 24 : (sym.length === 3 ? 18 : 14);
    ctx.font = '900 ' + fontSize + 'px "Arial Black", Impact, sans-serif';

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillText(sym, 1, 2);

    // Text with white border
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    ctx.strokeText(sym, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(sym, 0, 0);
  }

  // Export globally
  window.SVGCards = {
    getCardCanvas: getCardCanvas,
    renderCard: renderCard
  };

})();
