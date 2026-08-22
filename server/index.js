const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');

const { rooms, BOT_NAMES, getPublicRooms } = require('./room_manager');
const { registerSocketHandlers } = require('./socket_handlers');

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

  io.on('connection', (socket) => {
    registerSocketHandlers(io, socket, { rooms, BOT_NAMES, getPublicRooms });
  });

  httpServer.listen(PORT, '127.0.0.1', () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });
}
