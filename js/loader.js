////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
 function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(checkMobileOrientation, 1000);
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);

	// var spriteSheet;
	// var sprites = {}
	// $.getJSON("assets/texture.json", function(json) {
	// 	spriteSheet = new createjs.SpriteSheet(json);
	// 	for(var sprite in json.animations){
	// 		sprites[sprite] = new createjs.Sprite(spriteSheet, sprite);
	// 	}
	// });
	// console.log("123");
	// console.log(sprites);



	manifest=[
			{src:'assets/background.png', id:'background'},
			{src:'assets/background_p.png', id:'backgroundP'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/logo_p.png', id:'logoP'},
			{src:'assets/button_play.png', id:'buttonPlay'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/button_next.png', id:'buttonNext'},
			{src:'assets/button_online.png', id:'buttonOnline'},
			{src:'assets/button_local.png', id:'buttonLocal'},

			{src:'assets/button_back.png', id:'buttonBack'},
			{src:'assets/item_tutorial_1.png', id:'itemTutorial1'},
			{src:'assets/item_tutorial_2.png', id:'itemTutorial2'},
			{src:'assets/item_tutorial_3.png', id:'itemTutorial3'},
			{src:'assets/item_tutorial_4.png', id:'itemTutorial4'},
			{src:'assets/item_tutorial_5.png', id:'itemTutorial5'},
			{src:'assets/item_tutorial_6.png', id:'itemTutorial6'},
			{src:'assets/item_tutorial_7.png', id:'itemTutorial7'},
			{src:'assets/item_tutorial_8.png', id:'itemTutorial8'},
			{src:'assets/item_tutorial_9.png', id:'itemTutorial9'},
			{src:'assets/item_tutorial_10.png', id:'itemTutorial10'},
			{src:'assets/item_tutorial_11.png', id:'itemTutorial11'},
			{src:'assets/item_tutorial_12.png', id:'itemTutorial12'},
			{src:'assets/item_tutorial_13.png', id:'itemTutorial13'},
			{src:'assets/item_tutorial_14.png', id:'itemTutorial14'},
			{src:'assets/item_tutorial_15.png', id:'itemTutorial15'},

			{src:'assets/item_options.png', id:'itemOptions'},
			{src:'assets/button_arrow_left.png', id:'buttonArrowLeft'},
			{src:'assets/button_arrow_right.png', id:'buttonArrowRight'},
			{src:'assets/button_plus.png', id:'buttonPlus'},
			{src:'assets/button_minus.png', id:'buttonMinus'},
			{src:'assets/button_tutorial.png', id:'buttonTutorial'},
			{src:'assets/item_number.png', id:'itemNumber'},

			{src:'assets/item_player_line.png', id:'itemPlayerLine'},
			{src:'assets/button_call.png', id:'buttonCall'},
			{src:'assets/button_called.png', id:'buttonCalled'},
			{src:'assets/button_aim.png', id:'buttonAim'},
			{src:'assets/item_colors.png', id:'itemColors'},
			{src:'assets/item_color_bg.png', id:'itemColorBg'},
			{src:'assets/item_status.png', id:'itemStatus'},
			{src:'assets/item_status_long.png', id:'itemStatusLong'},
			{src:'assets/item_score.png', id:'itemScore'},
			{src:'assets/item_score_top.png', id:'itemScoreTop'},
			{src:'assets/item_score_divide.png', id:'itemScoreDivide'},
			{src:'assets/item_arrow.png', id:'itemArrow'},
			{src:'assets/item_frozen.png', id:'itemFrozen'},
			{src:'assets/item_instruction.png', id:'itemInstruction'},
			{src:'assets/item_target.png', id:'itemTarget'},
			{src:'assets/item_skip.png', id:'itemSkip'},
			{src:'assets/item_eliminated.png', id:'itemEliminated'},
		
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/button_continue.png', id:'buttonContinue'},
			{src:'assets/item_pop.png', id:'itemPop'},
			{src:'assets/item_pop_p.png', id:'itemPopP'},
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			// {src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}
	];

	for(var n=0; n<themes_arr.length; n++){
		if(themes_arr[n].front) manifest.push({src:themes_arr[n].front, id:'cardCover'+n});
		if(themes_arr[n].highlight) manifest.push({src:themes_arr[n].highlight, id:'cardHighlight'+n});
		if(themes_arr[n].shadow) manifest.push({src:themes_arr[n].shadow, id:'cardShadow'+n});
		if(themes_arr[n].eliminated) manifest.push({src:themes_arr[n].eliminated, id:'cardEliminated'+n});
		for(var c=0; c<gameData.colors.length; c++){
			var colorKey = gameData.colors[c];
			if(themes_arr[n][colorKey]){
				if(themes_arr[n][colorKey].background) manifest.push({src:themes_arr[n][colorKey].background, id:'cardBg'+n+'_'+colorKey});
				if(themes_arr[n][colorKey].numbers){
					for(var p=0; p<themes_arr[n][colorKey].numbers.length; p++){
						if(themes_arr[n][colorKey].numbers[p]){
							manifest.push({src:themes_arr[n][colorKey].numbers[p], id:'cardNumbers'+n+'_'+colorKey+'_'+p});
						}
					}
				}
				if(themes_arr[n][colorKey].actions){
					for(var p=0; p<themes_arr[n][colorKey].actions.length; p++){
						if(themes_arr[n][colorKey].actions[p]){
							manifest.push({src:themes_arr[n][colorKey].actions[p], id:'cardActions'+n+'_'+colorKey+'_'+p});
						}
					}
				}
			}
		}
		if(themes_arr[n].wilds){
			for(var p=0; p<themes_arr[n].wilds.length; p++){
				if(themes_arr[n].wilds[p]){
					manifest.push({src:themes_arr[n].wilds[p], id:'cardWilds'+n+'_'+p});
				}
			}
		}
		if(themes_arr[n].specials){
			for(var p=0; p<themes_arr[n].specials.length; p++){
				if(themes_arr[n].specials[p]){
					manifest.push({src:themes_arr[n].specials[p], id:'cardSpecial'+n+'_'+p});
				}
			}
		}
	}

	for(var n=0; n<cards_arr.actions.length; n++){
		if(cards_arr.actions[n].image && cards_arr.actions[n].image.trim() !== ''){
			manifest.push({src:cards_arr.actions[n].image, id:'cardActions'+n});
		}
	}

	for(var n=0; n<cards_arr.wilds.length; n++){
		if(cards_arr.wilds[n].image && cards_arr.wilds[n].image.trim() !== ''){
			manifest.push({src:cards_arr.wilds[n].image, id:'cardWilds'+n});
		}
	}

	for(var n=0; n<cards_arr.specials.length; n++){
		if(cards_arr.specials[n].image && cards_arr.specials[n].image.trim() !== ''){
			manifest.push({src:cards_arr.specials[n].image, id:'cardSpecials'+n});
		}
	}

	for(var n=0; n<cards_arr.otherActions.length; n++){
		if(cards_arr.otherActions[n].image && cards_arr.otherActions[n].image.trim() !== ''){
			manifest.push({src:cards_arr.otherActions[n].image, id:'cardOtherActions'+n});
		}
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	soundOn = true;
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}else{
		if(!enableDesktopSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/sound_click.mp3', id:'soundButton'});
		manifest.push({src:'assets/sounds/sound_card_deal.mp3', id:'soundCardDeal'});
		manifest.push({src:'assets/sounds/sound_card_flip.mp3', id:'soundCardFlip'});
		manifest.push({src:'assets/sounds/sound_card_draw.mp3', id:'soundCardDraw'});
		manifest.push({src:'assets/sounds/sound_card_shuffle.mp3', id:'soundCardShuffle'});
		manifest.push({src:'assets/sounds/sound_point.mp3', id:'soundPoint'});
		manifest.push({src:'assets/sounds/sound_round.mp3', id:'soundRound'});
		manifest.push({src:'assets/sounds/sound_winner.mp3', id:'soundWinner'});
		manifest.push({src:'assets/sounds/sound_result.mp3', id:'soundResult'});
		manifest.push({src:'assets/sounds/sound_warning.mp3', id:'soundWarning'});
		manifest.push({src:'assets/sounds/sound_alert.mp3', id:'soundAlert'});
		manifest.push({src:'assets/sounds/sound_action.mp3', id:'soundAction'});
		manifest.push({src:'assets/sounds/sound_color.mp3', id:'soundColor'});
		manifest.push({src:'assets/sounds/sound_color_pick.mp3', id:'soundColorPick'});
		manifest.push({src:'assets/sounds/sound_call.mp3', id:'soundCall'});
		manifest.push({src:'assets/sounds/sound_target.mp3', id:'soundTarget'});
		manifest.push({src:'assets/sounds/sound_freeze.mp3', id:'soundFreeze'});
		manifest.push({src:'assets/sounds/sound_eliminated.mp3', id:'soundEliminated'});
		manifest.push({src:'assets/sounds/sound_direction.mp3', id:'soundDirection'});
		manifest.push({src:'assets/sounds/sound_direction_reverse.mp3', id:'soundDirectionReverse'});
		manifest.push({src:'assets/sounds/music_game.mp3', id:'musicGame'});
		// manifest.push({src:'assets/sounds/music_main.mp3', id:'musicMain'});
		
		// createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}

	manifest = manifest.filter(function(item){
		return item && item.src && typeof item.src === 'string' && item.src.trim() !== '';
	});
	
	loader.addEventListener("complete", handleComplete);
	loader.addEventListener("fileload", fileComplete);
	loader.addEventListener("error",handleFileError);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS FILE COMPLETE EVENT - This is the function that runs to update when file loaded complete
 * 
 */
function fileComplete(evt) {
	var item = evt.item;
	console.log("Event Callback file loaded ", evt.item.id);
}

/*!
 * 
 * CANVAS FILE HANDLE EVENT - This is the function that runs to handle file error
 * 
 */
function handleFileError(evt) {
	console.log("error", evt.item ? evt.item.src : "unknown file");
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	try {
		if (typeof sendEvent === 'function') {
			sendEvent("gameLoaded", 0);
		} else if (typeof window.sendEvent === 'function') {
			window.sendEvent("gameLoaded", 0);
		}
	} catch (e) {
		console.warn("sendEvent error:", e);
	}
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}