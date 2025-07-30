import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Archive,
  Trash2,
  Star,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download,
  Smile,
} from "lucide-react";

import useChatSocket from "@/hooks/useChatSocket";
import { fetchApi } from "@/lib/api";

import { useLocation } from "react-router-dom";

export default function Chat() {
  // --- Attachment State ---
  const [attachment, setAttachment] = useState<File | null>(null);

  // --- Real-time Chat State ---
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const userId = localStorage.getItem("userId"); // Or use context if available
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const location = useLocation();
  // Get userId from query param if present
  const searchParams = new URLSearchParams(location.search);
  const targetUserId = searchParams.get("userId");

  // Real-time socket helpers must be declared before useChatSocket
  const handleUserStatus = ({ userId: changedUserId, status }: { userId: string, status: string }) => {
    setConversations((prev) => prev.map((conv) => {
      // Update status in participants array
      if (conv.participants) {
        const updatedParticipants = conv.participants.map((p: any) =>
          String(p._id) === String(changedUserId) ? { ...p, status } : p
        );
        return { ...conv, participants: updatedParticipants };
      }
      return conv;
    }));
    setSelectedConversation((prev) => {
      if (!prev) return prev;
      if (prev.participants) {
        const updatedParticipants = prev.participants.map((p: any) =>
          String(p._id) === String(changedUserId) ? { ...p, status } : p
        );
        return { ...prev, participants: updatedParticipants };
      }
      return prev;
    });
  };

  // Real-time socket: must be declared after all state/refs, at top-level
  const { sendMessage: emitMessage, isConnected } = useChatSocket({
    userId: userId || undefined,
    conversationId: selectedConversation?._id,
    onNewMessage: (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, msg]);
      }
      // Optionally update conversations list for lastMessage/unread
      setConversations((prev) => prev.map((conv) =>
        conv._id === msg.conversationId
          ? { ...conv, lastMessage: msg, unreadCount: (conv.unreadCount || 0) + 1 }
          : conv
      ));
    },
    onUserStatus: handleUserStatus,
    // Optionally handle notifications here
  });

  // Fetch conversations on mount
  useEffect(() => {
    if (!userId) return;
    // If a targetUserId is present, fetch or create the conversation with that user
    if (targetUserId) {
      fetch('/api/messages/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId1: userId, userId2: targetUserId }),
      })
        .then((res) => res.json())
        .then(async (res: any) => {
          if (res.conversation) {
            // Fetch the other user's info to display in sidebar/header
            let otherUser = res.conversation.participants.find((p: any) => (p._id || p) !== userId);
            if (otherUser && typeof otherUser === 'string') {
              // If still just an ID, fetch user info as fallback
              try {
                const userRes = await fetch(`/api/users/${otherUser}`);
                if (userRes.ok) {
                  otherUser = await userRes.json();
                }
              } catch {}
            }
            const enrichedConversation = { ...res.conversation, participant: otherUser };
            setSelectedConversation(enrichedConversation);
            setConversations((prev) => {
              const exists = prev.some((c) => c._id === res.conversation._id);
              return exists ? prev : [enrichedConversation, ...prev];
            });
          }
        })
        .catch(() => {});
    }
    // Always fetch all conversations
    fetchApi(`/api/messages/conversations/${userId}`)
      .then((res: any) => setConversations(res.conversations || []))
      .catch(() => setConversations([]));
  }, [userId, targetUserId]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;
    fetchApi(`/api/messages/${selectedConversation._id}`)
      .then((res: any) => setMessages(res.messages || []))
      .catch(() => setMessages([]));
  }, [selectedConversation]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Track previous messages length and last sender
  const prevMessagesRef = useRef<any[]>([]);
  useEffect(() => {
    const prevMessages = prevMessagesRef.current;
    const newMsg = messages[messages.length - 1];
    const prevMsg = prevMessages[prevMessages.length - 1];
    // Only scroll if:
    // 1. User is at bottom, or
    // 2. The new message is sent by current user
    if (
      isAtBottom ||
      (newMsg && newMsg.sender === userId && (!prevMsg || newMsg._id !== prevMsg._id))
    ) {
      scrollToBottom();
    }
    prevMessagesRef.current = messages;
  }, [messages, isAtBottom, userId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      // 20px threshold
      setIsAtBottom(container.scrollHeight - container.scrollTop - container.clientHeight < 20);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if ((!newMessage.trim() && !attachment) || !selectedConversation || sending) return;
    if (!isConnected) {
      alert("Message failed to send: Socket not connected");
      return;
    }
    setSending(true);
    let attachmentData = null;
    if (attachment) {
      // Prepare file for upload (could be base64, or use an API endpoint for upload)
      // Here, we use base64 for demo; in production, upload to server/cloud
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      const base64 = await toBase64(attachment);
      attachmentData = {
        name: attachment.name,
        size: attachment.size,
        type: attachment.type.startsWith("image") ? "image" : "file",
        data: base64,
      };
    }
    const optimisticMsg = {
      conversationId: selectedConversation._id,
      sender: userId,
      recipient: (selectedConversation.participants.find((p: any) => String(p._id) !== String(userId))?._id || selectedConversation.participants[0]._id),
      content: newMessage,
      type: attachmentData ? attachmentData.type : "text",
      attachment: attachmentData,
      timestamp: new Date().toISOString(),
      status: "sending",
      _id: Math.random().toString(36).substr(2, 9), // Temporary ID
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    try {
      const ack = await emitMessage({
        ...optimisticMsg,
        status: "sent",
      });
      if (ack.status !== "ok") {
        alert("Message failed: " + (ack.message || "Unknown error"));
      } else {
        setNewMessage("");
        setAttachment(null);
      }
    } catch (err) {
      alert("Client-side error");
    } finally {
      setSending(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const clearAttachment = () => setAttachment(null);

  
  const formatTimestamp = (timestamp: string) => {
  if (!timestamp) return "";
  return moment(timestamp).format('h:mm A');
};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 text-muted-foreground" />;
      case "delivered":
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-400";
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant &&
      typeof conv.participant.name === 'string' &&
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof conv.project === 'string' && conv.project.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="h-[80vh] min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-card/50 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Messages</CardTitle>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="space-y-1 overflow-y-auto h-full px-6 pb-6">
                  {filteredConversations.filter(Boolean).map((conversation) => (
                    <div
                      key={conversation.id || conversation._id} // fallback to _id if id is missing
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedConversation?.id === conversation.id || selectedConversation?._id === conversation._id
                          ? "bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={conversation?.participant?.avatar || ""}
                            />
                            <AvatarFallback>
                              {conversation?.participant?.name
  ? conversation.participant.name.split(" ").map((n) => n[0]).join("")
  : (conversation?.participants && Array.isArray(conversation.participants) && conversation.participants.find((p: any) => p._id !== userId)?.name
    ? conversation.participants.find((p: any) => p._id !== userId).name.split(" ").map((n: string) => n[0]).join("")
    : "?")
}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(conversation?.participant?.status)}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">
                              {conversation?.participant?.name ? conversation.participant.name : (conversation?.participants && Array.isArray(conversation.participants) ?
  (conversation.participants.find((p: any) => p._id !== userId)?.name || "Unknown") : "Unknown")}
                            </h4>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {conversation.project}
                          </p>
                          {conversation.lastMessage && (
                            <>
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage.content}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimestamp(conversation.lastMessage.timestamp)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 bg-card/50 backdrop-blur-sm h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={selectedConversation?.participant?.avatar || ""}
                        />
                        <AvatarFallback>
                          {(selectedConversation?.participant?.name || selectedConversation?.participants?.find((p: any) => p._id !== userId)?.name) 
                            ? (selectedConversation?.participant?.name || selectedConversation?.participants?.find((p: any) => p._id !== userId)?.name).split(" ").map((n) => n[0]).join("")
                            : "?"
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                          (selectedConversation?.participant?.status || (selectedConversation?.participants && selectedConversation.participants.find((p: any) => p._id !== userId)?.status))
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {selectedConversation?.participant?.name ? selectedConversation.participant.name : (selectedConversation?.participants && Array.isArray(selectedConversation.participants) ?
  (selectedConversation.participants.find((p: any) => p._id !== userId)?.name || "Unknown") : "Unknown")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {(selectedConversation?.participant?.status || (selectedConversation?.participants && selectedConversation.participants.find((p: any) => p._id !== userId)?.status)) === "online"
  ? "Online"
  : selectedConversation?.participant?.lastSeen
  ? `Last seen ${formatTimestamp(selectedConversation.participant.lastSeen)}`
  : "Offline"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {selectedConversation?.project || ""}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Pin Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <Separator />
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 min-h-0 flex flex-col p-0">
                <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-6 space-y-4">
                  {messages.map((message, index) => {
                    const isSender = message.sender === userId;
                    const timeString = message.timestamp ? moment(message.timestamp).format('h:mm A') : '';
                    return (
                      <div
                        key={message._id || index}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-2`}
                      >
                        <div
                          className={`relative max-w-xs px-4 py-2 rounded-2xl shadow-lg text-sm break-words flex flex-col items-end ${
                            isSender
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-muted/80 text-foreground rounded-bl-none'
                          }`}
                          style={{ borderRadius: isSender ? '18px 18px 4px 18px' : '18px 18px 18px 4px' }}
                        >
                          {/* Attachment rendering */}
                          {message.attachment && message.attachment.type === 'image' && (
                            <img
                              src={message.attachment.data}
                              alt={message.attachment.name}
                              className="rounded-lg mb-1 max-w-[180px] max-h-[180px] border"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                          {message.attachment && message.attachment.type === 'file' && (
                            <a
                              href={message.attachment.data}
                              download={message.attachment.name}
                              className="block mb-1 text-blue-600 underline text-xs truncate max-w-[160px]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {message.attachment.name}
                            </a>
                          )}
                          {/* Message content */}
                          {message.content && (
                            <div className="whitespace-pre-line mb-1 text-base">
                              {message.content}
                            </div>
                          )}
                          {/* Time and status */}
                          <div className={`flex items-center gap-1 text-[11px] mt-1 ${isSender ? 'text-white' : 'text-gray-700'}`} style={{ opacity: 0.8 }}>
                            <span>{timeString}</span>
                          </div>
                          {/* Bubble tail (WhatsApp style) */}
                          <span
                            className={`absolute bottom-0 ${isSender ? 'right-0' : 'left-0'} w-3 h-3 ${isSender ? 'bg-primary' : 'bg-muted/80'}`}
                            style={{
                              borderBottomLeftRadius: isSender ? 0 : '8px',
                              borderBottomRightRadius: isSender ? '8px' : 0,
                              transform: isSender ? 'translateY(50%) rotate(45deg)' : 'translateY(50%) rotate(-45deg)',
                              zIndex: 0,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              {/* Message Input */}
              <div className="p-6 pt-0">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="chat-attachment"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById("chat-attachment")?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  {attachment && (
                    <span className="text-xs truncate max-w-[120px] bg-muted px-2 py-1 rounded">
                      {attachment.name}
                      <Button variant="ghost" size="sm" onClick={clearAttachment}>
                        &times;
                      </Button>
                    </span>
                  )}
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={sendMessage} disabled={(!newMessage.trim() && !attachment) || sending}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
