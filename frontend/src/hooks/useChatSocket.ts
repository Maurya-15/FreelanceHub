import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!userId) return;
    const socket: Socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("join", { userId, conversationId });
    socket.on("newMessage", onNewMessage);
    if (onNotification) socket.on("notification", onNotification);
    if (onUserStatus) socket.on("userStatus", onUserStatus);

    return () => {
      socket.emit("leave", { userId, conversationId });
      socket.off("newMessage", onNewMessage);
      if (onNotification) socket.off("notification", onNotification);
      if (onUserStatus) socket.off("userStatus", onUserStatus);
      socket.disconnect();
    };
  }, [userId, conversationId, onNewMessage, onNotification]);

  const sendMessage = (data: any) => {
    socketRef.current?.emit("sendMessage", data);
  };

  return { sendMessage };
}

