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

	if (socketData.online && gameData.prepared) {
		return;
	}

	prepareCards();

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
