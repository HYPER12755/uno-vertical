function nextPlayerTurn(next){
	if (gameData.turn.skipEveryone) {
		gameData.turn.skipEveryone = false;
		displayPlayerTurn();
		return;
	}

	if(next){
		//if(gameData.turn.lastCardType != 'devildeal'){
			gameData.player = findNextPlayer(gameData.player);
		//}
		gameData.turn.lastCardType = '';
	}

	if(gameData.turn.frozenColor && gameData.player == gameData.turn.frozenReset){
		itemFrozen.alpha = 0;
		gameData.turn.frozenColor = false;
	}

	if(!$.players[gameData.player] || !$.players[gameData.player].active){
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.skip){
		gameData.turn.skip = false;
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.reverseTurn){
		gameData.turn.reverseCount--;
		if(gameData.players == 2){

		}
		gameData.turn.reverse = gameData.turn.reverse == true ? false : true;
		gameData.turn.reverseTurn = false;
		toggleArrowTurn();
		nextPlayerTurn(true);
		return;
	}else if(gameData.turn.reverseCount > 0){
		gameData.turn.reverseCount--;
		nextPlayerTurn(true);
		return;
	}

	displayPlayerTurn();
}

function findNextPlayer(nextPlayer){
	if(!gameData.turn.reverse){
		nextPlayer++;
		nextPlayer = nextPlayer > gameData.players-1 ? 0 : nextPlayer;
	}else{
		nextPlayer--;
		nextPlayer = nextPlayer < 0 ? gameData.players-1 : nextPlayer;
	}
	return nextPlayer;
}

function togglePlayerSkip(con, next){
	var skipPlayer = gameData.player;
	if(con){
		if(gameData.match.count != 0 && next){
			skipPlayer = findNextPlayer(gameData.player);
		}
	}else{
		skipPlayer = -1;
	}

	for(var n=0; n<gameData.players; n++){
		$.players["skip" + n].visible = false;
		$.players["call"+n].alpha = 1;
		$.players["called"+n].alpha = 1;

		if(skipPlayer == n){
			$.players["skip" + n].visible = true;
			$.players["call"+n].alpha = 0;
			$.players["called"+n].alpha = 0;
		}
	}
}

function toggleArrowTurn(){
	for(var n=0; n<gameData.players; n++){
		$.players["arrow" + n].itemArrowL.visible = false;
		$.players["arrow" + n].itemArrowR.visible = false;
		if(!gameData.turn.reverse){
			$.players["arrow" + n].itemArrowL.rotation = -90;
			$.players["arrow" + n].itemArrowL.visible = true;
			TweenMax.to($.players["arrow" + n].itemArrowL, .5, {rotation:0, overwrite:true});
			playSound('soundDirection');
		}else{
			$.players["arrow" + n].itemArrowR.rotation = 180;
			$.players["arrow" + n].itemArrowR.visible = true;
			TweenMax.to($.players["arrow" + n].itemArrowR, .5, {rotation:90, overwrite:true});
			playSound('soundDirectionReverse');
		}
	}
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		for(var n=0; n<gameData.cards.length; n++){
			var thisCard = gameData.cards[n];
			thisCard.highlight.x = thisCard.x;
			thisCard.highlight.y = thisCard.y;
			thisCard.highlight.rotation = thisCard.rotation;
			thisCard.eliminated.x = thisCard.x;
			thisCard.eliminated.y = thisCard.y;
			thisCard.eliminated.rotation = thisCard.rotation;

			thisCard.shadow.x = thisCard.x + gameSettings.cardShadowX;
			thisCard.shadow.y = thisCard.y + gameSettings.cardShadowY;
			thisCard.shadow.rotation = thisCard.rotation;
			thisCard.shadow.visible = thisCard.visible;
		}
	}
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */