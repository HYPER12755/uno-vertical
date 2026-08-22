// Four Colors Game Engine - Modular Architecture
// The game engine is split faithfully into the following modules:
// - js/game_state.js    : Theme configs, card arrays, playerData, gameData, tweenData, settings
// - js/game_modes.js    : Mode detection (Classic, Special, No Mercy, Flip, Flex, Attack, All Wild) & special card creators
// - js/game_core.js     : Lifecycle methods (startGame, stopGame, saveGame, resizeGameLayout, endGame)
// - js/game_cards.js    : Card building, preparation, flipping, discard effects & depth
// - js/game_players.js  : Player setup, dealing, targeting, swapping & color selection
// - js/game_play.js     : Turn execution, draw mechanics, matching rules & AI bot logic
// - js/turn_manager.js  : Turn rotation, player skip, arrow indicators & update loop
// - js/game_ui.js       : UI buttons, menu navigation, options, overlays & share dialogs
