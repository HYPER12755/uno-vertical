/*!
 * 
 * BUILD CARDS - This is the function that runs to build cards
 * 
 */
function buildCards(){
	cardsPlayContainer.removeAllChildren();

	gameData.actionArr = [];
	gameData.wildArr = [];
	gameData.specialArr = [];
	gameData.excludeMatch = [];
	gameData.excludeFirst = [];
	gameData.cards = [];
	gameData.cardNum = 0;

	if (isAttackMode()) {
		buildAttackDeck();
	} else if (isAllWildMode()) {
		buildAllWildDeck();
	} else if (isFlexMode()) {
		buildFlexDeck();
	} else if (isFlipMode()) {
		buildFlipDeck();
	} else if (isNoMercyMode()) {
		buildNoMercyDeck();
	} else if (isSpecialMode()) {
		buildSpecialDeck();
	} else {
		buildClassicDeck();
	}

	gameData.actionArr = removeDuplicates(gameData.actionArr);
	gameData.wildArr = removeDuplicates(gameData.wildArr);
	gameData.specialArr = removeDuplicates(gameData.specialArr);
	gameData.excludeMatch = removeDuplicates(gameData.excludeMatch);
	gameData.excludeFirst = removeDuplicates(gameData.excludeFirst);
}

/*!
 * 
 * PREPARE CARDS - This is the function that runs to prepare cards
 * 
 */
function prepareCards(){
	gameData.prepared = false;
	gameData.complete = false;

	gameData.draw = [];
	gameData.discard = [];
	gameData.seq = [];
	gameData.cardIndex = 0;
	gameData.deal = {
		status:false,
		animation:false,
		cards:[],
		cardIndex:0,
	}
	gameData.flipSide = 'light';
	gameData.powerCards = [true, true, true, true];
	gameData.match = {
		count:0,
		type:'',
		color:'',
		lastColor:'',
		value:'',
		active:true
	}
	gameData.loopColors = {
		possible:[],
		color:0,
		index:0,
		round:0,
		roundMax:2
	}
	gameData.turn = {
		action:false,
		animating:false,
		reverse:false,
		reverseTurn:false,
		reverseCount:0,
		skip:false,
		highlight:false,
		played:false,
		pickColors:false,
		drawCount:0,
		drawCards:0,
		drawCardsTotal:0,
		drawCardsCount:0,
		drawCard:false,
		loseTurn:false,
		continuePlay:false,
		penalty:false,
		penaltyCards:0,
		revealCard:false,
		targetPlayerAim:false,
		targetPlayer:false,
		targetDrawCards:0,
		targetDrawCard:false,
		giveCards:0,
		giveCard:false,
		removePlayer:false,
		frozenPick:false,
		frozenColor:false,
		frozenReset:-1,
		frozenSkip:false,
		addPoints:0,
		lastCardType:'',
		shuffle:false,
		playerCards:[],
		swap:false,
		queue:[],
		pendingDrawStack:0,
		pendingDrawType:'',
		skipEveryone:false,
		isRoulette:false,
		isWildDrawColor:false
	}

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
	playSound("soundCardShuffle");
	buildCards();
	
	//26 wild card
	//23 reverse
	//22 draw
	//skip
	//var cardArr = [91,29,34,36,48,24,74,51,49,55,61,21,16,1,27,23,19,22,103,84,107,119,118,117,113,115,116,110,6,18,3,0,111,112,9,109,108,98,114,89,13,57,53,2,72,105,25,44,99,60,41,102,69,64,26,90,66,67,81,101,88,11,38,31,40,8,83,43,33,82,12,5,62,42,92,37,50,70,93,17,7,56,63,100,97,106,73,46,71,76,96,75,58,10,104,78,86,15,77,65,4,32,54,28,80,95,52,30,47,85,39,14,45,59,68,20,94,35,87,79];
	//gameData.cards = [];

	//for(var n=0; n<cardArr.length; n++){
		//gameData.cards.push($.cards[cardArr[n]]);
	//}
	shuffle(gameData.cards);
}

function createCard(name, color){
	$.cards['front'+gameData.cardNum] = new createjs.Container();
	$.cards['content'+gameData.cardNum] = new createjs.Container();
	$.cards[gameData.cardNum] = new createjs.Container();
	$.cards[gameData.cardNum].frontContainer = $.cards['front'+gameData.cardNum]
	$.cards[gameData.cardNum].contentContainer = $.cards['content'+gameData.cardNum]
	$.cards[gameData.cardNum].contentContainer.visible = false;
	$.cards[gameData.cardNum].addChild($.cards[gameData.cardNum].frontContainer, $.cards[gameData.cardNum].contentContainer);
	$.cards[gameData.cardNum].cardIndex = gameData.cardNum;
	$.cards[gameData.cardNum].cardDeal = false;

	var cW = gameSettings.cardW || 100;
	var cH = gameSettings.cardH || 150;
	var hitShape = new createjs.Shape();
	hitShape.graphics.beginFill("#000").drawRect(-cW/2, -cH/2, cW, cH);
	$.cards[gameData.cardNum].hitArea = hitShape;
	$.cards[gameData.cardNum].mouseChildren = false;
	$.cards[gameData.cardNum].cursor = 'pointer';

	$.cards[gameData.cardNum].addEventListener("click", function(evt) {
		var targetCard = evt.currentTarget || $.cards[this.cardIndex];
		var cardIdx = (targetCard && targetCard.cardIndex !== undefined) ? targetCard.cardIndex : this.cardIndex;

		if(gameData.turn.animating || gameData.turn.played || colorsContainer.visible || gameData.turn.pickColors || !gameData.turn.action){
			return;
		}

		var proceedClick = checkIsPlayer(gameData.player);
		if(!proceedClick){
			// Check for Jump-In (exact identical color and value/type played out of turn)
			if(!colorsContainer.visible && !gameData.turn.pickColors && !gameData.turn.animating && gameSettings.houseRules && gameSettings.houseRules.jumpIn && gameData.discard.length > 0 && targetCard && targetCard.cardDeal){
				for(var p = 0; p < gameData.players; p++){
					if(checkIsPlayer(p) && p !== gameData.player && $.players[p] && $.players[p].cards.indexOf(cardIdx) !== -1){
						var topDiscard = $.cards[gameData.discard[gameData.discard.length - 1]];
						if(topDiscard && targetCard.cardColor === topDiscard.cardColor && String(targetCard.cardValue) === String(topDiscard.cardValue) && targetCard.cardColor !== ''){
							gameData.player = p;
							showGameStatus('jump_in');
							if ( typeof window.emitServerAction === 'function' && socketData.online) {
								window.emitServerAction('player_jump_in', { cardId: cardIdx });
							}
							if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
								postSocketUpdate('wildaction', {card:'jumpin', player:p, cardData:cardIdx}, false);
							}
							discardPlayerCard(cardIdx, false);
							return;
						}
					}
				}
			}
			return;
		}

		// 1. Giving card mode (devil deal / charity)
		if(gameData.turn.giveCard){
			if($.players[gameData.player] && $.players[gameData.player].cards.indexOf(cardIdx) !== -1){
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'givecard', cardData:cardIdx}, false);
				}
				giveCardToPlayer(cardIdx);
			}
			return;
		}

		// 2. Clicking the DRAW pile (only the top card of the draw pile)
		var isDrawPileCard = (gameData.draw.length > 0 && cardIdx === gameData.draw[0]);
		if(isDrawPileCard){
			if (gameData.turn.pendingDrawStack > 0) {
				var stackToDraw = gameData.turn.pendingDrawStack;
				gameData.turn.pendingDrawStack = 0;
				gameData.turn.pendingDrawType = '';
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = stackToDraw;
				gameData.turn.drawCardsCount = 0;
				gameData.turn.loseTurn = true;
				if ( typeof window.emitServerAction === 'function' && socketData.online) {
					window.emitServerAction('player_stack_surrender', {});
					return;
				}
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'stackdraw', cardData:stackToDraw}, false);
				}
				drawPlayerCard(true);
				return;
			}

			// If player already drew a card this turn (drawCount >= 1), clicking the deck again passes the turn
			if (gameData.turn.drawCount >= 1) {
				gameData.turn.drawCard = false;
				gameData.match.active = false;
				if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'passturn'}, false);
				}
				checkRoundEnd();
				return;
			}

			// Only allow 1 manual draw per turn
			if(gameData.turn.drawCount < 1 && (gameData.turn.drawCard || !gameData.turn.played)){
				gameData.turn.drawCount++;
				if ( typeof window.emitServerAction === 'function' && socketData.online) {
					gameData.turn.action = false;
					window.emitServerAction('player_draw_card', {});
					return;
				}
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('wildaction', {card:'drawplayercard', cardData:gameData.turn.drawCount}, false);
				}
				drawPlayerCard(false);
			}
			return;
		}

		// 3. Playing a card from player's hand
		var isCardInHand = ($.players[gameData.player] && $.players[gameData.player].cards.indexOf(cardIdx) !== -1);
		if(isCardInHand && targetCard.cardDeal){
			var serverCardId = (targetCard.serverId !== undefined) ? targetCard.serverId : cardIdx;
			var isOnline = (window.socketData && window.socketData.online) || (typeof socketData !== 'undefined' && socketData.online);
			var canPlay = false;
			if(isOnline){
				if(gameData.turn.playableCardIds && gameData.turn.playableCardIds.length > 0){
					canPlay = (gameData.turn.playableCardIds.indexOf(serverCardId) !== -1) || (gameData.turn.playableCardIds.indexOf(cardIdx) !== -1);
				}else{
					canPlay = checkMatchCard(cardIdx);
				}
			}else{
				canPlay = checkMatchCard(cardIdx);
			}

			if(canPlay){
				if ( typeof window.emitServerAction === 'function' && isOnline) {
					gameData.turn.action = false;
					window.emitServerAction('player_play_card', { cardId: serverCardId, cardIndex: cardIdx, type: targetCard.cardType, color: targetCard.cardColor, value: targetCard.cardValue });
					return;
				}
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && isOnline) {
					postSocketUpdate('wildaction', {card:'discardplayercard', cardData:cardIdx}, false);
					return;
				}
				discardPlayerCard(cardIdx, false);
			}
			return;
		}
	});

	var bgCover = new createjs.Bitmap(loader.getResult('cardCover'+gameData.themeIndex));
	centerReg(bgCover);
	$.cards[gameData.cardNum].frontContainer.addChild(bgCover);

	if(color != ''){
		var bgBack = new createjs.Bitmap(loader.getResult('cardBg'+gameData.themeIndex+'_'+color));
		centerReg(bgBack);
		$.cards[gameData.cardNum].contentContainer.addChild(bgBack);
	}
	
	var bgContent = new createjs.Bitmap(loader.getResult(name));
	centerReg(bgContent);
	$.cards[gameData.cardNum].contentContainer.addChild(bgContent);

	$.cards['highlight'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardHighlight'+gameData.themeIndex));
	centerReg($.cards['highlight'+gameData.cardNum]);
	$.cards['eliminated'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardEliminated'+gameData.themeIndex));
	centerReg($.cards['eliminated'+gameData.cardNum]);
	$.cards['shadow'+gameData.cardNum] = new createjs.Bitmap(loader.getResult('cardShadow'+gameData.themeIndex));
	centerReg($.cards['shadow'+gameData.cardNum]);

	// Avoid mouse event interception
	$.cards['highlight'+gameData.cardNum].mouseEnabled = false;
	$.cards['eliminated'+gameData.cardNum].mouseEnabled = false;
	$.cards['shadow'+gameData.cardNum].mouseEnabled = false;
	$.cards['highlight'+gameData.cardNum].visible = false;
	$.cards['eliminated'+gameData.cardNum].visible = false;

	$.cards[gameData.cardNum].highlight = $.cards['highlight'+gameData.cardNum];
	$.cards[gameData.cardNum].eliminated = $.cards['eliminated'+gameData.cardNum];
	$.cards[gameData.cardNum].shadow = $.cards['shadow'+gameData.cardNum];

	var returnCard = $.cards[gameData.cardNum];
	cardsPlayContainer.addChild($.cards['shadow'+gameData.cardNum], $.cards[gameData.cardNum], $.cards['highlight'+gameData.cardNum], $.cards['eliminated'+gameData.cardNum]);
	gameData.cards.push($.cards[gameData.cardNum]);
	gameData.cardNum++;

	return returnCard;
}

function toggleCardAction(card, con){
	if(con){
		card.cursor = 'pointer';
	}else{
		card.cursor = null;
	}
}

function highlightCard(card, con){
	if(!card) return;
	if(con){
		if(card.highlight){
			card.highlight.x = card.x;
			card.highlight.y = card.y;
			card.highlight.rotation = card.rotation;
			card.highlight.visible = true;
			animateBlink(card.highlight);
		}
	}else{
		if(card.highlight){
			card.highlight.visible = false;
			killAnimateBlink(card.highlight);
		}
	}
}

function discardPlayerCard(cardIndex, flip){
	gameData.match.active = false;
	gameData.turn.animating = true;
	gameData.turn.played = true;
	gameData.match.count++;
	var playerCardIndex = $.players[gameData.player].cards.indexOf(cardIndex);

	for(var n=0; n<$.players[gameData.player].cards.length; n++){
		var cObj = $.cards[$.players[gameData.player].cards[n]];
		highlightCard(cObj, false);
		if(cObj) toggleCardAction(cObj, false);
	}
	if(gameData.draw.length > 0 && $.cards[gameData.draw[0]]){
		var drawTop = $.cards[gameData.draw[0]];
		highlightCard(drawTop, false);
		toggleCardAction(drawTop, false);
	}
	if(playerCardIndex !== -1){
		$.players[gameData.player].cards.splice(playerCardIndex, 1);
	}
	positionPlayerCards(gameData.player, true);

	showDiscardCard(cardIndex, flip);
}

function flipCard(card){
	playSound('soundCardFlip');
	card.contentContainer.visible = true;
	card.contentContainer.scaleX = 0;

	var flipSpeed = gameSettings.cardFlipSpeed;
	TweenMax.to(card.frontContainer, flipSpeed, {scaleX:0});
	TweenMax.to(card.contentContainer, flipSpeed, {delay:flipSpeed, scaleX:1});
	TweenMax.to(card.shadow, flipSpeed, {scaleX:0});
	TweenMax.to(card.shadow, flipSpeed, {delay:flipSpeed, scaleX:1});
}

function flipCardCover(card){
	playSound('soundCardFlip');
	card.frontContainer.visible = true;
	card.frontContainer.scaleX = 0;

	var flipSpeed = gameSettings.cardFlipSpeed;
	TweenMax.to(card.contentContainer, flipSpeed, {scaleX:0});
	TweenMax.to(card.frontContainer, flipSpeed, {delay:flipSpeed, scaleX:1});
	TweenMax.to(card.shadow, flipSpeed, {scaleX:0});
	TweenMax.to(card.shadow, flipSpeed, {delay:flipSpeed, scaleX:1});
}

function recycleDiscardPile(){
	if(gameData.discard.length > 1){
		var topCard = gameData.discard[gameData.discard.length - 1];
		var cardsToRecycle = gameData.discard.slice(0, gameData.discard.length - 1);
		gameData.discard = [topCard];
		for(var i = 0; i < cardsToRecycle.length; i++){
			var cIdx = cardsToRecycle[i];
			var cObj = $.cards[cIdx];
			if(cObj){
				cObj.cardDeal = false;
				cObj.frontContainer.visible = true;
				cObj.frontContainer.scaleX = 1;
				cObj.contentContainer.visible = false;
				cObj.contentContainer.scaleX = 0;
				cObj.visible = false;
			}
			gameData.draw.push(cIdx);
		}
		shuffle(gameData.draw);
	}
}

/*!
 * 
 * SHOW DRAW CARD - This is the function that runs to show draw card
 * 
 */
function showDrawCard(pileCard){
	if(gameData.draw.length === 0){
		recycleDiscardPile();
	}

	if(gameData.draw.length > 0){
		var cardW = gameSettings.cardW;
		var cardSpeed = gameSettings.cardMoveSpeed;
		var cardIndex = gameData.draw[0];
		if(pileCard){
			gameData.draw.splice(0,1);
		}

		for(var d=0; d<gameData.draw.length; d++){
			var thisCard = $.cards[gameData.draw[d]];
			if(!thisCard) continue;
			if(d == 0){
				thisCard.frontContainer.scaleX = 1;
				thisCard.frontContainer.visible = true;
				thisCard.contentContainer.visible = false;
				thisCard.visible = true;
				setCardDepth(thisCard);
			}else{
				thisCard.visible = false;
			}
			TweenMax.to(thisCard, cardSpeed, {x:-(cardW/2), y:0, rotation:0, overwrite:true});
		}

		if(pileCard){
			showDiscardCard(cardIndex, true);
		}else{
			if(gameData.discard.length > 0){
				var discardCardIndex = gameData.discard[gameData.discard.length-1];
				var thisCard = $.cards[discardCardIndex];
				if(thisCard) setCardDepth(thisCard);
			}
		}
	}else{
		recycleDiscardPile();
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('shuffledrawcards', socketData.gameIndex);
		}else{
			if(gameData.draw.length > 0){
				showDrawCard(pileCard);
			}
		}
	}
}

function setCardDepth(thisCard){
	if(!thisCard) return;
	if(thisCard.shadow && cardsPlayContainer.contains(thisCard.shadow)){
		cardsPlayContainer.setChildIndex(thisCard.shadow, cardsPlayContainer.numChildren-1);
	}
	if(cardsPlayContainer.contains(thisCard)){
		cardsPlayContainer.setChildIndex(thisCard, cardsPlayContainer.numChildren-1);
	}
	if(thisCard.highlight && cardsPlayContainer.contains(thisCard.highlight)){
		cardsPlayContainer.setChildIndex(thisCard.highlight, cardsPlayContainer.numChildren-1);
	}
	if(thisCard.eliminated && cardsPlayContainer.contains(thisCard.eliminated)){
		cardsPlayContainer.setChildIndex(thisCard.eliminated, cardsPlayContainer.numChildren-1);
	}
}

function showDiscardCard(cardIndex, flip){
	var cardW = gameSettings.cardW;
	var cardSpeed = gameSettings.cardMoveSpeed;

	gameData.discard.push(cardIndex);
	var discardCardIndex = gameData.discard[gameData.discard.length-1];
	var thisCard = $.cards[discardCardIndex];
	if(thisCard){
		thisCard.cardDeal = false;
		toggleCardAction(thisCard, false);
		setCardDepth(thisCard);

		if(flip || !thisCard.contentContainer.visible || thisCard.contentContainer.scaleX === 0){
			flipCard(thisCard);
		}
		playSound('soundCardDeal');
		TweenMax.to(thisCard, cardSpeed, {x:(cardW/2), y:0, rotation:0, overwrite:true, onComplete:showDiscardCardComplete, onCompleteParams:[thisCard]});
	}
	getMatchDetail();
}

function getMatchDetail(){
	if(gameData && gameData.discard && gameData.discard.length > 0 && typeof $ !== 'undefined' && $.cards){
		var discardCardIndex = gameData.discard[gameData.discard.length - 1];
		var topCard = $.cards[discardCardIndex];
		if(topCard){
			gameData.match.type = topCard.cardType || '';
			gameData.match.color = topCard.cardColor || '';
			gameData.match.value = topCard.cardValue !== undefined ? topCard.cardValue : '';
			if(topCard.cardColor && topCard.cardColor !== ''){
				gameData.match.lastColor = topCard.cardColor;
			}
		}
	}
}
window.getMatchDetail = getMatchDetail;

function showDiscardCardComplete(thisCard){
	if(!thisCard && gameData.discard && gameData.discard.length > 0 && typeof $ !== 'undefined' && $.cards){
		var lastDiscardIndex = gameData.discard[gameData.discard.length - 1];
		thisCard = $.cards[lastDiscardIndex];
	}
	var cardType = thisCard ? (thisCard.cardType || '') : '';
	var proceedCheck = true;
	if(gameData.match.count == 0){
		//begin
		for(var n=0; n<gameData.players; n++){
			if($.players["stats" + n]) $.players["stats" + n].visible = true;
			if($.players["arrow" + n]) $.players["arrow" + n].visible = true;
		}

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if($.players["call" + socketData.gameIndex]) $.players["call" + socketData.gameIndex].visible = true;
		}else{
			if($.players["call" + 0]) $.players["call" + 0].visible = true;
		}
		if(typeof itemColors !== 'undefined' && itemColors) itemColors.alpha = 1;

		if(cardType && gameData.excludeFirst && gameData.excludeFirst.indexOf(cardType) != -1){
			proceedCheck = false;
			showDrawCard(true);
		}else{
			toggleArrowTurn();
			displayPlayerTurn();	
		}
	}

	if(proceedCheck){
		checkDiscardCard(cardType);
	}
}

function checkDiscardCard(cardType){
	gameData.turn.lastCardType = cardType;
	gameData.turn.drawCardsTotal = 0;
	if (typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		// Online mode is fully authoritative from server
		return;
	}
	if($.players[gameData.player].cards.length == 0){
		//end
		highlightPlayer(false);
		showGameStatus("emptycards");
	}else if(gameData.activePlayers == 1){
		//end
		highlightPlayer(false);
		showGameStatus("nomoreplayers");
	}else if(isAttackMode()){
		// --- UNO ATTACK DISPATCHER ---
		if(cardType == "hit2"){
			var victim = findNextPlayer(gameData.player);
			triggerAttackLauncher(victim, 2);
		}else if(cardType == "wildattack"){
			gameData.turn.pickColors = true;
			var victim = findNextPlayer(gameData.player);
			triggerAttackLauncher(victim, 2);
		}else if(cardType == "discardall"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var dumpColor = (topCard ? topCard.cardColor : gameData.match.color);
			executeDiscardAll(gameData.player, dumpColor);
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else{
			checkRoundEnd();
		}
	}else if(isAllWildMode()){
		// --- UNO ALL WILD DISPATCHER ---
		if(cardType == "wildreverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus('reverse');
		}else if(cardType == "wildskip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus('skip');
		}else if(cardType == "wildskipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus('skipeveryone');
		}else if(cardType == "wilddraw2"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}else if(cardType == "wilddraw4"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
			showGameStatus(cardType);
		}else if(cardType == "wildtargeteddraw2"){
			gameData.turn.targetPlayerAim = true;
			var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
			gameData.turn.queue.push(nextAction);
			showGameStatus('targeteddraw2');
		}else if(cardType == "wildswap"){
			gameData.turn.swap = true;
			gameData.turn.targetPlayerAim = true;
			showGameStatus('seven_swap');
		}else{
			checkRoundEnd();
		}
	}else if(isFlexMode()){
		// --- UNO FLEX DISPATCHER ---
		var discardCardIndex = gameData.discard[gameData.discard.length - 1];
		var topCard = $.cards[discardCardIndex];

		if(cardType == "flexdraw2"){
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				forceAllOtherPlayersDraw(gameData.player, 1);
				showGameStatus('flex_draw1_all');
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
				showGameStatus('draw2');
			}
		}else if(cardType == "flexskip"){
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				gameData.turn.skipEveryone = true;
				showGameStatus('skipeveryone');
			} else {
				gameData.turn.skip = true;
				togglePlayerSkip(true, true);
				showGameStatus('skip');
			}
		}else if(cardType == "flexdraw4"){
			gameData.turn.pickColors = true;
			if(gameData.powerCards && gameData.powerCards[gameData.player]){
				gameData.powerCards[gameData.player] = false;
				gameData.turn.targetPlayerAim = true;
				var nextAction = {action:'draw4', data:[{obj:'targetDrawCards', value:4}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
				gameData.turn.queue.push(nextAction);
				showGameStatus('targeteddraw4');
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
				showGameStatus('draw4');
			}
		}else if(cardType == "flexwildalldraw"){
			gameData.turn.pickColors = true;
			forceAllOtherPlayersDraw(gameData.player, 2);
			showGameStatus('flex_wildalldraw');
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else if(cardType == "flexnumber" || cardType == "number"){
			if(topCard && topCard.isPowerFlip && gameData.powerCards){
				gameData.powerCards[gameData.player] = true;
				showGameStatus('power_recharged');
			} else {
				checkRoundEnd();
			}
		}else{
			checkRoundEnd();
		}
	}else if(isFlipMode()){
		// --- UNO FLIP! DISPATCHER ---
		if(cardType == "flip"){
			executeFlip();
		}else if(cardType == "draw1"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 1;
			showGameStatus(cardType);
		}else if(cardType == "draw5"){
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 5;
			showGameStatus(cardType);
		}else if(cardType == "darkskipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus('skipeveryone');
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "wilddraw2"){
			gameData.turn.pickColors = true;
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}else if(cardType == "wilddrawcolor"){
			gameData.turn.pickColors = true;
			gameData.turn.isWildDrawColor = true;
			showGameStatus(cardType);
		}else if(cardType == "wild" || cardType == "darkwild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else{
			checkRoundEnd();
		}
	}else if(isNoMercyMode()){
		// --- UNO SHOW 'EM NO MERCY DISPATCHER ---
		if(cardType == "draw2" || cardType == "draw4" || cardType == "wilddraw6" || cardType == "wilddraw10" || cardType == "wildreversdraw4" || cardType == "wilddraw4"){
			var dVal = getDrawValueOfCard(cardType);
			var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
			
			if (isStackingEnabled) {
				gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + dVal;
				gameData.turn.pendingDrawType = cardType;
			} else {
				gameData.turn.drawCards = gameData.turn.drawCardsTotal = dVal;
			}

			if(cardType.indexOf('wild') !== -1 || cardType === 'wilddraw4'){
				gameData.turn.pickColors = true;
			}
			if(cardType === 'wildreversdraw4'){
				gameData.turn.reverseTurn = true;
				gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			}
			showGameStatus(isStackingEnabled ? 'drawstack' : cardType);
		}else if(cardType == "reverse"){
			gameData.turn.reverseTurn = true;
			gameData.turn.reverseCount = (gameData.activePlayers == 2 ? 1 : 2);
			showGameStatus(cardType);
		}else if(cardType == "skip"){
			gameData.turn.skip = true;
			togglePlayerSkip(true, true);
			showGameStatus(cardType);
		}else if(cardType == "skipeveryone"){
			gameData.turn.skipEveryone = true;
			showGameStatus(cardType);
		}else if(cardType == "discardall"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var dumpColor = (topCard ? topCard.cardColor : gameData.match.color);
			executeDiscardAll(gameData.player, dumpColor);
		}else if(cardType == "wildcolorroulette"){
			gameData.turn.pickColors = true;
			gameData.turn.isRoulette = true;
			showGameStatus(cardType);
		}else if(cardType == "wild"){
			gameData.turn.pickColors = true;
			showGameStatus(cardType);
		}else if(cardType == "number"){
			var topCard = $.cards[gameData.discard[gameData.discard.length - 1]];
			var isSwap70Enabled = (gameSettings.houseRules && gameSettings.houseRules.swap70 !== false);
			if(isSwap70Enabled && topCard && (topCard.cardValue === 7 || topCard.isNoMercy7)){
				gameData.turn.swap = true;
				gameData.turn.targetPlayerAim = true;
				showGameStatus('seven_swap');
			}else if(isSwap70Enabled && topCard && (topCard.cardValue === 0 || topCard.isNoMercy0)){
				passZeroAllHands();
				checkRoundEnd();
			}else{
				checkRoundEnd();
			}
		}else{
			checkRoundEnd();
		}
	}else if(cardType == "draw2"){
		var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
		if (isStackingEnabled) {
			gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + 2;
			gameData.turn.pendingDrawType = 'draw2';
			showGameStatus('drawstack');
		} else {
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 2;
			showGameStatus(cardType);
		}
	}else if(cardType == "draw3"){
		gameData.turn.drawCards = gameData.turn.drawCardsTotal = 3;
		showGameStatus(cardType);
	}else if(cardType == "reverse"){
		gameData.turn.reverseTurn = true;
		if(gameData.activePlayers == 2){
			gameData.turn.reverseCount = 1;
		}else{
			if(gameData.match.count == 0){
				gameData.turn.reverseCount = 1;
			}else{
				gameData.turn.reverseCount = 2;
			}
		}
		showGameStatus(cardType);
	}else if(cardType == "skip"){
		gameData.turn.skip = true;
		togglePlayerSkip(true, true);
		showGameStatus(cardType);
	}else if(cardType == "wild"){
		gameData.turn.pickColors = true;
		showGameStatus(cardType);
	}else if(cardType == "wilddraw4"){
		var isStackingEnabled = (gameSettings.houseRules && gameSettings.houseRules.stacking !== false);
		gameData.turn.pickColors = true;
		if (isStackingEnabled) {
			gameData.turn.pendingDrawStack = (gameData.turn.pendingDrawStack || 0) + 4;
			gameData.turn.pendingDrawType = 'wilddraw4';
			showGameStatus('drawstack');
		} else {
			gameData.turn.drawCards = gameData.turn.drawCardsTotal = 4;
			showGameStatus(cardType);
		}
	}else if(cardType == "truesight"){
		gameData.turn.revealCard = true;
		gameData.turn.targetPlayerAim = true;
		showGameStatus(cardType);
	}else if(cardType == "oneforme"){
		gameData.turn.targetPlayer = gameData.player;
		gameData.turn.targetDrawCards = 1;
		gameData.turn.targetDrawCard = true;
		showGameStatus(cardType);
	}else if(cardType == "devildeal"){
		//Reverse, Skip then Draw 2 cards.
		var nextAction = {action:'reverse', data:[{obj:'reverseTurn', value:true}, {obj:'reverseCount', value:2}]};
		gameData.turn.queue.push(nextAction);
		var nextAction = {action:'skip', data:[]};
		gameData.turn.queue.push(nextAction);
		var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'played', value:true}]};
		gameData.turn.queue.push(nextAction);

		showGameStatus(cardType);
	}else if(cardType == "charity"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.giveCards = 2;
		gameData.turn.giveCard = true;
		showGameStatus(cardType);
	}else if(cardType == "targeteddraw2"){
		gameData.turn.targetPlayerAim = true;
		var nextAction = {action:'draw2', data:[{obj:'targetDrawCards', value:2}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
		gameData.turn.queue.push(nextAction);
		showGameStatus(cardType);
	}else if(cardType == "eliminatedplayer"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.removePlayer = true;
		showGameStatus(cardType);
	}else if(cardType == "frozencolor"){
		gameData.turn.pickColors = true;
		gameData.turn.frozenPick = true;
		gameData.turn.frozenSkip = true;
		gameData.turn.frozenReset = gameData.player;
		showGameStatus(cardType);
	}else if(cardType == "add50points"){
		gameData.turn.addPoints = 50;
		showGameStatus(cardType);
	}else if(cardType == "targeteddraw3"){
		gameData.turn.targetPlayerAim = true;
		var nextAction = {action:'draw3', data:[{obj:'targetDrawCards', value:3}, {obj:'targetDrawCard', value:true}, {obj:'continuePlay', value:true}]};
		gameData.turn.queue.push(nextAction);
		showGameStatus(cardType);
	}else if(cardType == "shufflehandcards"){
		gameData.turn.shuffle = true;
		showGameStatus(cardType);
	}else if(cardType == "swapcards"){
		gameData.turn.targetPlayerAim = true;
		gameData.turn.swap = true;
		showGameStatus(cardType);
	}else if(cardType == "itsatrap"){
		gameData.turn.targetPlayer = gameData.player;
		gameData.turn.targetDrawCards = 4;
		gameData.turn.targetDrawCard = true;
		showGameStatus(cardType);
	}else{
		checkRoundEnd();
	}
}
