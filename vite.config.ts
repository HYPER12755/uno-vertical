import { defineConfig, Plugin } from 'vite';
import { Server as SocketIOServer } from 'socket.io';

function socketServerPlugin(): Plugin {
  return {
    name: 'socket-server',
    configureServer(server) {
      if (!server.httpServer) return;
      const io = new SocketIOServer(server.httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });

      // Map of roomId -> roomObject
      const rooms = new Map<string, any>();

      const BOT_NAMES = ['Bot Luna 🤖', 'Bot Max 🤖', 'Bot Nova 🤖', 'Bot Pixel 🤖', 'Bot Flash 🤖', 'Bot Spark 🤖'];

      function getPublicRooms() {
        const list: any[] = [];
        for (const [, room] of rooms.entries()) {
          if (!room.isPlaying && room.players.length < room.maxPlayers) {
            list.push({
              id: room.id,
              name: room.name || `Room ${room.id}`,
              hostName: room.players[0]?.name || 'Host',
              currentPlayers: room.players.length,
              maxPlayers: room.maxPlayers,
              special: room.special || false,
              pointIndex: room.pointIndex || 0,
              themeIndex: room.themeIndex || 0
            });
          }
        }
        return list;
      }

      io.on('connection', (socket) => {
        // Send initial public rooms list
        socket.emit('publicRooms', getPublicRooms());

        // LIST ROOMS
        socket.on('listRooms', () => {
          socket.emit('publicRooms', getPublicRooms());
        });

        // CREATE ROOM
        socket.on('createRoom', (data: any = {}) => {
          const roomId = (data.roomId || Math.random().toString(36).substring(2, 8)).toUpperCase();
          const maxPlayers = Number(data.maxPlayers) || 4;
          const playerName = (data.name && data.name.trim()) ? data.name.trim() : 'Player 1';
          const avatar = data.avatar || 0;

          const room = {
            id: roomId,
            name: data.roomName || `Room ${roomId}`,
            host: socket.id,
            players: [{ id: socket.id, name: playerName, avatar: avatar, isReady: true, isHost: true, isBot: false }],
            maxPlayers: maxPlayers,
            special: data.special !== undefined ? data.special : true,
            pointIndex: data.pointIndex || 0,
            themeIndex: data.themeIndex || 0,
            isPlaying: false,
            deck: null
          };

          rooms.set(roomId, room);
          socket.join(roomId);
          socket.emit('roomCreated', { roomId, room });
          io.to(roomId).emit('updatePlayers', room.players);
          io.emit('publicRooms', getPublicRooms());
        });

        // JOIN ROOM
        socket.on('joinRoom', (data: any = {}) => {
          const roomId = (data.roomId || '').toUpperCase().trim();
          const room = rooms.get(roomId);

          if (!room) {
            return socket.emit('joinError', 'Room code not found. Please check and try again.');
          }
          if (room.isPlaying) {
            return socket.emit('joinError', 'Game is already in progress in this room.');
          }
          if (room.players.length >= room.maxPlayers) {
            return socket.emit('joinError', 'Room is currently full.');
          }

          const playerName = (data.name && data.name.trim()) ? data.name.trim() : `Player ${room.players.length + 1}`;
          const avatar = data.avatar !== undefined ? data.avatar : room.players.length;

          const playerObj = {
            id: socket.id,
            name: playerName,
            avatar: avatar,
            isReady: false,
            isHost: false,
            isBot: false
          };

          room.players.push(playerObj);
          socket.join(roomId);

          socket.emit('roomJoined', { roomId, room });
          io.to(roomId).emit('updatePlayers', room.players);
          io.to(roomId).emit('roomOptions', {
            maxPlayers: room.maxPlayers,
            special: room.special,
            pointIndex: room.pointIndex,
            themeIndex: room.themeIndex
          });
          io.emit('publicRooms', getPublicRooms());
        });

        // ADD BOT (Host only)
        socket.on('addBot', (data: any = {}) => {
          if (!data.roomId) return;
          const room = rooms.get(data.roomId);
          if (!room) return;
          if (room.host !== socket.id) return;
          if (room.players.length >= room.maxPlayers) return;

          const botIdx = room.players.filter((p: any) => p.isBot).length;
          const botName = BOT_NAMES[botIdx % BOT_NAMES.length] || `Bot ${botIdx + 1} 🤖`;
          const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

          room.players.push({
            id: botId,
            name: botName,
            avatar: room.players.length,
            isReady: true,
            isHost: false,
            isBot: true
          });

          io.to(data.roomId).emit('updatePlayers', room.players);
          io.emit('publicRooms', getPublicRooms());
        });

        // REMOVE BOT (Host only)
        socket.on('removeBot', (data: any = {}) => {
          if (!data.roomId) return;
          const room = rooms.get(data.roomId);
          if (!room || room.host !== socket.id) return;

          const lastBotIdx = room.players.map((p: any) => p.isBot).lastIndexOf(true);
          if (lastBotIdx !== -1) {
            room.players.splice(lastBotIdx, 1);
            io.to(data.roomId).emit('updatePlayers', room.players);
            io.emit('publicRooms', getPublicRooms());
          }
        });

        // QUICK MATCH
        socket.on('quickMatch', (data: any = {}) => {
          let foundRoom: any = null;
          for (const [, room] of rooms.entries()) {
            if (!room.isPlaying && room.players.length < room.maxPlayers) {
              foundRoom = room;
              break;
            }
          }

          const playerName = (data.name && data.name.trim()) ? data.name.trim() : 'Player';
          const avatar = data.avatar || 0;

          if (foundRoom) {
            foundRoom.players.push({
              id: socket.id,
              name: playerName || `Player ${foundRoom.players.length + 1}`,
              avatar: avatar,
              isReady: false,
              isHost: false,
              isBot: false
            });
            socket.join(foundRoom.id);
            socket.emit('roomJoined', { roomId: foundRoom.id, room: foundRoom });
            io.to(foundRoom.id).emit('updatePlayers', foundRoom.players);
            io.emit('publicRooms', getPublicRooms());
          } else {
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const room = {
              id: roomId,
              name: `Quick Match ${roomId}`,
              host: socket.id,
              players: [{ id: socket.id, name: playerName || 'Player 1', avatar: avatar, isReady: true, isHost: true, isBot: false }],
              maxPlayers: 4,
              special: true,
              pointIndex: 0,
              themeIndex: 0,
              isPlaying: false,
              deck: null
            };
            rooms.set(roomId, room);
            socket.join(roomId);
            socket.emit('roomCreated', { roomId, room });
            io.to(roomId).emit('updatePlayers', room.players);
            io.emit('publicRooms', getPublicRooms());
          }
        });

        // TOGGLE READY
        socket.on('toggleReady', (data: any = {}) => {
          if (!data.roomId) return;
          const room = rooms.get(data.roomId);
          if (!room) return;
          const p = room.players.find((pl: any) => pl.id === socket.id);
          if (p) {
            p.isReady = !p.isReady;
            io.to(data.roomId).emit('updatePlayers', room.players);
          }
        });

        // UPDATE ROOM SETTINGS (Host only)
        socket.on('updateRoomSettings', (data: any = {}) => {
          if (!data.roomId) return;
          const room = rooms.get(data.roomId);
          if (!room || room.host !== socket.id) return;
          if (data.maxPlayers) room.maxPlayers = Number(data.maxPlayers);
          if (data.special !== undefined) room.special = data.special;
          if (data.pointIndex !== undefined) room.pointIndex = data.pointIndex;
          if (data.themeIndex !== undefined) room.themeIndex = data.themeIndex;

          io.to(data.roomId).emit('roomOptions', {
            maxPlayers: room.maxPlayers,
            special: room.special,
            pointIndex: room.pointIndex,
            themeIndex: room.themeIndex
          });
          io.emit('publicRooms', getPublicRooms());
        });

        // CHAT & EMOJI REACTIONS
        socket.on('sendChat', (data: any = {}) => {
          if (!data.roomId) return;
          io.to(data.roomId).emit('chatMessage', {
            senderId: socket.id,
            senderName: data.senderName || 'Player',
            message: data.message || '',
            emoji: data.emoji || null,
            timestamp: Date.now()
          });
        });

        // GAME ACTIONS (Synchronize moves, deck, colors, uno calls)
        socket.on('gameAction', (data: any = {}) => {
          if (!data || !data.roomId) return;
          const room = rooms.get(data.roomId);
          if (!room) return;

          if (data.action === 'start') {
            room.isPlaying = true;
            io.emit('publicRooms', getPublicRooms());
          }

          // Relay action to everyone in the room (or excluding sender if broadcast is false)
          if (data.includeSender) {
            io.to(data.roomId).emit('gameAction', data);
          } else {
            socket.to(data.roomId).emit('gameAction', data);
          }
        });

        // LEAVE ROOM
        socket.on('leaveRoom', (data: any = {}) => {
          const roomId = data.roomId;
          if (!roomId) return;
          const room = rooms.get(roomId);
          if (!room) return;

          const pIdx = room.players.findIndex((p: any) => p.id === socket.id);
          if (pIdx !== -1) {
            const wasHost = room.players[pIdx].isHost;
            room.players.splice(pIdx, 1);
            socket.leave(roomId);

            if (room.players.filter((p: any) => !p.isBot).length === 0) {
              rooms.delete(roomId);
            } else {
              if (wasHost && room.players.length > 0) {
                const nextHuman = room.players.find((p: any) => !p.isBot) || room.players[0];
                nextHuman.isHost = true;
                room.host = nextHuman.id;
              }
              io.to(roomId).emit('updatePlayers', room.players);
              if (room.isPlaying) {
                io.to(roomId).emit('playerDisconnected', { playerIndex: pIdx });
              }
            }
            io.emit('publicRooms', getPublicRooms());
          }
        });

        // DISCONNECT
        socket.on('disconnect', () => {
          for (const [roomId, room] of rooms.entries()) {
            const playerIndex = room.players.findIndex((p: any) => p.id === socket.id);
            if (playerIndex !== -1) {
              const wasHost = room.players[playerIndex].isHost;
              room.players.splice(playerIndex, 1);
              if (room.players.filter((p: any) => !p.isBot).length === 0) {
                rooms.delete(roomId);
              } else {
                if (wasHost && room.players.length > 0) {
                  const nextHuman = room.players.find((p: any) => !p.isBot) || room.players[0];
                  nextHuman.isHost = true;
                  room.host = nextHuman.id;
                }
                io.to(roomId).emit('updatePlayers', room.players);
                if (room.isPlaying) {
                  io.to(roomId).emit('playerDisconnected', { playerIndex });
                }
              }
              io.emit('publicRooms', getPublicRooms());
            }
          }
        });
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [socketServerPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});

