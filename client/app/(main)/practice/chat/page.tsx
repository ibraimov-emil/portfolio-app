"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChatContainer } from "@/components/features/chat/chat-container";
import { GuestNameDialog } from "@/components/features/chat/guest-name-dialog";
import { ChatSidebar } from "./_components/chat-sidebar";
import { CHAT_ROOMS, ChatRoom, ChatRoomType, OWNER_EMAIL } from "@/types/chat";
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  const { user, isAuthenticated, isLoading: authLoading, setLoginOpen } = useAuth();

  // State
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("");
  const [guestId, setGuestId] = useState<string>("");
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  // Guest Name & ID persistence
  useEffect(() => {
    const savedName = localStorage.getItem("chat_guest_name");
    if (savedName) setGuestName(savedName);

    let savedId = localStorage.getItem("chat_guest_id");
    if (!savedId) {
      savedId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_guest_id", savedId);
    }
    setGuestId(savedId);
  }, []);

  const handleGuestNameSubmit = (name: string) => {
    setGuestName(name);
    localStorage.setItem("chat_guest_name", name);
    setShowGuestDialog(false);
  };

  // Logic to determine the active room object
  const getActiveRoom = (): ChatRoom | null => {
    if (!selectedRoomId) return null;

    // Test Room
    if (selectedRoomId === 'test') return CHAT_ROOMS.test;

    // Owner Support Logic
    if (selectedRoomId === 'owner-support') {
      // Generate unique private room ID
      // If authenticated: private-owner-user-{userId}
      // If guest: private-owner-guest-{guestId}
      const identifier = isAuthenticated && user
        ? `user-${user.id}`
        : `guest-${guestId}`;

      return {
        id: `private-owner-${identifier}`,
        name: 'Support (Owner)',
        description: 'Private secure channel'
      };
    }

    // Owner viewing specific user chat
    if (selectedRoomId.startsWith('private-owner-')) {
      return {
        id: selectedRoomId,
        name: 'Direct Message',
        description: 'Private conversation'
      };
    }

    return null;
  };

  const handleSelectRoom = (roomId: string) => {
    if (!isAuthenticated && !guestName && roomId !== 'test') { // Allow test without name? usually need name
      setShowGuestDialog(true);
      return;
    }

    if (!isAuthenticated && !guestName) {
      setShowGuestDialog(true);
      return;
    }

    setSelectedRoomId(roomId);
  };

  const activeRoom = getActiveRoom();
  const userName = isAuthenticated && user ? user.username : guestName;
  // If user is owner, they are "Owner" in chat, or their username.
  const displayUserName = (user?.email === OWNER_EMAIL) ? 'Owner' : userName;

  if (authLoading) {
    return (
      <div className="container mx-auto py-6 h-[calc(100vh-100px)]">
        <Card className="flex h-full overflow-hidden border-2">
          {/* Sidebar Skeleton */}
          <div className="w-80 flex-shrink-0 hidden md:block border-r p-4 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Main Chat Area Skeleton */}
          <div className="flex-1 flex flex-col bg-background">
            <div className="h-16 border-b p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="flex justify-end"><Skeleton className="h-12 w-64 rounded-xl" /></div>
              <div className="flex justify-start"><Skeleton className="h-12 w-48 rounded-xl" /></div>
              <div className="flex justify-end"><Skeleton className="h-20 w-72 rounded-xl" /></div>
            </div>
            <div className="p-4 border-t">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 h-[calc(100vh-100px)]">
      <Card className="flex h-full overflow-hidden border-2">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 hidden md:block border-r">
          <ChatSidebar
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleSelectRoom}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {activeRoom ? (
            <ChatContainer
              room={activeRoom}
              userName={displayUserName}
              isAuthenticated={isAuthenticated}
              currentUserId={user?.id?.toString()}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h3 className="text-lg font-medium">Welcome to Practice Chat</h3>
                <p className="text-sm">Select a room from the sidebar to start chatting.</p>

                {/* Mobile sidebar trigger could go here if needed */}
                <div className="md:hidden mt-4">
                  {/* Simple Mobile View fallback - just render sidebar content */}
                  <ChatSidebar
                    className="border rounded-lg max-w-xs mx-auto text-left"
                    selectedRoomId={selectedRoomId}
                    onSelectRoom={handleSelectRoom}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <GuestNameDialog
        open={showGuestDialog}
        onSubmit={handleGuestNameSubmit}
      />
    </div>
  );
}
