'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore, TOPICS, Message } from './store/useChatStore';
import { useStreamingChat } from './hooks/useStreamingChat';
import { ConversationSidebar } from './components/ConversationSidebar';
import { TopicPicker } from './components/TopicPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function AIChatPage() {
    const { conversations, activeConversationId, createConversation, addMessage, updateLastMessage } = useChatStore();
    const { isStreaming, sendMessage, stopStreaming } = useStreamingChat();
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    const topicInfo = TOPICS.find((t) => t.id === activeConversation?.topic);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeConversation?.messages, isStreaming]);

    const handleNewChat = () => {
        useChatStore.getState().setActiveConversation(''); // Clear active to show picker
    };

    const handleTopicSelect = (topicId: any) => {
        createConversation(topicId);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !activeConversation || isStreaming) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            createdAt: Date.now(),
        };

        addMessage(activeConversation.id, userMsg);
        setInputValue('');

        // Prepare context for API
        const messagesForApi = [...activeConversation.messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Add empty assistant message to store so we can update it
        const assistantMsgId = (Date.now() + 1).toString();
        addMessage(activeConversation.id, {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            createdAt: Date.now(),
        });

        let currentResponse = '';

        await sendMessage(
            messagesForApi,
            activeConversation.topic,
            (chunk) => {
                currentResponse += chunk;
                updateLastMessage(activeConversation.id, currentResponse);
            },
            () => {
                // Done
            },
            (err) => {
                toast({ title: 'Error', description: err, variant: 'destructive' });
                updateLastMessage(activeConversation.id, currentResponse + '\n\n**[Error: Connection interrupted]**');
            }
        );
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-slate-950 text-slate-200 overflow-hidden">
            {/* Sidebar */}
            <ConversationSidebar onNewChat={handleNewChat} />

            {/* Main Content */}
            {!activeConversation ? (
                <TopicPicker onSelect={handleTopicSelect} />
            ) : (
                <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
                    {/* Header */}
                    <header className="h-14 border-b border-slate-800 flex items-center px-6 shrink-0 bg-slate-900/50 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-2xl">{topicInfo?.emoji}</span>
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-white leading-tight">{activeConversation.title}</h2>
                                <span className="text-xs text-slate-400 capitalize">{topicInfo?.label} Mode</span>
                            </div>
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollRef}>
                        <div className="max-w-3xl mx-auto space-y-6">
                            {activeConversation.messages.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">{topicInfo?.emoji}</div>
                                    <h3 className="text-xl font-medium text-white mb-2">
                                        Chat with {topicInfo?.label}
                                    </h3>
                                    <p className="text-slate-400 max-w-md mx-auto">
                                        You are now talking to an AI playing the role of a {topicInfo?.label.toLowerCase()}.
                                        Ask anything related to this topic.
                                    </p>
                                </div>
                            ) : null}

                            {activeConversation.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex gap-4 w-full',
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/50 mt-1">
                                            <Bot className="h-5 w-5 text-indigo-400" />
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            'px-4 py-3 rounded-2xl max-w-[85%] md:max-w-[75%]',
                                            msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/50'
                                        )}
                                    >
                                        <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content || (isStreaming && msg.role === 'assistant' ? '...' : '')}
                                            </ReactMarkdown>
                                        </div>
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                                            <User className="h-5 w-5 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <div className="max-w-3xl mx-auto relative">
                            {isStreaming ? (
                                <div className="flex justify-center mb-2 absolute -top-12 left-0 right-0">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={stopStreaming}
                                        className="rounded-full shadow-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                                    >
                                        <StopCircle className="h-4 w-4 mr-2 text-red-400" />
                                        Stop generating
                                    </Button>
                                </div>
                            ) : null}

                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={`Message ${topicInfo?.label || 'assistant'}...`}
                                    className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-full px-6 focus-visible:ring-indigo-500"
                                    disabled={isStreaming}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!inputValue.trim() || isStreaming}
                                    className="rounded-full h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-slate-500">AI can make mistakes. Verify important information.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
