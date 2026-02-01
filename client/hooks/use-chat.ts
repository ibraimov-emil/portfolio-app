'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getSocket, disconnectSocket } from '@/lib/socket';
import type { ChatMessage } from '@/types/chat';
import type { Socket } from 'socket.io-client';

interface UseChatOptions {
  room: string;
  userName: string;
  isAuthenticated: boolean;
}

export const useChat = ({ room, userName, isAuthenticated }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!userName || !room) return;

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      // Join the room
      socket.emit('join-room', { room, userName, isAuthenticated });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handlePreviousMessages = (previousMessages: ChatMessage[]) => {
      setMessages(previousMessages);
    };

    const handleUserTyping = (data: { userName: string }) => {
      if (data.userName !== userName) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message', handleMessage);
    socket.on('previous-messages', handlePreviousMessages);
    socket.on('user-typing', handleUserTyping);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message', handleMessage);
      socket.off('previous-messages', handlePreviousMessages);
      socket.off('user-typing', handleUserTyping);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Leave the room
      socket.emit('leave-room', { room });
    };
  }, [room, userName, isAuthenticated]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim()) return;

      const message = {
        text: text.trim(),
        room,
        sender: {
          name: userName,
          isAuthenticated,
        },
      };

      socketRef.current.emit('send-message', message);
    },
    [room, userName, isAuthenticated]
  );

  const emitTyping = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('typing', { room, userName });
  }, [room, userName]);

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    emitTyping,
  };
};
