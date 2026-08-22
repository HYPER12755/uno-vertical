// Game Logic State (Matchmaking & Rooms)
const rooms = new Map();
const BOT_NAMES = ['Bot Luna 🤖', 'Bot Max 🤖', 'Bot Nova 🤖', 'Bot Pixel 🤖', 'Bot Flash 🤖', 'Bot Spark 🤖'];

function getPublicRooms() {
  const list = [];
  for (const [, room] of rooms.entries()) {
    if (!room.isPlaying && room.players.length < room.maxPlayers) {
      list.push({
        id: room.id,
        name: room.name,
        hostName: room.players[0]?.name || 'Host',
        currentPlayers: room.players.length,
        maxPlayers: room.maxPlayers,
        mode: room.mode || (room.special ? 'special' : 'classic'),
        special: room.special,
        pointIndex: room.pointIndex
      });
    }
  }
  return list;
}

module.exports = {
  rooms,
  BOT_NAMES,
  getPublicRooms
};
