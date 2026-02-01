export interface ChatMessage {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    isAuthenticated: boolean;
  };
  timestamp: Date;
  room: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
}

export type ChatRoomType = 'test' | 'owner';

export const OWNER_EMAIL = 'emil.ibramovich@gmail.com';

export const CHAT_ROOMS: Record<ChatRoomType, ChatRoom> = {
  test: {
    id: 'test',
    name: 'Test Chat',
    description: 'Practice using the chat interface',
  },
  owner: {
    id: 'owner', // This is a placeholder, actual ID will be dynamic
    name: 'Contact Owner',
    description: 'Send a message to the site owner',
  },
};
