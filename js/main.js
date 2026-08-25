////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
var stageW = 1280;
var stageH = 768;
var contentW = 1024;
var contentH = 576;

var viewport = { isLandscape: true };
var landscapeSize = { w: stageW, h: stageH, cW: contentW, cH: contentH };
var portraitSize = { w: 768, h: 1024, cW: 576, cH: 900 };

/*!
 * 
 * START BUILD GAME - This is the function that runs build game
 * 
 */
function initMain() {
  $('#canvasHolder').show();

  initGameCanvas(stageW, stageH);
  buildGameCanvas();
  buildGameButton();

  if (typeof buildScoreBoardCanvas == 'function') {
    buildScoreBoardCanvas();
  }

  goPage('main');
  if (typeof initSocket == 'function' && multiplayerSettings.enable) {
    initSocket("fourcolors");
    if (window.MultiplayerUIManager && typeof window.MultiplayerUIManager.getInstance === 'function') {
        window.MultiplayerUIManager.getInstance().checkUrlForRoomInvite();
    }
  }

  checkMobileOrientation();
  resizeGameFunc();
}

var windowW = 0;
var windowH = 0;
var scalePercent = 1;
var offset = { x: 0, y: 0, left: 0, top: 0 };

/*!
 * 
 * GAME RESIZE - This is the function that runs to resize and centralize the game
 * 
 */
function resizeGameFunc() {
  setTimeout(function() {
    windowW = window.innerWidth || $(window).width() || 1280;
    windowH = window.innerHeight || $(window).height() || 768;

    if (typeof checkContentWidth === 'function') {
      $('.mobileRotate').css('left', checkContentWidth($('.mobileRotate')));
      $('.mobileRotate').css('top', checkContentHeight($('.mobileRotate')));
    }

    var curStageW = viewport.isLandscape ? landscapeSize.w : portraitSize.w;
    var curStageH = viewport.isLandscape ? landscapeSize.h : portraitSize.h;

    var scaleX = windowW / curStageW;
    var scaleY = windowH / curStageH;
    scalePercent = Math.min(scaleX, scaleY);

    var newCanvasW = Math.round(curStageW * scalePercent);
    var newCanvasH = Math.round(curStageH * scalePercent);

    var leftPos = Math.round((windowW - newCanvasW) / 2);
    var topPos = Math.round((windowH - newCanvasH) / 2);

    offset.left = (windowW - newCanvasW);
    offset.top = (windowH - newCanvasH);
    offset.x = 0;
    offset.y = 0;

    $('canvas').css({
      'width': newCanvasW + 'px',
      'height': newCanvasH + 'px',
      'left': leftPos + 'px',
      'top': topPos + 'px',
      'position': 'fixed',
      'display': 'block',
      'margin': '0',
      'box-sizing': 'border-box'
    });

    // Room & Notification containers positioning
    if (typeof initSocket == 'function' && multiplayerSettings.enable) {
      $('.resizeFont').each(function() {
        var baseSize = Number($(this).attr('data-fontsize')) || 16;
        $(this).css('font-size', Math.round(baseSize * scalePercent) + 'px');
      });

      $('#roomWrapper').css({
        'width': newCanvasW + 'px',
        'height': newCanvasH + 'px',
        'left': leftPos + 'px',
        'top': topPos + 'px'
      });

      $('#notificationHolder').css({
        'width': newCanvasW + 'px',
        'height': newCanvasH + 'px',
        'left': leftPos + 'px',
        'top': topPos + 'px'
      });
    }

    $(window).scrollTop(0);

    resizeCanvas();
    if (typeof resizeScore == 'function') {
      resizeScore();
    }
  }, 50);
}

$(window).on('resize', function() {
  resizeGameFunc();
});
