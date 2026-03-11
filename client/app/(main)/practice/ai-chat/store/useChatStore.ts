import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: number;
}

export interface Conversation {
    id: string;
    title: string;
    topic: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export const TOPICS = [
    { id: 'assistant', label: 'General Assistant', emoji: '🤖', description: 'Helpful assistant for any questions' },
    { id: 'developer', label: 'Developer', emoji: '👨‍💻', description: 'Expert in code & architecture' },
    { id: 'teacher', label: 'Teacher', emoji: '🎓', description: 'Patient & clear explanations' },
    { id: 'chef', label: 'Chef', emoji: '👨‍🍳', description: 'Recipes & cooking techniques' },
    { id: 'fitness', label: 'Fitness Coach', emoji: '💪', description: 'Workouts & nutrition advice' },
    { id: 'writer', label: 'Writing Coach', emoji: '✍️', description: 'Creative & professional writing' },
    { id: 'psychologist', label: 'Psychologist', emoji: '🧠', description: 'Supportive & empathetic listener' },
    { id: 'lawyer', label: 'Legal Advisor', emoji: '⚖️', description: 'General legal information' },
] as const;

export type TopicId = typeof TOPICS[number]['id'];

interface ChatStore {
    conversations: Conversation[];
    activeConversationId: string | null;
    createConversation: (topic: TopicId) => string;
    setActiveConversation: (id: string) => void;
    deleteConversation: (id: string) => void;
    addMessage: (conversationId: string, message: Message) => void;
    updateLastMessage: (conversationId: string, content: string) => void;
    updateConversationTitle: (id: string, title: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            conversations: [],
            activeConversationId: null,

            createConversation: (topic) => {
                const id = generateId();
                const topicInfo = TOPICS.find((t) => t.id === topic);
                const conversation: Conversation = {
                    id,
                    title: `New ${topicInfo?.label || 'Chat'}`,
                    topic,
                    messages: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                set((state) => ({
                    conversations: [conversation, ...state.conversations],
                    activeConversationId: id,
                }));
                return id;
            },

            setActiveConversation: (id) => set({ activeConversationId: id }),

            deleteConversation: (id) => {
                const { conversations, activeConversationId } = get();
                const remaining = conversations.filter((c) => c.id !== id);
                set({
                    conversations: remaining,
                    activeConversationId:
                        activeConversationId === id
                            ? remaining[0]?.id ?? null
                            : activeConversationId,
                });
            },

            addMessage: (conversationId, message) => {
                set((state) => ({
                    conversations: state.conversations.map((c) =>
                        c.id === conversationId
                            ? {
                                ...c,
                                messages: [...c.messages, message],
                                updatedAt: Date.now(),
                            }
                            : c
                    ),
                }));
            },

            updateLastMessage: (conversationId, content) => {
                set((state) => ({
                    conversations: state.conversations.map((c) => {
                        if (c.id !== conversationId) return c;
                        const msgs = [...c.messages];
                        const lastIdx = msgs.length - 1;
                        if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
                            msgs[lastIdx] = { ...msgs[lastIdx], content };
                        }
                        return { ...c, messages: msgs, updatedAt: Date.now() };
                    }),
                }));
            },

            updateConversationTitle: (id, title) => {
                set((state) => ({
                    conversations: state.conversations.map((c) =>
                        c.id === id ? { ...c, title } : c
                    ),
                }));
            },
        }),
        { name: 'ai-chat-store' }
    )
);
