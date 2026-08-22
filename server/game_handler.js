// Game Actions & Disconnect Socket Handlers
const {
  startServerGameSession,
  getServerGameSession,
  removeServerGameSession,
  handleClientGameMessage
} = require('./server_game_controller');

function handleGameAction(io, socket, rooms, getPublicRooms, data = {}) {
  if (!data.roomId) return;
  const room = rooms.get(data.roomId);

  if (room && (data.action === 'start' || data.action === 'startgame')) {
    room.isPlaying = true;
    io.emit('publicRooms', getPublicRooms());
    // Start authoritative server game session
    startServerGameSession(data.roomId, io, room);
  }

  // Handle client player game actions (play, draw, done, color)
  if (data.type && data.type.startsWith('player_')) {
    handleClientGameMessage(io, socket, rooms, data);
    return;
  }

  if (data.includeSender) {
    io.to(data.roomId).emit('gameAction', data);
  } else {
    socket.to(data.roomId).emit('gameAction', data);
  }
}

function handleDisconnect(io, socket, rooms, getPublicRooms) {
  console.log(`User disconnected: ${socket.id}`);

  for (const [roomId, room] of rooms.entries()) {
    const playerIndex = room.players.findIndex(p => p.id === socket.id);

    if (playerIndex !== -1) {
      const wasHost = room.players[playerIndex].isHost;
      
      if (room.isPlaying) {
        // In-game disconnect: convert them to a bot seamlessly
        room.players[playerIndex].isBot = true;
        room.players[playerIndex].isHost = false;
        
        io.to(roomId).emit('updatePlayers', room.players);
        io.to(roomId).emit('gameMessage', `${room.players[playerIndex].name} disconnected and was replaced by a bot.`);
        
        const gameSession = getServerGameSession(roomId);
        if (gameSession && gameSession.currentTurn === playerIndex && gameSession.turnState === 'WAITING_PLAYER_ACTION') {
          clearTimeout(gameSession.safetyTimer);
          gameSession.handleBotTurn(room.players[playerIndex]);
        }
      } else {
        // Lobby disconnect: just remove them
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('updatePlayers', room.players);
      }
      
      // Reassign host if needed
      if (wasHost && room.players.length > 0) {
        const nextHuman = room.players.find(p => !p.isBot) || room.players[0];
        nextHuman.isHost = true;
        room.host = nextHuman.id;
        io.to(roomId).emit('updatePlayers', room.players);
      }

      // If no humans left, destroy room entirely
      if (room.players.filter(p => !p.isBot).length === 0) {
        removeServerGameSession(roomId);
        rooms.delete(roomId);
      }

      io.emit('publicRooms', getPublicRooms());
    }
  }
}

module.exports = {
  handleGameAction,
  handleDisconnect
};
