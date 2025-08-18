import React, { useState, useRef, useEffect, useCallback } from "react";
import moment from "moment";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Smile,
  FileText,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";

import useChatSocket from "@/hooks/useChatSocket";
import { fetchApi, getApiUrl } from "@/lib/api";

import { useLocation, useNavigate } from "react-router-dom";

export default function Chat() {
  // --- Attachment State ---
  const [attachment, setAttachment] = useState<File | null>(null);

  // --- Real-time Chat State ---
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sending, setSending] = useState(false);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();

  // --- Refs for Scrolling Logic ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const isInitialLoad = useRef(true);

  const searchParams = new URLSearchParams(location.search);
  const targetUserId = searchParams.get("userId");

  const handleUserStatus = ({
    userId: changedUserId,
    status,
  }: {
    userId: string;
    status: string;
  }) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.participants) {
          const updatedParticipants = conv.participants.map((p: any) =>
            String(p._id) === String(changedUserId) ? { ...p, status } : p
          );
          return { ...conv, participants: updatedParticipants };
        }
        return conv;
      })
    );
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

  // Updated socket hook with error handling
  const { 
    sendMessage: emitMessage, 
    isConnected, 
    connectionError, 
    reconnect,
    retryCount 
  } = useChatSocket({
    userId: userId || undefined,
    conversationId: selectedConversation?._id,
    onNewMessage: useCallback((msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        // Check if this message is from the current user (optimistic message)
        const isFromCurrentUser = msg.sender === userId;
        
        setMessages((prev) => {
          // If it's from current user, replace the optimistic message
          if (isFromCurrentUser) {
            return prev.map(existingMsg => 
              existingMsg.sender === userId && 
              existingMsg.content === msg.content && 
              (existingMsg.status === "sending" || existingMsg.status === "sent")
                ? { ...msg, status: "sent" }
                : existingMsg
            );
          } else {
            // If it's from another user, add it normally
            return [...prev, msg];
          }
        });
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === msg.conversationId
            ? {
                ...conv,
                lastMessage: msg,
                unreadCount: (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );
    }, [userId, selectedConversation?._id]),
    onUserStatus: handleUserStatus,
  });

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const res = await fetchApi(`/api/messages/conversations/${userId}`);
        let allConversations = res.conversations || [];

        if (targetUserId) {
          const convRes = await fetch(getApiUrl('/api/messages/conversation'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId1: userId, userId2: targetUserId }),
          });
          const data = await convRes.json();
          if (data.conversation) {
            let otherUser = data.conversation.participants.find(
              (p: any) => (p._id || p) !== userId
            );
            if (otherUser && typeof otherUser === 'string') {
              try {
                const userRes = await fetch(getApiUrl(`/api/users/${otherUser}`));
                if (userRes.ok) {
                  otherUser = await userRes.json();
                }
              } catch {}
            }
            const enrichedConversation = { ...data.conversation, participant: otherUser };
            setSelectedConversation(enrichedConversation);
            
            const exists = allConversations.some((c) => c._id === data.conversation._id);
            if (!exists) {
              allConversations = [enrichedConversation, ...allConversations];
            }
            // Clean up URL query param
            navigate(location.pathname, { replace: true });
          }
        }
        setConversations(allConversations);
      } catch (error) {
        console.error("Error loading conversations:", error);
        setConversations([]);
      }
    };
    loadData();
  }, [userId, targetUserId, location.pathname, navigate]);

  useEffect(() => {
    if (!selectedConversation?._id) return;
    isInitialLoad.current = true;
    userScrolledUp.current = false;
    fetchApi(`/api/messages/${selectedConversation._id}`)
      .then((res: any) => setMessages(res.messages || []))
      .catch(() => setMessages([]));
  }, [selectedConversation?._id]);

  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom(isInitialLoad.current ? 'auto' : 'smooth');
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 20;
      userScrolledUp.current = !isAtBottom;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const sendMessage = async () => {
    if ((!newMessage.trim() && !attachment) || !selectedConversation || sending) return;
    
    // Enhanced connection check with user feedback
    if (!isConnected) {
      // Silently handle connection error without alert
      return;
    }
    
    userScrolledUp.current = false;
    setSending(true);
    
    let attachmentData = null;
    if (attachment) {
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      try {
        const base64 = await toBase64(attachment);
        attachmentData = {
          name: attachment.name,
          size: attachment.size,
          type: attachment.type.startsWith("image") ? "image" : "file",
          data: base64,
        };
      } catch (error) {
        console.error('Error processing attachment:', error);
        alert("Failed to process attachment. Please try again.");
        setSending(false);
        return;
      }
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
      _id: Math.random().toString(36).substr(2, 9),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    
    try {
      const ack: any = await emitMessage({
        ...optimisticMsg,
        status: "sent",
      });
      
      if (ack.status !== "ok") {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter(msg => msg._id !== optimisticMsg._id));
        // Silently handle error without alert
      } else {
        // Update optimistic message with server response
        setMessages((prev) => 
          prev.map(msg => 
            msg._id === optimisticMsg._id 
              ? { ...msg, _id: ack.messageId || msg._id, status: "sent" }
              : msg
          )
        );
        setNewMessage("");
        setAttachment(null);
        
        // Fallback: If real-time doesn't work, ensure message stays
        setTimeout(() => {
          setMessages((prev) => 
            prev.map(msg => 
              msg._id === optimisticMsg._id && msg.status === "sending"
                ? { ...msg, status: "sent" }
                : msg
            )
          );
        }, 1000);
      }
    } catch (err: any) {
      console.error('Message send error:', err);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(msg => msg._id !== optimisticMsg._id));
      // Silently handle error without alert
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Add file size validation (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setAttachment(file);
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
        return <Clock className="w-3 h-3 animate-pulse" />;
      case "delivered":
        return <Check className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return <Check className="w-3 h-3" />; // Default to sent
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
      (conv.participant &&
        typeof conv.participant.name === 'string' &&
        conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (typeof conv.project === 'string' && conv.project.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
             <main className="container mx-auto px-4 py-8">

        <div className="h-[80vh] min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-card/50 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    Messages
                    {isConnected ? (
                      <Wifi className="w-4 h-4 text-green-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-500" />
                    )}
                  </CardTitle>
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
                      key={conversation.id || conversation._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedConversation?._id === conversation._id
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
                                ? conversation.participant.name.split(" ").map((n: string) => n[0]).join("")
                                : (conversation?.participants?.find((p: any) => p._id !== userId)?.name
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
                            ? (selectedConversation?.participant?.name || selectedConversation?.participants?.find((p: any) => p._id !== userId)?.name).split(" ").map((n: string) => n[0]).join("")
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
                          {message.content && (
                            <div className="whitespace-pre-line mb-1 text-base text-left">
                              {message.content}
                            </div>
                          )}
                          <div className={`flex items-center gap-1.5 text-[11px] mt-1 self-end ${isSender ? 'text-white/70' : 'text-muted-foreground'}`} style={{ opacity: 0.8 }}>
                            <span>{timeString}</span>
                            {isSender && getStatusIcon(message.status)}
                          </div>
                          <span
                            className={`absolute bottom-0 ${isSender ? 'right-[-6px]' : 'left-[-6px]'} w-3 h-3 ${isSender ? 'bg-primary' : 'bg-muted/80'}`}
                            style={{
                              clipPath: isSender
                                ? 'polygon(100% 0, 0 100%, 100% 100%)'
                                : 'polygon(0 0, 0 100%, 100% 100%)'
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
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById("chat-attachment")?.click()}
                    disabled={!isConnected}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  {attachment && (
                    <div className="flex items-center gap-2 text-xs bg-muted px-2 py-1 rounded max-w-[150px]">
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{attachment.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearAttachment}
                        className="p-0 h-auto ml-1 hover:bg-transparent"
                      >
                        &times;
                      </Button>
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <Input
                      placeholder={isConnected ? "Type a message..." : "Connecting..."}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="pr-10"
                      disabled={!isConnected}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      disabled={!isConnected}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={sendMessage} 
                    disabled={(!newMessage.trim() && !attachment) || sending || !isConnected}
                    className="relative"
                  >
                    {sending ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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