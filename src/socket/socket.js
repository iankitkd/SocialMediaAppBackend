import { Server } from 'socket.io';

import { authenticateSocket } from '../middlewares/authenticateSocket.js';
import { FRONTEND_ORIGIN } from "../config/serverConfig.js";
import MessageService from '../services/message.service.js';

const messageService = new MessageService();
const onlineUsers = new Map();

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { 
        origin: FRONTEND_ORIGIN, 
        methods: ["GET", "POST"],
        credentials: true 
    }
  });

  // io.use(authenticateSocket);

  io.on('connection', (socket) => {
    // const senderId = socket.user.id;

    // On sending message
    socket.on('sendMessage', async (data) => {
      const { senderId, receiverId, content, isTemporaryMessage } = data;

      if(!isTemporaryMessage) {
        await messageService.createMessage({content, senderId, receiverId});
      }

      const concatStr = isTemporaryMessage ? "_temp" : "";
      const roomId = [senderId, receiverId].sort().join('_').concat(concatStr);

      // Send message to both participants
      io.to(roomId).emit('receiveMessage', {content, senderId, roomId, createdAt: Date.now()});
    });

    // Join chat room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
    });

    // join temporary chat room (disappearing chat)
    socket.on('joinTempRoom', ({ roomId, username }) => {
      const tempRoomId = `${roomId}_temp`;
      socket.join(tempRoomId);
      io.to(roomId).emit('receiveMessage', {content: `${username} started Temporary chat`, senderId:"system", roomId:roomId, type: "system", createdAt: Date.now()});
    });

    // leave temporary chat room (disappearing chat)
    socket.on('leaveTempRoom', ({ roomId, username }) => {
      const tempRoomId = `${roomId}_temp`;
      socket.leave(tempRoomId);
      io.to(tempRoomId).emit('receiveMessage', {content: `${username} leave Temporary chat`, senderId:"system", roomId:tempRoomId, type: "system", createdAt: Date.now()});
    });

    // register user on connection to onlineUsers map
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("userOnline", { userId });
    });

    socket.on("checkUserStatus", ({ userId }) => {
      const isOnline = onlineUsers.has(userId);
      socket.emit("userStatus", { userId, online: isOnline });
    });

    // on disconnect
    socket.on('disconnect', () => {
      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          io.emit("userOffline", { userId });
          break;
        }
      }
    });
  });
};
