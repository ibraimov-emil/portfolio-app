'use client';

import React from 'react';
import { TOPICS, TopicId } from '../store/useChatStore';
import { cn } from '@/lib/utils';

interface TopicPickerProps {
    onSelect: (topic: TopicId) => void;
}

export function TopicPicker({ onSelect }: TopicPickerProps) {
    return (
        <div className="flex-1 flex items-center justify-center bg-slate-950 p-8">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">✨</div>
                    <h1 className="text-3xl font-bold text-white mb-2">AI Chat</h1>
                    <p className="text-slate-400">Choose a topic to get started. The AI will play a role based on your selection.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TOPICS.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => onSelect(topic.id)}
                            className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700',
                                'bg-slate-900 hover:bg-slate-800 hover:border-indigo-500',
                                'text-white transition-all duration-200 text-left',
                                'hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5'
                            )}
                        >
                            <span className="text-3xl">{topic.emoji}</span>
                            <div>
                                <p className="font-semibold text-sm text-white">{topic.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{topic.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
