import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import type { ChatRoom } from '@/types/chat';
import { Loader2, History, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

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

  // Filter messages
  // We use the 'isSystemMessage' flag if available, or fallback to checking sender 'System'
  const isSystemMsg = (msg: any) => msg.isSystemMessage || msg.sender.name === 'System';

  const displayMessages = messages.filter(m => !isSystemMsg(m));
  const systemMessages = messages.filter(m => isSystemMsg(m)).reverse();
  const latestSystemMessage = systemMessages.length > 0 ? systemMessages[systemMessages.length - 1] : null;

  // Auto-scroll to bottom when new DISPLAY messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages.length, isTyping]); // Only scroll on new visible messages

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
      <CardHeader className="border-b py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <Badge variant={isConnected ? 'outline' : 'secondary'} className="text-[10px] h-5 px-1.5 font-normal">
                {isConnected ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* System Message / Status Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent justify-start font-normal text-muted-foreground">
                  <span className="text-xs truncate max-w-[250px] flex items-center gap-1">
                    {latestSystemMessage ? (
                      <span className={latestSystemMessage.text.includes('left') ? 'text-orange-500/70' : 'text-green-500/70'}>
                        {latestSystemMessage.text}
                      </span>
                    ) : (
                      room.description || "Chat Room"
                    )}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[300px] p-0">
                <div className="p-2 border-b text-xs font-semibold bg-muted/50">
                  Connection History
                </div>
                <ScrollArea className="h-[200px] p-2">
                  {systemMessages.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">No activity yet</div>
                  ) : (
                    <div className="space-y-2">
                      {systemMessages.map((msg) => (
                        <div key={msg.id} className="text-xs flex justify-between items-start gap-2">
                          <span className={msg.text.includes('left') ? 'text-muted-foreground' : 'text-foreground'}>
                            {msg.text}
                          </span>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap opacity-70">
                            {format(new Date(msg.timestamp), 'HH:mm')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">{userName}</span>
              {isAuthenticated && <span className="ml-1 text-[10px] border px-1 rounded">Verified</span>}
            </div>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef}>
          {displayMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            displayMessages.map((message) => (
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
