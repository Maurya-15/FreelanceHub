import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseChatSocketProps {
  userId: string | undefined;
  conversationId: string | undefined;
  onNewMessage: (msg: any) => void;
  onNotification?: (notif: any) => void;
  onUserStatus?: (statusUpdate: { userId: string, status: string }) => void;
}

export default function useChatSocket({
  userId,
  conversationId,
  onNewMessage,
  onNotification,
  onUserStatus,
}: UseChatSocketProps) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) {
      console.log('useChatSocket: No userId provided, skipping socket connection');
      return;
    }
    
    try {
      const socket: Socket = io("http://localhost:5000");
      socketRef.current = socket;

    let retryCount = 0;
    const handleConnect = () => {
      setIsConnected(true);
      retryCount = 0;
    };
    const handleDisconnect = () => setIsConnected(false);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", () => {
      retryCount++;
      if (retryCount > 5) {
        socket.disconnect();
        console.warn("Too many socket retries. Stopped trying.");
      }
    });

    socket.emit("join", { userId, conversationId });
    socket.on("newMessage", onNewMessage);
    if (onNotification) socket.on("notification", onNotification);
    if (onUserStatus) socket.on("userStatus", onUserStatus);

    return () => {
      socket.emit("leave", { userId, conversationId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", onNewMessage);
      if (onNotification) socket.off("notification", onNotification);
      if (onUserStatus)       socket.off("userStatus", onUserStatus);
      socket.disconnect();
    };
    } catch (error) {
      console.error('useChatSocket: Error creating socket connection:', error);
    }
  }, [userId, conversationId, onNewMessage, onNotification, onUserStatus]);

  // Send message with server acknowledgment
  const sendMessage = (data: any): Promise<{ status: string; message?: string }> => {
    return new Promise((resolve) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", data, (ack: any) => {
          resolve(ack);
        });
      } else {
        resolve({ status: "error", message: "Socket not connected" });
      }
    });

  };

  return { sendMessage, isConnected };
}


