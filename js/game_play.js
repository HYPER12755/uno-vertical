function drawPlayerCard(turn){
	gameData.turn.animating = true;
	if ($.players["called" + gameData.player]) {
		$.players["called" + gameData.player].visible = false;
	}

	if($.players[gameData.player]){
		for(var n=0; n<$.players[gameData.player].cards.length; n++){
			var cObj = $.cards[$.players[gameData.player].cards[n]];
			highlightCard(cObj, false);
			if(cObj) toggleCardAction(cObj, false);
		}
	}
	if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
		var drawTop = $.cards[gameData.draw[0]];
		highlightCard(drawTop, false);
		toggleCardAction(drawTop, false);
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
	
	// Pre-set rotation so card doesn't spin wildly during draw
	var initRot = 0;
	if($.players[thisPlayer].dir == 'bottom') initRot = 0;
	else if($.players[thisPlayer].dir == 'top') initRot = 180;
	else if($.players[thisPlayer].dir == 'left') initRot = 90;
	else if($.players[thisPlayer].dir == 'right') initRot = -90;
	thisCard.rotation = initRot;
	
	thisCard.scaleX = 1;
	thisCard.scaleY = 1;
	if(thisCard.shadow){
		thisCard.shadow.x = -(cardW / 2) + (gameSettings.cardShadowX || 5);
		thisCard.shadow.y = 0 + (gameSettings.cardShadowY || 5);
		thisCard.shadow.rotation = initRot;
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
	if(!gameData || !gameData.discard || gameData.discard.length === 0 || typeof $ === 'undefined' || !$.cards) {
		return;
	}
	var discardCardIndex = gameData.discard[gameData.discard.length-1];
	var thisCard = $.cards[discardCardIndex];
	if (!thisCard) return;
	
	gameData.match.type = thisCard.cardType || '';
	if(gameData.excludeMatch && gameData.excludeMatch.indexOf(thisCard.cardType) == -1){
		gameData.match.color = thisCard.cardColor || '';
		gameData.match.value = thisCard.cardValue !== undefined ? thisCard.cardValue : '';
	}

	var frozenColor = gameData.turn ? gameData.turn.frozenColor : false;
	if(gameData.turn && gameData.turn.frozenPick){
		frozenColor = false;
		gameData.turn.frozenPick = false;
		gameData.turn.frozenColor = true;
		if(typeof itemFrozen !== 'undefined' && itemFrozen) itemFrozen.alpha = 1;
		playSound('soundFreeze');
		if(typeof itemFrozen !== 'undefined' && itemFrozen) animateFocus(itemFrozen);
	}

	if(gameData.match.lastColor != gameData.match.color && !frozenColor){
		playSound('soundColor');
		gameData.match.lastColor = gameData.match.color;
		if(typeof itemColors !== 'undefined' && itemColors && typeof itemColors.gotoAndStop === 'function' && gameData.colors){
			var colIdx = gameData.colors.indexOf(gameData.match.color);
			if(colIdx !== -1){
				itemColors.gotoAndStop(colIdx);
				TweenMax.to(itemColors, .2, {scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
					TweenMax.to(itemColors, .2, {scaleX:.7, scaleY:.7, overwrite:true});	
				}});
			}
		}
	}
}
window.getMatchDetail = getMatchDetail;

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display player turn
 * 
 */
function tryAIMove(possibleCardArr){
	// In online multiplayer mode, the authoritative server engine handles all bot moves!
	if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		return;
	}
	if(!gameData.ai){
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
		if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
			postSocketUpdate('wildaction', {card:'passturn'}, false);
		}
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
					if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online && socketData.host) {
						postSocketUpdate('wildaction', {card:'passturn'}, false);
					}
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
	gameData.turn.animating = false;
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
					if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
						postSocketUpdate('wildaction', {card:'passturn'}, false);
					}
					checkRoundEnd();
				}else{
					// Highlight all valid cards to play
					for(var n=0; n<possibleCardArr.length; n++){
						var cObj = $.cards[possibleCardArr[n]];
						if(cObj){
							highlightCard(cObj, true);
							toggleCardAction(cObj, true);
						}
					}

					// Draw pile is always accessible on player turn
					gameData.turn.drawCard = true;
					if(gameData.draw.length > 0){
						var drawTop = $.cards[gameData.draw[0]];
						if(drawTop){
							toggleCardAction(drawTop, true);
							if(possibleCardArr.length === 0){
								highlightCard(drawTop, true);
							}
						}
					}
				}
			}else{
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					// In online mode, server handles all bots and turn progression
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
	if (!$.players[index] || !$.players[index].cards) return [];

	for(var c=0; c<$.players[index].cards.length; c++){
		if(checkMatchCard($.players[index].cards[c])){
			possibleCardArr.push($.players[index].cards[c]);
		}
	}

	return possibleCardArr;
}

function checkMatchCard(cardIndex){
	var thisCard = $.cards[cardIndex];
	if(!thisCard) return false;

	var cType = thisCard.cardType || '';
	var cColor = thisCard.cardColor || '';
	var cVal = thisCard.cardValue !== undefined ? String(thisCard.cardValue) : '';

	if(gameData.turn && gameData.turn.pendingDrawStack > 0){
		var currentPenalty = getDrawValueOfCard(gameData.turn.pendingDrawType || 'draw2');
		var cardPenalty = getDrawValueOfCard(cType);
		if(cardPenalty >= currentPenalty && cardPenalty > 0){
			return true;
		}
		return false;
	}

	// Any wild card is always playable on any color/type
	if(cType.startsWith('wild') || cType === 'wild' || (gameData.wildArr && gameData.wildArr.indexOf(cType) != -1)){
		return true;
	}

	if(gameData.specialArr && gameData.specialArr.indexOf(cType) != -1){
		return true;
	}

	var matchCol = (gameData.match && gameData.match.color) ? gameData.match.color : (gameData.match ? gameData.match.lastColor : '');
	var matchVal = (gameData.match && gameData.match.value !== undefined) ? String(gameData.match.value) : '';
	var matchTyp = (gameData.match && gameData.match.type) ? gameData.match.type : '';

	if(matchCol && cColor && matchCol === cColor){
		return true;
	}
	if(matchVal !== '' && cVal !== '' && matchVal === cVal){
		return true;
	}
	if(matchTyp && cType && matchTyp === cType && cType !== 'number'){
		return true;
	}
	if(gameData.actionArr && gameData.actionArr.indexOf(cType) != -1 && matchTyp === cType){
		return true;
	}

	if(typeof isFlexMode === 'function' && isFlexMode() && gameData.powerCards && gameData.powerCards[gameData.player]){
		if(thisCard.flexColor && thisCard.flexColor === matchCol){
			return true;
		}else if(thisCard.flexType && thisCard.flexType === matchTyp){
			return true;
		}else if(thisCard.flexValue !== '' && thisCard.flexValue !== undefined && matchVal === String(thisCard.flexValue)){
			return true;
		}
	}
	return false;
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
	
	if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		// Online mode is fully authoritative from server
		return;
	}

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
	}else if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		// Server authoritative engine advances turns with server_turn_started!
		return;
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