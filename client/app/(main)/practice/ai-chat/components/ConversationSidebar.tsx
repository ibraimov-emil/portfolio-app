'use client';

import React from 'react';
import { useChatStore, TOPICS } from '../store/useChatStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ConversationSidebarProps {
    onNewChat: () => void;
}

export function ConversationSidebar({ onNewChat }: ConversationSidebarProps) {
    const { conversations, activeConversationId, setActiveConversation, deleteConversation } = useChatStore();

    return (
        <aside className="w-72 flex-shrink-0 h-full flex flex-col bg-slate-900 border-r border-slate-700">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    AI Chat
                </h2>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 px-3"
                    onClick={onNewChat}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                </Button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 p-2">
                {conversations.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-slate-500 text-xs">No conversations yet. Start a new chat!</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => {
                            const topic = TOPICS.find((t) => t.id === conv.topic);
                            const isActive = conv.id === activeConversationId;
                            return (
                                <div
                                    key={conv.id}
                                    className={cn(
                                        'group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors',
                                        isActive
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                    onClick={() => setActiveConversation(conv.id)}
                                >
                                    <span className="text-lg flex-shrink-0">{topic?.emoji || '🤖'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate font-medium">{conv.title}</p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {formatDistanceToNow(conv.updatedAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <button
                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all flex-shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConversation(conv.id);
                                        }}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>
        </aside>
    );
}
