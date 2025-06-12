import { Server } from 'socket.io';

import { authenticateSocket } from '../middlewares/authenticateSocket.js';
import { FRONTEND_ORIGIN } from "../config/serverConfig.js";
import MessageService from '../services/message.service.js';

const messageService = new MessageService();

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { 
        origin: FRONTEND_ORIGIN, 
        methods: ["GET", "POST"],
        credentials: true 
    }
  });

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const senderId = socket.user.id;
    console.log(`User connected: ${senderId}`);

    // On sending message
    socket.on('sendMessage', async (data) => {
      const { receiverId, content } = data;
      await messageService.createMessage({content, senderId, receiverId});

      const roomId = [senderId, receiverId].sort().join('_');

      // Send message to both participants
      io.to(roomId).emit('receiveMessage', {content, senderId, roomId, createdAt: Date.now()});
    });

    // Join chat room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: `);
    });
  });
};
