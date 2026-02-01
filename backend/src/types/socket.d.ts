import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    data: {
      userId?: string;
      userName?: string;
      isAuthenticated: boolean;
    };
  }
}
