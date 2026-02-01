import { io, Socket } from 'socket.io-client';
import { getCookie, COOKIE_NAMES } from './cookies';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
    
    // Use the base URL without /api for WebSocket connection
    const wsUrl = process.env.NEXT_PUBLIC_API_URL_IMAGE || 'http://localhost:1337';
    
    socket = io(wsUrl, {
      auth: {
        token: token || null,
      },
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
