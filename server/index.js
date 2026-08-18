const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 3001;

// Required for 1M CCU: Redis ensures all Node.js instances can talk to each other
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`Primary ${process.pid} is running`);
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(cors());
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Restrict this in production to your domain/app URL
      methods: ["GET", "POST"]
    }
  });

  // Redis Adapter Setup
  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log(`Worker ${process.pid} connected to Redis`);
  }).catch(err => {
    console.log(`Worker ${process.pid} Redis connection failed. Running locally without scaling.`, err.message);
  });

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

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // CREATE ROOM
    socket.on('createRoom', (data = {}) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const playerName = data.name || 'Player 1';
      const maxPlayers = data.maxPlayers || 4;
      const avatar = data.avatar || 0;
      const mode = data.mode || (data.special === false ? 'classic' : 'nomercy');
      const sessionToken = data.sessionToken || Math.random().toString(36).substring(2, 15);

      const room = {
        id: roomId,
        name: data.roomName || `Room ${roomId}`,
        host: socket.id,
        players: [{ id: socket.id, sessionToken: sessionToken, name: playerName, avatar: avatar, isReady: true, isHost: true, isBot: false }],
        maxPlayers: maxPlayers,
        mode: mode,
        special: mode !== 'classic',
        pointIndex: data.pointIndex || 0,
        houseRules: data.houseRules || {
          jumpIn: true,
          drawUntilPlayable: false,
          challenge4: true,
          stacking: true,
          mercyKO: true,
          swap70: true
        },
        isPlaying: false,
        created: Date.now()
      };

      rooms.set(roomId, room);
      socket.join(roomId);

      socket.emit('roomCreated', { roomId, room, sessionToken });
      io.to(roomId).emit('updatePlayers', room.players);
      io.emit('publicRooms', getPublicRooms());
    });

    // LIST PUBLIC ROOMS
    socket.on('listRooms', () => {
      socket.emit('publicRooms', getPublicRooms());
    });

    // UPDATE ROOM OPTIONS (Host)
    socket.on('updateRoomOptions', (data = {}) => {
      if (!data.roomId) return;
      const room = rooms.get(data.roomId);
      if (!room || room.host !== socket.id) return;

      if (data.mode) room.mode = data.mode;
      if (data.special !== undefined) room.special = data.special;
      if (data.pointIndex !== undefined) room.pointIndex = data.pointIndex;
      if (data.maxPlayers !== undefined) room.maxPlayers = data.maxPlayers;
      if (data.houseRules) room.houseRules = Object.assign(room.houseRules || {}, data.houseRules);

      io.to(data.roomId).emit('roomOptions', {
        maxPlayers: room.maxPlayers,
        mode: room.mode,
        special: room.special,
        pointIndex: room.pointIndex,
        houseRules: room.houseRules
      });
      io.emit('publicRooms', getPublicRooms());
    });

    // JOIN ROOM (Code)
    socket.on('joinRoom', (data = {}) => {
      const roomId = (data.roomId || '').toUpperCase();
      const room = rooms.get(roomId);

      if (!room) {
        return socket.emit('joinError', 'Room not found! Check your code.');
      }

      // Check session token reconnection
      if (data.sessionToken) {
        const existingPlayer = room.players.find(p => p.sessionToken === data.sessionToken);
        if (existingPlayer) {
          existingPlayer.id = socket.id;
          socket.join(roomId);
          socket.emit('roomJoined', { roomId, room, reconnected: true, sessionToken: data.sessionToken });
          io.to(roomId).emit('updatePlayers', room.players);
          return;
        }
      }

      if (room.players.length >= room.maxPlayers) {
        return socket.emit('joinError', 'Room is currently full.');
      }
      if (room.isPlaying) {
        return socket.emit('joinError', 'Game is already in progress.');
      }

      const playerName = data.name || `Player ${room.players.length + 1}`;
      const avatar = data.avatar !== undefined ? data.avatar : room.players.length;
      const sessionToken = data.sessionToken || Math.random().toString(36).substring(2, 15);

      const playerObj = {
        id: socket.id,
        sessionToken: sessionToken,
        name: playerName,
        avatar: avatar,
        isReady: false,
        isHost: false,
        isBot: false
      };

      room.players.push(playerObj);
      socket.join(roomId);

      socket.emit('roomJoined', { roomId, room, sessionToken });
      io.to(roomId).emit('updatePlayers', room.players);
      socket.emit('roomOptions', {
        maxPlayers: room.maxPlayers,
        mode: room.mode || (room.special ? 'special' : 'classic'),
        special: room.special,
        pointIndex: room.pointIndex,
        houseRules: room.houseRules
      });
      io.emit('publicRooms', getPublicRooms());
    });

    // RECONNECT WITH SESSION TOKEN
    socket.on('reconnectSession', (data = {}) => {
      if (!data.roomId || !data.sessionToken) return;
      const room = rooms.get(data.roomId.toUpperCase());
      if (!room) return socket.emit('reconnectFailed', 'Room no longer exists');

      const existingPlayer = room.players.find(p => p.sessionToken === data.sessionToken);
      if (existingPlayer) {
        existingPlayer.id = socket.id;
        socket.join(room.id);
        socket.emit('reconnectedSuccess', { roomId: room.id, room });
        io.to(room.id).emit('updatePlayers', room.players);
      } else {
        socket.emit('reconnectFailed', 'Session expired');
      }
    });

    // QUICK EMOJI REACTION WHEEL
    socket.on('sendReaction', (data = {}) => {
      if (!data.roomId) return;
      io.to(data.roomId).emit('playerReaction', {
        senderId: socket.id,
        playerIndex: data.playerIndex,
        emoji: data.emoji || '🎉',
        timestamp: Date.now()
      });
    });

    // ADD BOT
    socket.on('addBot', (data = {}) => {
      if (!data.roomId) return;
      const room = rooms.get(data.roomId);
      if (!room) return;
      if (room.isPlaying) return;
      if (room.players.length >= room.maxPlayers) return;

      const botIdx = room.players.filter(p => p.isBot).length;
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

    // REMOVE BOT
    socket.on('removeBot', (data = {}) => {
      if (!data.roomId) return;
      const room = rooms.get(data.roomId);
      if (!room || room.isPlaying) return;

      const lastBotIdx = room.players.map(p => p.isBot).lastIndexOf(true);
      if (lastBotIdx !== -1) {
        room.players.splice(lastBotIdx, 1);
        io.to(data.roomId).emit('updatePlayers', room.players);
        io.emit('publicRooms', getPublicRooms());
      }
    });

    // QUICK MATCH
    socket.on('quickMatch', (data = {}) => {
      let foundRoom = null;
      for (const [, room] of rooms.entries()) {
        if (!room.isPlaying && room.players.length < room.maxPlayers) {
          foundRoom = room;
          break;
        }
      }

      const playerName = data.name || 'Player';
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
          isPlaying: false,
          created: Date.now()
        };
        rooms.set(roomId, room);
        socket.join(roomId);
        socket.emit('roomCreated', { roomId, room });
        io.to(roomId).emit('updatePlayers', room.players);
        io.emit('publicRooms', getPublicRooms());
      }
    });

    // TOGGLE READY STATUS
    socket.on('toggleReady', (data = {}) => {
      const roomId = data.roomId;
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.isReady = !player.isReady;
        io.to(roomId).emit('updatePlayers', room.players);
      }
    });

    // IN-LOBBY & IN-GAME CHAT
    socket.on('sendChat', (data = {}) => {
      if (!data.roomId) return;
      io.to(data.roomId).emit('chatMessage', {
        senderId: socket.id,
        senderName: data.senderName || 'Player',
        message: data.message || '',
        emoji: data.emoji || '',
        timestamp: Date.now()
      });
    });

    // PLAYER ACTIONS / GAME SYNC
    socket.on('gameAction', (data = {}) => {
      if (!data.roomId) return;
      const room = rooms.get(data.roomId);
      if (room && (data.action === 'start' || data.action === 'startgame')) {
        room.isPlaying = true;
        io.emit('publicRooms', getPublicRooms());
      }

      if (data.includeSender) {
        io.to(data.roomId).emit('gameAction', data);
      } else {
        socket.to(data.roomId).emit('gameAction', data);
      }
    });

    // LEAVE ROOM
    socket.on('leaveRoom', (data = {}) => {
      const roomId = data.roomId;
      const room = rooms.get(roomId);
      if (!room) return;

      const pIdx = room.players.findIndex(p => p.id === socket.id);
      if (pIdx !== -1) {
        const wasHost = room.players[pIdx].isHost;
        room.players.splice(pIdx, 1);
        socket.leave(roomId);

        if (room.players.filter(p => !p.isBot).length === 0) {
          rooms.delete(roomId);
        } else {
          if (wasHost && room.players.length > 0) {
            const nextHuman = room.players.find(p => !p.isBot) || room.players[0];
            nextHuman.isHost = true;
            room.host = nextHuman.id;
          }
          io.to(roomId).emit('updatePlayers', room.players);
          if (room.isPlaying) {
            io.to(roomId).emit('playerDisconnected', pIdx);
          }
        }
        io.emit('publicRooms', getPublicRooms());
      }
    });

    // DISCONNECT LOGIC
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      for (const [roomId, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socket.id);

        if (playerIndex !== -1) {
          const wasHost = room.players[playerIndex].isHost;
          room.players.splice(playerIndex, 1);
          if (room.players.filter(p => !p.isBot).length === 0) {
            rooms.delete(roomId);
          } else {
            if (wasHost && room.players.length > 0) {
              const nextHuman = room.players.find(p => !p.isBot) || room.players[0];
              nextHuman.isHost = true;
              room.host = nextHuman.id;
            }
            io.to(roomId).emit('updatePlayers', room.players);
            if (room.isPlaying) {
              io.to(roomId).emit('playerDisconnected', playerIndex);
            }
          }
          io.emit('publicRooms', getPublicRooms());
        }
      }
    });
  });

  httpServer.listen(PORT, '127.0.0.1', () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });
}
