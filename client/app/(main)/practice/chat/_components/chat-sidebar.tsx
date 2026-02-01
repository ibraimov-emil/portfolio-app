"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CHAT_ROOMS, ChatRoomType, OWNER_EMAIL } from "@/types/chat";
import { MessageSquare, Users, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/services/axios";

interface ChatSidebarProps {
    selectedRoomId: string | null;
    onSelectRoom: (roomId: string) => void;
    className?: string;
}

interface ActiveChat {
    id: string; // The room ID string
    name: string; // Display name (e.g., "Guest 123" or "User Name")
    lastMessage?: string;
    timestamp?: string;
}

export function ChatSidebar({ selectedRoomId, onSelectRoom, className }: ChatSidebarProps) {
    const { user } = useAuth();
    const isOwner = user?.email === OWNER_EMAIL;

    const [activeOwnerChats, setActiveOwnerChats] = useState<ActiveChat[]>([]);

    const [error, setError] = useState<string | null>(null);

    // For owner: fetch list of active private chats
    // access to chat-message collection is required
    const fetchActiveChats = useCallback(async () => {
        if (!isOwner) return;

        try {
            setError(null);
            console.log("Fetching owner chats...");
            // Fetch messages that start with 'private-owner-'
            // Note: Strapi filters might need adjustment based on exact capability
            // This is a simplified approach assuming we can search or unique distinct rooms
            // Since standard Strapi doesn't have "distinct" easily exposed via REST for fields,
            // we might fetch recent messages and filter client side for MVP or needs custom endpoint.

            // MVP Strategy: Fetch last 100 messages to extract recent active rooms
            const { data } = await axiosInstance.get('/chat-messages', {
                params: {
                    pagination: { pageSize: 100 },
                    sort: ['createdAt:desc'],
                    filters: {
                        room: {
                            $startsWith: 'private-owner-'
                        }
                    }
                }
            });

            const uniqueRooms = new Map<string, ActiveChat>();

            if (data?.data) {
                // First pass: Collect all messages by room
                const roomMessages = new Map<string, any[]>();
                data.data.forEach((msg: any) => {
                    if (!roomMessages.has(msg.room)) {
                        roomMessages.set(msg.room, []);
                    }
                    roomMessages.get(msg.room)?.push(msg);
                });

                // Second pass: process each room
                roomMessages.forEach((msgs, room) => {
                    let displayName = `Guest`;

                    // Strategy: Find the first message from the actual user to get their name
                    // Check for any message where sender is NOT Owner and NOT System
                    const userMsg = msgs.find((m: any) => m.senderName !== 'Owner' && m.senderName !== 'System');

                    if (userMsg) {
                        displayName = userMsg.senderName;
                    } else {
                        // Fallback: Try to parse "User joined" system messages if needed, or stick with Guest
                        // If it's a registered user room (user-ID), we might want to fetch user, but message history is easiest
                        if (room.includes('user-')) {
                            displayName = "User";
                        }
                    }

                    // Get last message info
                    const lastMsg = msgs[0]; // Sort was desc, so 0 is latest

                    uniqueRooms.set(room, {
                        id: room,
                        name: displayName,
                        lastMessage: lastMsg.text,
                        timestamp: lastMsg.createdAt
                    });
                });

                setActiveOwnerChats(Array.from(uniqueRooms.values()));
            }
        } catch (error: any) {
            console.error("Failed to fetch active chats", error);
            // Check specifically for 403 to give better guidance
            if (error.response?.status === 403) {
                setError("Missing Permissions (403). check Strapi > Settings > Users & Permissions > Roles > Authenticated > Chat-message > find");
            } else {
                setError("Failed to load active chats.");
            }
        }
    }, [isOwner, user?.username]);

    // Initial fetch
    useEffect(() => {
        fetchActiveChats();
        // Poll every 10s for new chats
        const interval = setInterval(fetchActiveChats, 10000);
        return () => clearInterval(interval);

    }, [fetchActiveChats]);


    return (
        <div className={cn("flex flex-col h-full bg-muted/10 border-r", className)}>
            <div className="p-4 border-b">
                <h2 className="font-semibold mb-1">Practice Chat</h2>
                <p className="text-xs text-muted-foreground">
                    {isOwner ? "Owner Panel" : "Select a room"}
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {/* Public / Common Rooms */}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                        Public Rooms
                    </div>

                    <Button
                        variant={selectedRoomId === 'test' ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => onSelectRoom('test')}
                    >
                        <Users className="h-4 w-4" />
                        <span>test</span>
                    </Button>

                    {/* Owner Support Channel */}
                    {!isOwner && (
                        <>
                            <div className="px-2 py-1.5 mt-4 text-xs font-medium text-muted-foreground uppercase">
                                Support
                            </div>
                            <Button
                                variant={selectedRoomId === 'owner-support' ? "secondary" : "ghost"}
                                className="w-full justify-start gap-2"
                                onClick={() => onSelectRoom('owner-support')} // Special ID for logic handling in parent
                            >
                                <Shield className="h-4 w-4" />
                                <span>Contact Owner</span>
                            </Button>
                        </>
                    )}

                    {/* Owner specific list */}
                    {isOwner && (
                        <>
                            <div className="px-2 py-1.5 mt-4 text-xs font-medium text-muted-foreground uppercase">
                                Direct Messages
                            </div>

                            {error && (
                                <div className="mx-2 mb-2 p-2 text-xs bg-red-100 text-red-600 rounded border border-red-200">
                                    <p className="mb-2">{error}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 text-xs w-full bg-white hover:bg-red-50"
                                        onClick={() => fetchActiveChats()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            )}

                            {!error && activeOwnerChats.length === 0 && (
                                <div className="px-4 py-2 text-sm text-muted-foreground italic">
                                    No active chats
                                </div>
                            )}

                            {activeOwnerChats.map(chat => (
                                <Button
                                    key={chat.id}
                                    variant={selectedRoomId === chat.id ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-2 overflow-hidden"
                                    onClick={() => onSelectRoom(chat.id)}
                                >
                                    <MessageSquare className="h-4 w-4 shrink-0" />
                                    <div className="flex flex-col items-start truncate">
                                        <span className="truncate w-full text-left">{chat.name}</span>
                                        {chat.lastMessage && (
                                            <span className="text-[10px] text-muted-foreground truncate w-full text-left font-normal opacity-70">
                                                {chat.lastMessage}
                                            </span>
                                        )}
                                    </div>
                                </Button>
                            ))}
                        </>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
                <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="truncate max-w-[150px]">
                        {user ? user.username : 'Guest'}
                    </span>
                </div>
            </div>
        </div>
    );
}
