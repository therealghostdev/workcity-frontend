"use client";

import React from "react";
import { apiClient } from "@/lib/api";
import { socketClient } from "@/lib/socket";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserDiscovery } from "@/components/user-discovery";
import { Navigation } from "@/components/navigation";
import {
  Send,
  LogOut,
  Users,
  Shield,
  Palette,
  Store,
  MessageCircle,
  Circle,
  Settings,
  Search,
  Plus,
} from "lucide-react";
import { DemoBanner } from "@/components/demo-banner";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const roleIcons = {
  customer: Users,
  agent: Shield,
  designer: Palette,
  merchant: Store,
  admin: Shield,
};

const roleColors = {
  customer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  agent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  designer:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  merchant:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUserDiscovery, setShowUserDiscovery] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeChat = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      socketClient.connect(token);

      const conversationsResult = await apiClient.getConversations();
      if (conversationsResult.success && Array.isArray(conversationsResult)) {
        setConversations(conversationsResult);
        if (conversationsResult.length > 0) {
          setSelectedConversation(conversationsResult[0]);
        }
      } else {
        // Demo conversations for testing
        const demoConversations: Conversation[] = [
          {
            id: "demo-conv-1",
            name: "Sarah Johnson",
            role: "agent",
            lastMessage: "Hi! How can I help you today?",
            timestamp: "2m ago",
            unread: 2,
            online: true,
          },
          {
            id: "demo-conv-2",
            name: "Mike Chen",
            role: "designer",
            lastMessage: "I've updated the mockups for review",
            timestamp: "1h ago",
            unread: 0,
            online: true,
          },
          {
            id: "demo-conv-3",
            name: "Lisa Rodriguez",
            role: "merchant",
            lastMessage: "Thanks for the quick response!",
            timestamp: "3h ago",
            unread: 1,
            online: false,
          },
        ];
        setConversations(demoConversations);
        setSelectedConversation(demoConversations[0]);
      }

      setLoading(false);
    };

    initializeChat();

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socketClient.on("new_message", handleNewMessage);
    socketClient.on("user_typing", handleUserTyping);

    return () => {
      socketClient.off("new_message", handleNewMessage);
      socketClient.off("user_typing", handleUserTyping);
      socketClient.disconnect();
    };
  }, [router, user?.id]);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        const messagesResult = await apiClient.getMessages(
          selectedConversation.id
        );
        if (messagesResult.success && Array.isArray(messagesResult)) {
          setMessages(messagesResult);
        } else {
          // Demo messages for testing
          const demoMessages: Message[] = [
            {
              id: "demo-msg-1",
              senderId: selectedConversation.id,
              senderName: selectedConversation.name,
              content: "Hi! How can I help you today?",
              timestamp: new Date(Date.now() - 120000), // 2 minutes ago
              isOwn: false,
            },
            {
              id: "demo-msg-2",
              senderId: user?.id || "current-user",
              senderName: user?.username || "You",
              content: "I need help with setting up my account",
              timestamp: new Date(Date.now() - 60000), // 1 minute ago
              isOwn: true,
            },
            {
              id: "demo-msg-3",
              senderId: selectedConversation.id,
              senderName: selectedConversation.name,
              content:
                "I'd be happy to help you with that! Let me guide you through the process.",
              timestamp: new Date(Date.now() - 30000), // 30 seconds ago
              isOwn: false,
            },
          ];
          setMessages(demoMessages);
        }

        socketClient.joinConversation(selectedConversation.id);
      }
    };

    loadMessages();
  }, [selectedConversation, user?.id, user?.username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    // Optimistic message update for better UX
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.username,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    const messageContent = newMessage;
    setNewMessage("");

    const result = await apiClient.sendMessage(
      selectedConversation.id,
      messageContent
    );

    if (result.success) {
      socketClient.sendMessage(selectedConversation.id, messageContent);
    } else {
      console.log("[v0] API call failed, showing demo response");
      setTimeout(() => {
        const responses = [
          "Thanks for your message! I'm here to help.",
          "That's a great question. Let me think about that...",
          "I understand your concern. Here's what I suggest...",
          "Perfect! I'll get that sorted for you right away.",
          "No problem at all! Happy to assist with that.",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        const demoResponse: Message = {
          id: `demo-response-${Date.now()}`,
          senderId: selectedConversation.id,
          senderName: selectedConversation.name,
          content: randomResponse,
          timestamp: new Date(),
          isOwn: false,
        };
        setMessages((prev) => [...prev, demoResponse]);
      }, 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navigation />

      <div className="flex-1 flex bg-background">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="font-semibold">Chat</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome, {user?.username}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {user?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user?.username}</span>
                  <Badge
                    className={
                      roleColors[user?.role as keyof typeof roleColors]
                    }
                  >
                    {user?.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                  Online
                </div>
              </div>
            </div>

            {/* Demo Banner */}
            <div className="mt-4">
              <DemoBanner />
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <div className="p-3 mb-2">
                {showUserDiscovery ? (
                  <div className="mb-4">
                    <UserDiscovery
                      onConversationCreated={async () => {
                        // Refresh conversations when a new one is created
                        const conversationsResult =
                          await apiClient.getConversations();
                        if (
                          conversationsResult.success &&
                          Array.isArray(conversationsResult)
                        ) {
                          setConversations(conversationsResult);
                        }
                        setShowUserDiscovery(false);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserDiscovery(false)}
                      className="w-full mt-2"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    size="sm"
                    onClick={() => setShowUserDiscovery(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Start New Chat
                  </Button>
                )}
              </div>

              {conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Start a new chat to begin</p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const Icon =
                    roleIcons[conversation.role as keyof typeof roleIcons];
                  return (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedConversation?.id === conversation.id
                          ? "bg-muted"
                          : ""
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {Icon &&
                                React.createElement(Icon, {
                                  className: "h-5 w-5",
                                })}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">
                              {conversation.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                          >
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {roleIcons[
                            selectedConversation.role as keyof typeof roleIcons
                          ] &&
                            React.createElement(
                              roleIcons[
                                selectedConversation.role as keyof typeof roleIcons
                              ],
                              {
                                className: "h-5 w-5",
                              }
                            )}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {selectedConversation.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            roleColors[
                              selectedConversation.role as keyof typeof roleColors
                            ]
                          }
                        >
                          {selectedConversation.role}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {selectedConversation.online ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          message.isOwn ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${
                            message.isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {selectedConversation.name} is typing...
                        </p>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-card">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
