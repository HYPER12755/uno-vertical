// Chat & Reactions Socket Handlers

function handleSendReaction(io, socket, data = {}) {
  if (!data.roomId) return;
  io.to(data.roomId).emit('playerReaction', {
    senderId: socket.id,
    playerIndex: data.playerIndex,
    emoji: data.emoji || '🎉',
    timestamp: Date.now()
  });
}

function handleSendChat(io, socket, data = {}) {
  if (!data.roomId) return;
  io.to(data.roomId).emit('chatMessage', {
    senderId: socket.id,
    senderName: data.senderName || 'Player',
    message: data.message || '',
    emoji: data.emoji || '',
    timestamp: Date.now()
  });
}

module.exports = {
  handleSendReaction,
  handleSendChat
};
