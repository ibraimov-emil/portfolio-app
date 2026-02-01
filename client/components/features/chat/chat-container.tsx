'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import type { ChatRoom } from '@/types/chat';
import { Loader2 } from 'lucide-react';

interface ChatContainerProps {
  room: ChatRoom;
  userName: string;
  isAuthenticated: boolean;
  currentUserId?: string;
}

export function ChatContainer({
  room,
  userName,
  isAuthenticated,
  currentUserId
}: ChatContainerProps) {
  const { messages, isConnected, isTyping, sendMessage, emitTyping } = useChat({
    room: room.id,
    userName,
    isAuthenticated,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isConnected) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between p-4 space-y-4">
          <div className="space-y-6 pt-4">
            <div className="flex justify-end"><Skeleton className="h-12 w-[60%] rounded-xl" /></div>
            <div className="flex justify-start"><Skeleton className="h-16 w-[70%] rounded-xl" /></div>
            <div className="flex justify-end"><Skeleton className="h-10 w-[40%] rounded-xl" /></div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t mt-auto">
            <div className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{room.name}</CardTitle>
            {room.description && (
              <CardDescription>{room.description}</CardDescription>
            )}
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Chatting as: <span className="font-medium">{userName}</span>
          {isAuthenticated && <span className="ml-1">(Verified)</span>}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.sender.name === userName}
              />
            ))
          )}

          {isTyping && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        onSend={sendMessage}
        onTyping={emitTyping}
        disabled={!isConnected}
        placeholder={`Message in ${room.name}...`}
      />
    </Card>
  );
}
