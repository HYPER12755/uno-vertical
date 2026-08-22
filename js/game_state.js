////////////////////////////////////////////////////////////
// GAME v1.0
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//themes
var themes_arr = [
	{
		front:"assets/themes1/theme_front.png",
		highlight:"assets/themes1/theme_highlight.png",
		shadow:"assets/themes1/theme_shadow.png",
		eliminated:"assets/themes1/theme_eliminated.png",
		red:{
			background:'assets/themes1/theme_red_bg.png',
			numbers:[
				'assets/themes1/theme_red_0.png',
				'assets/themes1/theme_red_1.png',
				'assets/themes1/theme_red_2.png',
				'assets/themes1/theme_red_3.png',
				'assets/themes1/theme_red_4.png',
				'assets/themes1/theme_red_5.png',
				'assets/themes1/theme_red_6.png',
				'assets/themes1/theme_red_7.png',
				'assets/themes1/theme_red_8.png',
				'assets/themes1/theme_red_9.png',
			],
			actions:[
				'assets/themes1/theme_red_draw.png',
				'assets/themes1/theme_red_reverse.png',
				'assets/themes1/theme_red_skip.png',
			]
		},
		yellow:{
			background:'assets/themes1/theme_yellow_bg.png',
			numbers:[
				'assets/themes1/theme_yellow_0.png',
				'assets/themes1/theme_yellow_1.png',
				'assets/themes1/theme_yellow_2.png',
				'assets/themes1/theme_yellow_3.png',
				'assets/themes1/theme_yellow_4.png',
				'assets/themes1/theme_yellow_5.png',
				'assets/themes1/theme_yellow_6.png',
				'assets/themes1/theme_yellow_7.png',
				'assets/themes1/theme_yellow_8.png',
				'assets/themes1/theme_yellow_9.png',
			],
			actions:[
				'assets/themes1/theme_yellow_draw.png',
				'assets/themes1/theme_yellow_reverse.png',
				'assets/themes1/theme_yellow_skip.png',
			]
		},
		blue:{
			background:'assets/themes1/theme_blue_bg.png',
			numbers:[
				'assets/themes1/theme_blue_0.png',
				'assets/themes1/theme_blue_1.png',
				'assets/themes1/theme_blue_2.png',
				'assets/themes1/theme_blue_3.png',
				'assets/themes1/theme_blue_4.png',
				'assets/themes1/theme_blue_5.png',
				'assets/themes1/theme_blue_6.png',
				'assets/themes1/theme_blue_7.png',
				'assets/themes1/theme_blue_8.png',
				'assets/themes1/theme_blue_9.png',
			],
			actions:[
				'assets/themes1/theme_blue_draw.png',
				'assets/themes1/theme_blue_reverse.png',
				'assets/themes1/theme_blue_skip.png',
			]
		},
		green:{
			background:'assets/themes1/theme_green_bg.png',
			numbers:[
				'assets/themes1/theme_green_0.png',
				'assets/themes1/theme_green_1.png',
				'assets/themes1/theme_green_2.png',
				'assets/themes1/theme_green_3.png',
				'assets/themes1/theme_green_4.png',
				'assets/themes1/theme_green_5.png',
				'assets/themes1/theme_green_6.png',
				'assets/themes1/theme_green_7.png',
				'assets/themes1/theme_green_8.png',
				'assets/themes1/theme_green_9.png',
			],
			actions:[
				'assets/themes1/theme_green_draw.png',
				'assets/themes1/theme_green_reverse.png',
				'assets/themes1/theme_green_skip.png',
			]
		},
		wilds:[
			'assets/themes1/theme_wild.png',
			'assets/themes1/theme_wilddraw.png',
		],
		specials:[
			'assets/themes1/theme_truesight.png',
			'assets/themes1/theme_oneforme.png',
			'assets/themes1/theme_devildeal.png',
			'assets/themes1/theme_charity.png',
			'assets/themes1/theme_targeteddraw2.png',
			'assets/themes1/theme_eliminatedplayer.png',
			'assets/themes1/theme_frozencolor.png',
		]
	}
];

var cards_arr = {
	numbers:[0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9],
	actions:[
		{type:'draw2', point:20, image:'assets/icon_draw2.png', text:'DRAW 2 CARDS'},
		{type:'draw4', point:20, image:'assets/svg/card_red_draw4.svg', text:'DRAW 4 CARDS'},
		{type:'discardall', point:30, image:'assets/svg/card_red_discardall.svg', text:'DISCARD ALL COLOR'},
		{type:'skipeveryone', point:30, image:'assets/svg/card_red_skipeveryone.svg', text:'SKIP EVERYONE'},
		{type:'reverse', point:20, image:'assets/icon_reverse.png', text:'REVERSE TURN'},
		{type:'skip', point:20, image:'assets/icon_skip.png', text:'SKIP TURN'},
	],
	wilds:[
		{type:'wild', point:50, image:'assets/icon_wild.png', text:'WILD CARD'},
		{type:'wilddraw4', point:50, image:'assets/icon_wilddraw4.png', text:'DRAW 4 CARDS'},
		{type:'wilddraw6', point:50, image:'assets/svg/card_wilddraw6.svg', text:'WILD DRAW 6'},
		{type:'wilddraw10', point:50, image:'assets/svg/card_wilddraw10.svg', text:'WILD DRAW 10 (NO MERCY)'},
		{type:'wildreversdraw4', point:50, image:'assets/svg/card_wildreversdraw4.svg', text:'WILD REVERSE DRAW 4'},
		{type:'wildcolorroulette', point:50, image:'assets/svg/card_wildcolorroulette.svg', text:'WILD COLOR ROULETTE'},
	],
	specials:[
		{type:'truesight', point:50, image:'assets/icon_truesight.png', text:'REVEAL PLAYER CARDS'},
		{type:'oneforme', point:50, image:'assets/icon_oneforme.png', text:'DRAW 1 CARD'},
		{type:'devildeal', point:50, image:'assets/icon_devildeal.png', text:'REVERSE, SKIP AND DRAW 2 CARDS'},
		{type:'charity', point:50, image:'assets/icon_charity.png', text:'HADN 2 CARDS TO TARGETED PLAYER'},
		{type:'targeteddraw2', point:50, image:'assets/icon_targeteddraw2.png', text:'DRAW 2 CARDS TO TARGETED PLAYER'},
		{type:'eliminatedplayer', point:50, image:'assets/icon_eliminatedplayer.png', text:'ELIMINATE PLAYER'},
		{type:'frozencolor', point:50, image:'assets/icon_frozencolor.png', text:'FROZEN COLOR FOR A TURN'}
	],
	otherActions:[]
};

//game settings
var gameSettings = {
	cardW:100,
	cardH:150,
	cardSpace:50,
	cardShadowX:5,
	cardShadowY:5,
	cardMoveSpeed:.35,
	cardDealSpeed:.25,
	cardFlipSpeed:.25,
	aiThinkSpeed:1.1,
	playerCards:7, //total player cards
	penaltyCards:0, //total penalty cards
	lastCardCallTimer:1, //last card call timer
	points:[500,250,1], //score points option (500, 250, 1 Round)
	houseRules: {
		jumpIn: true,
		drawUntilPlayable: false,
		challenge4: true,
		stacking: true,
		mercyKO: true,
		swap70: true
	}
};

//game text display
var textDisplay = {
					optionsTitle:'OPTIONS',
					tutorialTitle:'HOW TO PLAY?',
					totalPlayers:"[NUMBER] PLAYERS",
					goalPoint:"GOAL [NUMBER]PTS",
					modes:["CLASSIC","SPECIAL","NO MERCY","FLIP!","FLEX!","ATTACK!","ALL WILD!"],
					playerName:'PLAYER [NUMBER]',
					playerScore:'[NUMBER]PTS',
					playerPenalty:'PENALTY 2 CARDS',
					userPickColor:'PICK COLORS',
					playerPickColor:'PICKING COLORS',
					playerTarget:'TARGET A PLAYER',
					playerTargeting:'TARGETING PLAYERS',
					selectCards:'SELECT TWO CARDS',
					selectingCards:'SELECTING TWO CARDS',
					emptyCards:"NO CARDS LEFT",
					noMorePlayers:"NO MORE PLAYERS",
					playerWon:' WON',
					playerRoundWin:"YOU WIN THIS ROUND",
					playerRoundLose:"YOU LOSE THIS ROUND",
					goalPointTitle:"GOAL POINT ([NUMBER]PTS)",
					playerScoreAdd:" (+[NUMBER]PTS)",
					userWin:"YOU WIN THE GAME",
					playerWin:"[NAME] WIN THE GAME",
					exitTitle:'EXIT GAME',
					exitMessage:'Are you sure you want\nto quit game?',
					share:'SHARE YOUR SCORE:',
					resultTitle:"GAME OVER",
					resultDesc:'[NUMBER]PTS',
				}

//Social share, [SCORE] will replace with game score
var shareEnable = false; //toggle share
var shareTitle = 'Highscore on Four Colors is [SCORE]PTS';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Four Colors game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, scores:[]};
var gameData = {paused:true, colors:['red','blue','yellow','green'], moving:false, player:0, players:0, pointIndex:0, themeIndex:0, mode:'classic', modeIndex:0, drawing:false, ai:true, complete:false, names:[]};
var tweenData = {score:0, tweenScore:0};
