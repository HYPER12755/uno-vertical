const {
  handleCreateRoom,
  handleListRooms,
  handleUpdateRoomOptions,
  handleJoinRoom,
  handleReconnectSession,
  handleAddBot,
  handleRemoveBot,
  handleQuickMatch,
  handleToggleReady,
  handleLeaveRoom
} = require('./lobby_handler');

const {
  handleSendReaction,
  handleSendChat
} = require('./chat_handler');

const {
  handleGameAction,
  handleDisconnect
} = require('./game_handler');

const {
  handleClientGameMessage
} = require('./server_game_controller');

function registerSocketHandlers(io, socket, { rooms, BOT_NAMES, getPublicRooms }) {
  console.log(`User connected: ${socket.id}`);

  // LOBBY & ROOM EVENTS
  socket.on('createRoom', (data) => handleCreateRoom(io, socket, rooms, getPublicRooms, data));
  socket.on('listRooms', () => handleListRooms(socket, getPublicRooms));
  socket.on('updateRoomOptions', (data) => handleUpdateRoomOptions(io, socket, rooms, getPublicRooms, data));
  socket.on('joinRoom', (data) => handleJoinRoom(io, socket, rooms, getPublicRooms, data));
  socket.on('reconnectSession', (data) => handleReconnectSession(socket, rooms, data));
  socket.on('addBot', (data) => handleAddBot(io, rooms, getPublicRooms, BOT_NAMES, data));
  socket.on('removeBot', (data) => handleRemoveBot(io, rooms, getPublicRooms, data));
  socket.on('quickMatch', (data) => handleQuickMatch(io, socket, rooms, getPublicRooms, data));
  socket.on('toggleReady', (data) => handleToggleReady(io, socket, rooms, data));
  socket.on('leaveRoom', (data) => handleLeaveRoom(io, socket, rooms, getPublicRooms, data));

  // CHAT & REACTION EVENTS
  socket.on('sendReaction', (data) => handleSendReaction(io, socket, data));
  socket.on('sendChat', (data) => handleSendChat(io, socket, data));

  // GAME ACTION & LIFECYCLE EVENTS
  socket.on('gameAction', (data) => handleGameAction(io, socket, rooms, getPublicRooms, data));
  socket.on('playerAction', (data) => handleClientGameMessage(io, socket, rooms, data));
  socket.on('player_action_done', (data) => handleClientGameMessage(io, socket, rooms, { type: 'player_action_done', ...data }));
  socket.on('latency_ping', (timestamp) => {
    socket.emit('latency_pong', timestamp);
  });
  socket.on('disconnect', () => handleDisconnect(io, socket, rooms, getPublicRooms));
}

module.exports = {
  registerSocketHandlers
};
