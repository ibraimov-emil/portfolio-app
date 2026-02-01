import type { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';

interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    isAuthenticated: boolean;
  };
  timestamp: Date;
  room: string;
}

interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
  'previous-messages': (messages: ChatMessage[]) => void;
  'user-typing': (data: { userName: string }) => void;
}

interface ClientToServerEvents {
  'join-room': (data: { room: string; userName: string; isAuthenticated: boolean }) => void;
  'leave-room': (data: { room: string }) => void;
  'send-message': (data: {
    text: string;
    room: string;
    sender: { name: string; isAuthenticated: boolean };
  }) => void;
  typing: (data: { room: string; userName: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId?: string;
  userName?: string;
  isAuthenticated: boolean;
}

export default (strapi: any) => {
  const httpServer = strapi.server.httpServer as HTTPServer;

  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (token) {
        try {
          const jwtSecret = strapi.config.get('plugin.users-permissions.jwtSecret') as string;
          const decoded = verify(token, jwtSecret) as { id: string };

          // Fetch user from database
          const user = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            decoded.id,
            {
              fields: ['id', 'username', 'email'],
            }
          );

          if (user) {
            socket.data.userId = user.id.toString();
            socket.data.userName = user.username;
            socket.data.isAuthenticated = true;
          }
        } catch (error) {
          strapi.log.warn('Invalid JWT token:', error);
          // Continue as guest
          socket.data.isAuthenticated = false;
        }
      } else {
        // Guest user
        socket.data.isAuthenticated = false;
      }

      next();
    } catch (error) {
      strapi.log.error('Socket authentication error:', error);
      next(error as Error);
    }
  });

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    strapi.log.info(`Client connected: ${socket.id}`);

    socket.on('join-room', async ({ room, userName, isAuthenticated }) => {
      strapi.log.info(`User ${userName} joining room: ${room}`);
      
      // Update socket data
      if (!socket.data.userName) {
        socket.data.userName = userName;
      }
      socket.data.isAuthenticated = isAuthenticated;

      // Join the room
      socket.join(room);

      try {
        // Load previous messages from database
        const dbMessages = await strapi.entityService.findMany('api::chat-message.chat-message', {
          filters: { room },
          sort: { createdAt: 'asc' },
          limit: 100,
          populate: ['user'],
        });

        // Transform database messages to ChatMessage format
        const previousMessages: ChatMessage[] = dbMessages.map((msg: any) => ({
          id: msg.documentId || msg.id.toString(),
          text: msg.text,
          sender: {
            id: msg.senderId || 'system',
            name: msg.senderName,
            isAuthenticated: msg.isAuthenticated,
          },
          timestamp: new Date(msg.createdAt),
          room: msg.room,
        }));

        // Send previous messages to the user
        socket.emit('previous-messages', previousMessages);

        // Notify others in the room
        const joinMessage: ChatMessage = {
          id: `${Date.now()}-${socket.id}`,
          text: `${userName} joined the chat`,
          sender: {
            id: 'system',
            name: 'System',
            isAuthenticated: true,
          },
          timestamp: new Date(),
          room,
        };

        io.to(room).emit('message', joinMessage);
        
        // Save system message to database
        await strapi.entityService.create('api::chat-message.chat-message', {
          data: {
            text: joinMessage.text,
            room,
            senderName: 'System',
            senderId: 'system',
            isAuthenticated: true,
            isSystemMessage: true,
          },
        });
      } catch (error) {
        strapi.log.error('Error loading messages:', error);
        socket.emit('previous-messages', []);
      }
    });

    socket.on('leave-room', async ({ room }) => {
      strapi.log.info(`User leaving room: ${room}`);
      socket.leave(room);

      const leaveMessage: ChatMessage = {
        id: `${Date.now()}-${socket.id}`,
        text: `${socket.data.userName || 'A user'} left the chat`,
        sender: {
          id: 'system',
          name: 'System',
          isAuthenticated: true,
        },
        timestamp: new Date(),
        room,
      };

      io.to(room).emit('message', leaveMessage);
      
      // Save system message to database
      try {
        await strapi.entityService.create('api::chat-message.chat-message', {
          data: {
            text: leaveMessage.text,
            room,
            senderName: 'System',
            senderId: 'system',
            isAuthenticated: true,
            isSystemMessage: true,
          },
        });
      } catch (error) {
        strapi.log.error('Error saving leave message:', error);
      }
    });

    socket.on('send-message', async ({ text, room, sender }) => {
      strapi.log.info(`Message in room ${room}: ${text}`);

      const message: ChatMessage = {
        id: `${Date.now()}-${socket.id}`,
        text,
        sender: {
          id: socket.data.userId || socket.id,
          name: sender.name,
          isAuthenticated: socket.data.isAuthenticated,
        },
        timestamp: new Date(),
        room,
      };

      // Broadcast to all clients in the room
      io.to(room).emit('message', message);

      // Save message to database
      try {
        const savedMessage = await strapi.entityService.create('api::chat-message.chat-message', {
          data: {
            text: message.text,
            room,
            senderName: message.sender.name,
            senderId: message.sender.id,
            isAuthenticated: message.sender.isAuthenticated,
            isSystemMessage: false,
            user: socket.data.userId ? parseInt(socket.data.userId) : null,
          },
        });
        
        strapi.log.info(`Message saved with ID: ${savedMessage.documentId || savedMessage.id}`);
      } catch (error) {
        strapi.log.error('Error saving message:', error);
      }
    });

    socket.on('typing', ({ room, userName }) => {
      socket.to(room).emit('user-typing', { userName });
    });

    socket.on('disconnect', () => {
      strapi.log.info(`Client disconnected: ${socket.id}`);
    });
  });

  strapi.log.info('WebSocket server initialized');

  return io;
};
