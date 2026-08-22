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
		} else {
			socketData.online = false;
			gameData.prepared = false;
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
				if ( typeof window.emitServerAction === 'function' && socketData.online) {
					window.emitServerAction('player_choose_color', { color: chosenColor });
				}
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
		gameData.fourcolors.special = (mKey === 'special');
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

function showGameStatus(con){
	var delayStart = 0;
	var delayMessage = 1;
	var soundName = "soundAlert";
	statusPlayerTxt.text = ($.players && $.players["stats" + gameData.player] && $.players["stats" + gameData.player].playerName) ? $.players["stats" + gameData.player].playerName.text : '';
	if(typeof statusIconContainer !== 'undefined' && statusIconContainer && statusIconContainer.removeAllChildren){
		statusIconContainer.removeAllChildren();
	}
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

	if(cardIconName && typeof statusIconContainer !== 'undefined' && statusIconContainer){
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

