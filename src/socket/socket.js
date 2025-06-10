import { Server } from 'socket.io';

import { authenticateSocket } from '../middlewares/authenticateSocket.js';
import { FRONTEND_ORIGIN } from "../config/serverConfig.js";


export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { 
        origin: FRONTEND_ORIGIN, 
        credentials: true 
    }
  });

  // io.use(authenticateSocket);

  io.on('connection', (socket) => {
    // const userId = socket.user.id;
    console.log(`User connected: `);

    // On sending message
    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, content } = data;

      const roomId = [senderId, receiverId].sort().join('_');

    //   const newMessage = new Message({
    //     senderId,
    //     receiverId,
    //     content,
    //     roomId
    //   });

    //   await newMessage.save();

      // Send message to both participants
    //   io.to(roomId).emit('receiveMessage', newMessage);
      io.to(roomId).emit('receiveMessage', {content, receiverId, senderId, roomId, createdAt: Date.now()});
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
