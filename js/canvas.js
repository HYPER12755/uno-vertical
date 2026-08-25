////////////////////////////////////////////////////////////
// CANVAS & STAGE CONTROLLER
////////////////////////////////////////////////////////////
var stage;
var canvasW = 0;
var canvasH = 0;
var guide = false;
var curPage = 'main';

var canvasContainer, mainContainer, gameContainer, instructionContainer, resultContainer, moveContainer, confirmContainer;
var guideline, bg, bgP, logo, logoP, buttonPlay, buttonLocal, buttonOnline, buttonLocalContainer;
var optionsContainer, buttonSettings, buttonConfirm, buttonCancel, popTitleTxt, popDescTxt, itemPop, itemPopP, itemExit;
var buttonSoundOn, buttonSoundOff, buttonExit;
var itemColors, itemFrozen, itemColorBg, colorSelectTxt, colorsInnerContainer, colorSpriteData;
var itemStatus, itemStatusLong, statusTxt, statusPlayerTxt;
var cardsOptionsContainer, cardsOptionsListContainer, cardsOptionsTutorialContainer, statusContainer, statusIconContainer, guideContainer;
var cardScoreContainer, cardScoreListContainer, cardsContainer, cardsPlayContainer, cardsPlayersContainer, colorsContainer;
var resultTitleTxt, resultDescTxt, buttonContinue, buttonFacebook, buttonTwitter, buttonWhatsapp;
var itemOptions, optionsTitleTxt, itemPlayerNumbers, totalPlayersTxt, buttonPlayersL, buttonPlayersR;
var itemPoints, pointsTxt, buttonPointsL, buttonPointsR, itemType, typeTxt, buttonTypeL, buttonTypeR;
var themeContainer, buttonThemeL, buttonThemeR, buttonNext, buttonStart, buttonTutorial, buttonTutorialL, buttonTutorialR, buttonBack;
var itemTutorial, tutorialTitleTxt, guideTxt, itemScore, itemScoreTop, itemScoreDivide, itemInstruction;
var nameContainer, roomContainer, gameLogsTxt;

$.tutorial = {};
$.players = {};
$.colors = {};
$.cards = {};
$.editor = { enable: false };

/*!
 * 
 * START GAME CANVAS - Initialize EaselJS Stage and settings
 * 
 */
function initGameCanvas(w, h) {
  var gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.width = w;
  gameCanvas.height = h;

  canvasW = w;
  canvasH = h;
  stage = new createjs.Stage("gameCanvas");

  if (typeof createjs !== 'undefined' && createjs.Touch && typeof createjs.Touch.enable === 'function') {
    createjs.Touch.enable(stage);
  }
  if (stage && typeof stage.enableMouseOver === 'function') {
    stage.enableMouseOver(20);
    stage.mouseMoveOutside = true;
  }

  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", tick);
}

/*!
 * 
 * CHANGE VIEWPORT - Switch between landscape and portrait stage dimensions
 * 
 */
function changeViewport(isLandscape) {
  if (isLandscape) {
    stageW = landscapeSize.w;
    stageH = landscapeSize.h;
    contentW = landscapeSize.cW;
    contentH = landscapeSize.cH;
  } else {
    stageW = portraitSize.w;
    stageH = portraitSize.h;
    contentW = portraitSize.cW;
    contentH = portraitSize.cH;
  }

  var gameCanvas = document.getElementById("gameCanvas");
  if (gameCanvas) {
    gameCanvas.width = stageW;
    gameCanvas.height = stageH;
  }
  canvasW = stageW;
  canvasH = stageH;

  changeCanvasViewport();
}

/*!
 * 
 * CHANGE CANVAS VIEWPORT - Update sub-elements based on orientation
 * 
 */
function changeCanvasViewport() {
  if (canvasContainer != undefined) {
    if (cardsContainer) {
      cardsContainer.x = canvasW / 2;
      cardsContainer.y = canvasH / 2;
    }
    if (cardsOptionsContainer) {
      cardsOptionsContainer.x = canvasW / 2;
      cardsOptionsContainer.y = canvasH / 2;
    }
    if (resultContainer) {
      resultContainer.x = canvasW / 2;
      resultContainer.y = canvasH / 2;
    }
    if (confirmContainer) {
      confirmContainer.x = canvasW / 2;
      confirmContainer.y = canvasH / 2;
    }

    if (viewport.isLandscape) {
      bg.visible = true;
      bgP.visible = false;
      logo.visible = true;
      logoP.visible = false;

      buttonPlay.x = (canvasW / 2);
      buttonPlay.y = canvasH / 100 * 75;
      buttonLocal.x = canvasW / 2 - 140;
      buttonLocal.y = canvasH / 100 * 75;
      buttonOnline.x = canvasW / 2 + 140;
      buttonOnline.y = canvasH / 100 * 75;
    } else {
      bg.visible = false;
      bgP.visible = true;
      logo.visible = false;
      logoP.visible = true;

      buttonPlay.x = (canvasW / 2);
      buttonPlay.y = canvasH / 100 * 73;
      buttonLocal.x = canvasW / 2;
      buttonLocal.y = canvasH / 100 * 73;
      buttonOnline.x = canvasW / 2;
      buttonOnline.y = canvasH / 100 * 83;
    }
  }
}

/*!
 * 
 * RESIZE CANVAS - Reposition floating settings & audio buttons
 * 
 */
function resizeCanvas() {
  if (canvasContainer != undefined) {
    buttonSettings.x = (canvasW - offset.x) - 50;
    buttonSettings.y = offset.y + 45;

    var distanceNum = 65;
    var nextCount = (typeof buttonMusicOn !== "undefined") ? 2 : 1;

    if (curPage != 'game') {
      buttonExit.visible = false;
      buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
      buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y + distanceNum;
      if (typeof buttonMusicOn !== "undefined") {
        buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
        buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y + (distanceNum * 2);
      }
    } else {
      buttonExit.visible = true;
      buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
      buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y + distanceNum;
      if (typeof buttonMusicOn !== "undefined") {
        buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
        buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y + (distanceNum * 2);
      }
      buttonExit.x = buttonSettings.x;
      buttonExit.y = buttonSettings.y + (distanceNum * (nextCount + 1));
    }

    if (typeof resizeGameLayout === 'function') {
      resizeGameLayout();
    }
  }
}

/*!
 * 
 * BUILD GAME CANVAS - Construct all EaselJS containers, bitmaps, texts & controls
 * 
 */
function buildGameCanvas() {
  canvasContainer = new createjs.Container();
  mainContainer = new createjs.Container();
  nameContainer = new createjs.Container();
  roomContainer = new createjs.Container();
  buttonLocalContainer = new createjs.Container();
  cardsOptionsContainer = new createjs.Container();
  cardsOptionsListContainer = new createjs.Container();
  cardsOptionsTutorialContainer = new createjs.Container();
  gameContainer = new createjs.Container();
  statusContainer = new createjs.Container();
  statusIconContainer = new createjs.Container();
  statusIconContainer.y = -35;
  guideContainer = new createjs.Container();
  cardScoreContainer = new createjs.Container();
  cardScoreListContainer = new createjs.Container();
  cardsContainer = new createjs.Container();
  cardsPlayContainer = new createjs.Container();
  cardsPlayersContainer = new createjs.Container();
  colorsContainer = new createjs.Container();
  resultContainer = new createjs.Container();
  confirmContainer = new createjs.Container();
  optionsContainer = new createjs.Container();

  // Background & Logo
  bg = new createjs.Bitmap(loader.getResult('background'));
  bgP = new createjs.Bitmap(loader.getResult('backgroundP'));
  logo = new createjs.Bitmap(loader.getResult('logo'));
  logoP = new createjs.Bitmap(loader.getResult('logoP'));

  // Main Action Buttons
  buttonPlay = new createjs.Bitmap(loader.getResult('buttonPlay'));
  centerReg(buttonPlay);
  createHitarea(buttonPlay);

  buttonLocal = new createjs.Bitmap(loader.getResult('buttonLocal'));
  centerReg(buttonLocal);
  createHitarea(buttonLocal);

  buttonOnline = new createjs.Bitmap(loader.getResult('buttonOnline'));
  centerReg(buttonOnline);
  createHitarea(buttonOnline);

  buttonLocalContainer.addChild(buttonLocal, buttonOnline);
  mainContainer.addChild(logo, logoP, buttonPlay, buttonLocalContainer);

  // Game Log Text
  gameLogsTxt = new createjs.Text();
  gameLogsTxt.font = "18px bpreplaybold";
  gameLogsTxt.color = "#ffffff";
  gameLogsTxt.textAlign = "center";
  gameLogsTxt.textBaseline = "middle";
  gameLogsTxt.x = canvasW / 2;
  gameLogsTxt.y = canvasH / 100 * 85;
  mainContainer.addChild(gameLogsTxt);

  // Color Sprites & Selector
  var _frame = { regX: 50, regY: 50, height: 100, width: 100, count: 9 };
  var itemColorsRes = loader.getResult('itemColors');
  var itemColorsImg = (itemColorsRes && itemColorsRes.src) ? itemColorsRes.src : itemColorsRes;
  colorSpriteData = new createjs.SpriteSheet({
    images: [itemColorsImg],
    frames: _frame,
    animations: { animate: { frames: [0, 1, 2, 3], speed: 1 } }
  });

  itemColors = new createjs.Sprite(colorSpriteData, 'animate');
  itemColors.framerate = 20;
  itemColors.scaleX = itemColors.scaleY = 0.7;

  itemFrozen = new createjs.Bitmap(loader.getResult('itemFrozen'));
  centerReg(itemFrozen);
  itemFrozen.scaleX = itemFrozen.scaleY = 0.7;

  itemColorBg = new createjs.Bitmap(loader.getResult('itemColorBg'));
  centerReg(itemColorBg);

  colorSelectTxt = new createjs.Text();
  colorSelectTxt.font = "26px bpreplaybold";
  colorSelectTxt.color = '#fff';
  colorSelectTxt.textAlign = "center";
  colorSelectTxt.textBaseline = 'alphabetic';
  colorSelectTxt.y = 127;
  colorSelectTxt.text = 'CHOOSE A COLOR';

  colorsInnerContainer = new createjs.Container();
  colorsInnerContainer.y = -20;
  colorsContainer.addChild(itemColorBg, colorsInnerContainer, colorSelectTxt);

  for (var n = 0; n < 4; n++) {
    $.colors[n] = new createjs.Sprite(colorSpriteData, 'animate');
    $.colors[n].gotoAndStop(n);
    colorsInnerContainer.addChild($.colors[n]);
  }

  $.colors[0].x = $.colors[2].x = -55;
  $.colors[1].x = $.colors[3].x = 55;
  $.colors[0].y = $.colors[1].y = -55;
  $.colors[2].y = $.colors[3].y = 55;

  // Status Banner
  itemStatus = new createjs.Bitmap(loader.getResult('itemStatus'));
  centerReg(itemStatus);
  itemStatusLong = new createjs.Bitmap(loader.getResult('itemStatusLong'));
  centerReg(itemStatusLong);

  statusTxt = new createjs.Text();
  statusTxt.font = "25px bpreplaybold";
  statusTxt.color = '#fff';
  statusTxt.textAlign = "center";
  statusTxt.textBaseline = 'middle';
  statusTxt.y = 0;

  statusPlayerTxt = new createjs.Text();
  statusPlayerTxt.font = "20px bpreplaybold";
  statusPlayerTxt.color = '#FFD700';
  statusPlayerTxt.textAlign = "center";
  statusPlayerTxt.textBaseline = 'middle';
  statusPlayerTxt.y = 35;

  statusContainer.addChild(itemStatus, itemStatusLong, statusIconContainer, statusTxt, statusPlayerTxt);
  statusContainer.visible = false;

  // Score & Guide
  itemScore = new createjs.Bitmap(loader.getResult('itemScore'));
  centerReg(itemScore);
  cardScoreContainer.addChild(itemScore, cardScoreListContainer);
  cardScoreContainer.visible = false;

  itemInstruction = new createjs.Bitmap(loader.getResult('itemInstruction'));
  centerReg(itemInstruction);
  guideTxt = new createjs.Text();
  guideTxt.font = "22px bpreplaybold";
  guideTxt.color = "#fff";
  guideTxt.textAlign = "center";
  guideTxt.textBaseline = "middle";
  guideContainer.addChild(itemInstruction, guideTxt);
  guideContainer.visible = false;

  // Options Panel
  itemOptions = new createjs.Bitmap(loader.getResult('itemOptions'));
  centerReg(itemOptions);

  optionsTitleTxt = new createjs.Text();
  optionsTitleTxt.font = "35px bpreplaybold";
  optionsTitleTxt.color = "#fff";
  optionsTitleTxt.textAlign = "center";
  optionsTitleTxt.textBaseline = "alphabetic";
  optionsTitleTxt.text = textDisplay.optionsTitle;
  optionsTitleTxt.y = -135;

  itemPlayerNumbers = new createjs.Bitmap(loader.getResult('itemNumber'));
  centerReg(itemPlayerNumbers);
  itemPlayerNumbers.y = -65;

  totalPlayersTxt = new createjs.Text();
  totalPlayersTxt.font = "25px bpreplaybold";
  totalPlayersTxt.color = "#fff";
  totalPlayersTxt.textAlign = "center";
  totalPlayersTxt.textBaseline = "middle";
  totalPlayersTxt.y = -65;

  buttonPlayersL = new createjs.Bitmap(loader.getResult('buttonArrowLeft'));
  centerReg(buttonPlayersL);
  buttonPlayersL.x = -150;
  buttonPlayersL.y = -65;
  createHitarea(buttonPlayersL);

  buttonPlayersR = new createjs.Bitmap(loader.getResult('buttonArrowRight'));
  centerReg(buttonPlayersR);
  buttonPlayersR.x = 150;
  buttonPlayersR.y = -65;
  createHitarea(buttonPlayersR);

  itemPoints = new createjs.Bitmap(loader.getResult('itemNumber'));
  centerReg(itemPoints);
  itemPoints.y = 5;

  pointsTxt = new createjs.Text();
  pointsTxt.font = "25px bpreplaybold";
  pointsTxt.color = "#fff";
  pointsTxt.textAlign = "center";
  pointsTxt.textBaseline = "middle";
  pointsTxt.y = 5;

  buttonPointsL = new createjs.Bitmap(loader.getResult('buttonArrowLeft'));
  centerReg(buttonPointsL);
  buttonPointsL.x = -150;
  buttonPointsL.y = 5;
  createHitarea(buttonPointsL);

  buttonPointsR = new createjs.Bitmap(loader.getResult('buttonArrowRight'));
  centerReg(buttonPointsR);
  buttonPointsR.x = 150;
  buttonPointsR.y = 5;
  createHitarea(buttonPointsR);

  itemType = new createjs.Bitmap(loader.getResult('itemNumber'));
  centerReg(itemType);
  itemType.y = 75;

  typeTxt = new createjs.Text();
  typeTxt.font = "25px bpreplaybold";
  typeTxt.color = "#fff";
  typeTxt.textAlign = "center";
  typeTxt.textBaseline = "middle";
  typeTxt.y = 75;

  buttonTypeL = new createjs.Bitmap(loader.getResult('buttonArrowLeft'));
  centerReg(buttonTypeL);
  buttonTypeL.x = -150;
  buttonTypeL.y = 75;
  createHitarea(buttonTypeL);

  buttonTypeR = new createjs.Bitmap(loader.getResult('buttonArrowRight'));
  centerReg(buttonTypeR);
  buttonTypeR.x = 150;
  buttonTypeR.y = 75;
  createHitarea(buttonTypeR);

  themeContainer = new createjs.Container();
  themeContainer.y = -10;

  buttonThemeL = new createjs.Bitmap(loader.getResult('buttonArrowLeft'));
  centerReg(buttonThemeL);
  buttonThemeL.x = -150;
  buttonThemeL.y = -10;
  createHitarea(buttonThemeL);

  buttonThemeR = new createjs.Bitmap(loader.getResult('buttonArrowRight'));
  centerReg(buttonThemeR);
  buttonThemeR.x = 150;
  buttonThemeR.y = -10;
  createHitarea(buttonThemeR);

  buttonNext = new createjs.Bitmap(loader.getResult('buttonNext'));
  centerReg(buttonNext);
  buttonNext.x = 100;
  buttonNext.y = 155;
  createHitarea(buttonNext);

  buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
  centerReg(buttonStart);
  buttonStart.x = 100;
  buttonStart.y = 155;
  createHitarea(buttonStart);

  buttonTutorial = new createjs.Bitmap(loader.getResult('buttonTutorial'));
  centerReg(buttonTutorial);
  buttonTutorial.x = -100;
  buttonTutorial.y = 155;
  createHitarea(buttonTutorial);

  cardsOptionsListContainer.addChild(
    itemPlayerNumbers, totalPlayersTxt, buttonPlayersL, buttonPlayersR,
    itemPoints, pointsTxt, buttonPointsL, buttonPointsR,
    itemType, typeTxt, buttonTypeL, buttonTypeR,
    themeContainer, buttonThemeL, buttonThemeR,
    buttonNext, buttonStart, buttonTutorial
  );

  // Tutorial subpanel
  tutorialTitleTxt = new createjs.Text();
  tutorialTitleTxt.font = "35px bpreplaybold";
  tutorialTitleTxt.color = "#fff";
  tutorialTitleTxt.textAlign = "center";
  tutorialTitleTxt.textBaseline = "alphabetic";
  tutorialTitleTxt.text = textDisplay.tutorialTitle;
  tutorialTitleTxt.y = -135;

  tutorialPageTxt = new createjs.Text();
  tutorialPageTxt.font = "20px bpreplaybold";
  tutorialPageTxt.color = "#fff";
  tutorialPageTxt.textAlign = "center";
  tutorialPageTxt.textBaseline = "alphabetic";
  tutorialPageTxt.text = "1/15";
  tutorialPageTxt.y = 125;

  buttonTutorialL = new createjs.Bitmap(loader.getResult('buttonArrowLeft'));
  centerReg(buttonTutorialL);
  buttonTutorialL.x = -170;
  buttonTutorialL.y = 5;
  createHitarea(buttonTutorialL);

  buttonTutorialR = new createjs.Bitmap(loader.getResult('buttonArrowRight'));
  centerReg(buttonTutorialR);
  buttonTutorialR.x = 170;
  buttonTutorialR.y = 5;
  createHitarea(buttonTutorialR);

  buttonBack = new createjs.Bitmap(loader.getResult('buttonBack'));
  centerReg(buttonBack);
  buttonBack.x = 0;
  buttonBack.y = 155;
  createHitarea(buttonBack);

  cardsOptionsTutorialContainer.addChild(tutorialTitleTxt, tutorialPageTxt);
  for (var n = 0; n < 15; n++) {
    $.tutorial[n] = new createjs.Bitmap(loader.getResult('itemTutorial' + (n + 1)));
    centerReg($.tutorial[n]);
    $.tutorial[n].y = 5;
    $.tutorial[n].visible = (n === 0);
    cardsOptionsTutorialContainer.addChild($.tutorial[n]);
  }
  cardsOptionsTutorialContainer.addChild(buttonTutorialL, buttonTutorialR, buttonBack);
  cardsOptionsTutorialContainer.visible = false;

  cardsOptionsContainer.addChild(itemOptions, optionsTitleTxt, cardsOptionsListContainer, cardsOptionsTutorialContainer);
  cardsOptionsContainer.visible = false;

  // Result Panel
  var itemResult = new createjs.Bitmap(loader.getResult('itemPop'));
  centerReg(itemResult);

  resultTitleTxt = new createjs.Text();
  resultTitleTxt.font = "35px bpreplaybold";
  resultTitleTxt.color = "#fff";
  resultTitleTxt.textAlign = "center";
  resultTitleTxt.textBaseline = "alphabetic";
  resultTitleTxt.text = textDisplay.resultTitle;
  resultTitleTxt.y = -110;

  resultDescTxt = new createjs.Text();
  resultDescTxt.font = "55px bpreplaybold";
  resultDescTxt.color = "#FFD700";
  resultDescTxt.textAlign = "center";
  resultDescTxt.textBaseline = "middle";
  resultDescTxt.y = -20;

  buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
  centerReg(buttonContinue);
  buttonContinue.y = 100;
  createHitarea(buttonContinue);

  buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
  centerReg(buttonFacebook);
  buttonFacebook.x = -70;
  buttonFacebook.y = 45;
  createHitarea(buttonFacebook);

  buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
  centerReg(buttonTwitter);
  buttonTwitter.x = 0;
  buttonTwitter.y = 45;
  createHitarea(buttonTwitter);

  buttonWhatsapp = new createjs.Bitmap(loader.getResult('buttonWhatsapp'));
  centerReg(buttonWhatsapp);
  buttonWhatsapp.x = 70;
  buttonWhatsapp.y = 45;
  createHitarea(buttonWhatsapp);

  resultContainer.addChild(itemResult, resultTitleTxt, resultDescTxt, buttonContinue, buttonFacebook, buttonTwitter, buttonWhatsapp);
  resultContainer.visible = false;

  // Confirm Modal Dialog
  itemPop = new createjs.Bitmap(loader.getResult('itemPop'));
  centerReg(itemPop);

  popTitleTxt = new createjs.Text();
  popTitleTxt.font = "35px bpreplaybold";
  popTitleTxt.color = "#fff";
  popTitleTxt.textAlign = "center";
  popTitleTxt.textBaseline = "alphabetic";
  popTitleTxt.text = textDisplay.exitTitle;
  popTitleTxt.y = -90;

  popDescTxt = new createjs.Text();
  popDescTxt.font = "20px bpreplaybold";
  popDescTxt.color = "#ccc";
  popDescTxt.textAlign = "center";
  popDescTxt.textBaseline = "middle";
  popDescTxt.lineHeight = 26;
  popDescTxt.text = textDisplay.exitMessage;
  popDescTxt.y = -15;

  buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
  centerReg(buttonConfirm);
  buttonConfirm.x = -80;
  buttonConfirm.y = 80;
  createHitarea(buttonConfirm);

  buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
  centerReg(buttonCancel);
  buttonCancel.x = 80;
  buttonCancel.y = 80;
  createHitarea(buttonCancel);

  itemExit = new createjs.Shape();

  confirmContainer.addChild(itemPop, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel);
  confirmContainer.visible = false;

  // Floating Settings and Audio Buttons
  buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
  centerReg(buttonSoundOn);
  buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
  centerReg(buttonSoundOff);
  buttonSoundOn.visible = false;

  buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
  centerReg(buttonExit);
  buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
  centerReg(buttonSettings);

  createHitarea(buttonSoundOn);
  createHitarea(buttonSoundOff);
  createHitarea(buttonExit);
  createHitarea(buttonSettings);

  optionsContainer.addChild(buttonSoundOn, buttonSoundOff, buttonExit);
  optionsContainer.visible = false;

  // Tree assembly
  cardsContainer.addChild(cardsPlayContainer);
  gameContainer.addChild(cardsPlayersContainer, itemColors, itemFrozen, cardsContainer, colorsContainer, statusContainer, cardScoreContainer, guideContainer);

  canvasContainer.addChild(
    bg, bgP, mainContainer, nameContainer, roomContainer,
    cardsOptionsContainer, gameContainer, resultContainer,
    confirmContainer, optionsContainer, buttonSettings
  );
  stage.addChild(canvasContainer);

  changeViewport(viewport.isLandscape);
  resizeGameFunc();
}

/*!
 * 
 * TOGGLE OPTIONS POPUP
 * 
 */
function toggleOption() {
  if (optionsContainer) {
    optionsContainer.visible = !optionsContainer.visible;
  }
}

/*!
 * 
 * TOGGLE AUDIO MUTE
 * 
 */
function toggleSoundMute(con) {
  if (buttonSoundOff && buttonSoundOn) {
    buttonSoundOff.visible = !con;
    buttonSoundOn.visible = con;
  }
  if (typeof toggleSoundInMute === 'function') {
    toggleSoundInMute(con);
  }
}

/*!
 * 
 * TOGGLE CONFIRM QUIT POPUP
 * 
 */
function togglePop(con) {
  if (confirmContainer) {
    confirmContainer.visible = !!con;
  }
}

/*!
 * 
 * TICK - EaselJS Render Loop
 * 
 */
function tick(event) {
  if (typeof updateGame === 'function') {
    updateGame();
  }
  if (stage) {
    stage.update(event);
  }
}

/*!
 * 
 * HELPER - Center registration point
 * 
 */
function centerReg(obj) {
  if (!obj) return;
  if (obj.image) {
    obj.regX = (obj.image.naturalWidth || obj.image.width || 0) / 2;
    obj.regY = (obj.image.naturalHeight || obj.image.height || 0) / 2;
  } else if (typeof obj.getBounds === 'function' && obj.getBounds()) {
    var bounds = obj.getBounds();
    obj.regX = bounds.width / 2;
    obj.regY = bounds.height / 2;
  }
}

/*!
 * 
 * HELPER - Create hit area for touch/mouse
 * 
 */
function createHitarea(obj) {
  if (!obj) return;
  var w = 0, h = 0;
  if (obj.image) {
    w = obj.image.naturalWidth || obj.image.width || 0;
    h = obj.image.naturalHeight || obj.image.height || 0;
  } else if (typeof obj.getBounds === 'function' && obj.getBounds()) {
    var bounds = obj.getBounds();
    w = bounds.width || 0;
    h = bounds.height || 0;
  }
  obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, w, h));
}
