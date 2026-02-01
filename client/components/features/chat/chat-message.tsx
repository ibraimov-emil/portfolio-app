import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const time = format(new Date(message.timestamp), 'HH:mm');
  const initials = message.sender.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(
          'text-xs',
          isOwn ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium">{message.sender.name}</span>
          {message.sender.isAuthenticated && (
            <span className="text-xs text-muted-foreground">Verified</span>
          )}
        </div>
        
        <div
          className={cn(
            'rounded-lg px-4 py-2 max-w-[70%] break-words',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">{time}</span>
      </div>
    </div>
  );
}
