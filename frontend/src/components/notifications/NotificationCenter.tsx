import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Search,
  Star,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react";

interface Notification {
  id: string;
  type: "search_alert" | "order_update" | "message" | "review" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    gigId?: string;
    orderId?: string;
    userId?: string;
    searchId?: string;
    avatar?: string;
  };
}

import useChatSocket from "@/hooks/useChatSocket";

// Real notification state
export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : undefined;

  // Listen for real-time notifications
  useChatSocket({
    userId: userId || undefined,
    conversationId: undefined,
    onNewMessage: () => {}, // Empty function since we're only listening for notifications
    onNotification: (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    },
  });

  // Optionally fetch historical notifications here if backend endpoint exists
  useEffect(() => {
    // Example: fetchApi(`/api/notifications/${userId}`).then(...)
  }, [userId]);


  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "search_alert":
        return <Search className="w-4 h-4 text-blue-600" />;
      case "order_update":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "message":
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case "review":
        return <Star className="w-4 h-4 text-yellow-600" />;
      case "system":
        return <Bell className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    }
    if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    }
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[1.2rem] h-5 flex items-center justify-center rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                    notification.isRead
                      ? "bg-background border-border/40"
                      : "bg-primary/5 border-primary/20"
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.actionUrl) {
                      // In real app, navigate to the URL
                      console.log("Navigate to:", notification.actionUrl);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.metadata?.avatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.metadata.avatar} />
                          <AvatarFallback className="text-xs">
                            {notification.title
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium line-clamp-1">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {notification.type === "search_alert" && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Smart Alert
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Notifications
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
