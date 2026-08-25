/*!
 * 
 * PREPARE PLAYERS - This is the function that runs to prepare players
 * 
 */
function preparePlayers(){
	if(!cardsPlayersContainer){ return; } // canvas not built yet (asset load race)
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

		var newPlayerPing = new createjs.Text();
		newPlayerPing.font = "14px bpreplaybold";
		newPlayerPing.color = "#2ecc71";
		newPlayerPing.textAlign = "left";
		newPlayerPing.textBaseline='middle';
		newPlayerPing.text = "";
		newPlayerPing.y = 20; // Position below name

		$.players["stats" + n].playerLine = newPlayerLine;
		$.players["stats" + n].playerName = newPlayerName;
		$.players["stats" + n].playerScore = newPlayerScore;
		$.players["stats" + n].playerPing = newPlayerPing;
		$.players["stats" + n].visible = false;
		$.players["stats" + n].addChild(newPlayerLine, newPlayerName, newPlayerScore, newPlayerPing);

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
				if ( typeof window.emitServerAction === 'function' && socketData.online) {
					window.emitServerAction('player_call_uno', {});
				}
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('called', socketData.gameIndex, true);
				}
				if (typeof window.forceFlushOutgoingEvents === 'function') {
					window.forceFlushOutgoingEvents();
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
				if ( typeof window.emitServerAction === 'function' && socketData.online) {
					window.emitServerAction('player_target_aim', { targetIndex: evt.target.playerIndex });
				}
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('targetaim', evt.target.playerIndex, false);
				}
				if (typeof window.forceFlushOutgoingEvents === 'function') {
					window.forceFlushOutgoingEvents();
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

	// Pre-set rotation so card doesn't spin wildly during the deal animation
	var initRot = 0;
	if($.players[thisPlayer].dir == 'bottom') initRot = 0;
	else if($.players[thisPlayer].dir == 'top') initRot = 180;
	else if($.players[thisPlayer].dir == 'left') initRot = 90;
	else if($.players[thisPlayer].dir == 'right') initRot = -90;
	thisCard.rotation = initRot;
	thisCard.x = 0;
	thisCard.y = 0;

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
	if(!$.players[index]) return { horizontal: true, x: 0, y: 0, startX: 0, startY: 0, w: 0, h: 0, gap: 0, totalCards: 0, maxScroll: 0, viewW: 0 };
	var horizontal = $.players[index].horizontal;
	var dir = $.players[index].dir;
	var pt = cardsPlayContainer.globalToLocal($.players[index].x, $.players[index].y);

	var pos = {
		horizontal: horizontal,
		dir: dir,
		x: 0,
		y: 0,
		startX: 0,
		startY: 0,
		w: 0,
		h: 0,
		gap: 0,
		totalCards: 0,
		maxScroll: 0,
		scrollX: 0,
		viewW: 0
	};

	for(var p=0; p<$.players[index].cards.length; p++){
		var thisCard = $.cards[$.players[index].cards[p]];
		if(thisCard && thisCard.cardDeal){
			pos.totalCards++;
		}
	}

	var cardCountForSpacing = Math.max(pos.totalCards - 1, 0);

	if(dir === 'bottom'){
		// Human player hand at bottom: slidable/scrollable with clear, comfortable spacing
		var cardSpacing = viewport.isLandscape ? 56 : 48;
		pos.gap = cardSpacing;
		pos.w = cardCountForSpacing * cardSpacing;

		var viewW = viewport.isLandscape ? Math.min(canvasW - 220, 820) : Math.min(canvasW - 40, 520);
		pos.viewW = viewW;
		pos.maxScroll = Math.max(0, pos.w - viewW);

		if(typeof gameData.handScrollX !== 'number') gameData.handScrollX = 0;
		if(gameData.handScrollX > pos.maxScroll) gameData.handScrollX = pos.maxScroll;
		if(gameData.handScrollX < 0) gameData.handScrollX = 0;
		pos.scrollX = gameData.handScrollX;

		var visibleWidth = Math.min(pos.w, viewW);
		pos.startX = pt.x - (visibleWidth / 2);
		pos.x = pos.startX - pos.scrollX;
		pos.y = pos.startY = pt.y;

	}else if(dir === 'top'){
		// Top opponent: tightly stacked horizontally (max width 240px, tight gap), just like left/right bots!
		var topMaxW = viewport.isLandscape ? 240 : 200;
		var topSpace = 20;
		pos.w = cardCountForSpacing * topSpace;
		pos.gap = topSpace;

		if(cardCountForSpacing > 0 && pos.w > topMaxW){
			pos.w = topMaxW;
			pos.gap = topMaxW / cardCountForSpacing;
		}

		pos.x = pos.startX = pt.x - (pos.w / 2);
		pos.y = pos.startY = pt.y;

	}else{
		// Left and right opponents (vertical): tightly stacked vertically
		var vertMaxH = viewport.isLandscape ? 260 : 220;
		var vertSpace = 22;
		pos.h = cardCountForSpacing * vertSpace;
		pos.gap = vertSpace;

		if(cardCountForSpacing > 0 && pos.h > vertMaxH){
			pos.h = vertMaxH;
			pos.gap = vertMaxH / cardCountForSpacing;
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
				if(cObj) {
					highlightCard(cObj, false);
					toggleCardAction(cObj, false);
				}
			}
		}
		if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
			var drawTop = $.cards[gameData.draw[0]];
			highlightCard(drawTop, false);
			toggleCardAction(drawTop, false);
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

			if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && !socketData.host) {
				return;
			}

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
		if (gameData.lastPlayerIndex != undefined && $.players["target"+gameData.lastPlayerIndex]) {
			$.players["target"+gameData.lastPlayerIndex].visible = false;
			$.players["call"+gameData.lastPlayerIndex].alpha = 1;
			$.players["called"+gameData.lastPlayerIndex].alpha = 1;
		}
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

	$.players["stats" + index].playerName.y = $.players["stats" + index].playerScore.y = -12; if($.players["stats" + index].playerPing) { $.players["stats" + index].playerPing.y = 8; $.players["stats" + index].playerPing.x = -150; }
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
		$.players["stats" + index].playerName.y = $.players["stats" + index].playerScore.y = 16; if($.players["stats" + index].playerPing) { $.players["stats" + index].playerPing.y = -4; $.players["stats" + index].playerPing.x = 150; $.players["stats" + index].playerPing.textAlign = "right"; }
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
