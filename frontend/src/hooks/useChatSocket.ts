import { useEffect, useRef, useState, useCallback } from "react";
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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const retryDelay = 2000; // 2 seconds

  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (socketRef.current) {
      const socket = socketRef.current;
      
      // Remove all listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("newMessage");
      socket.off("notification");
      socket.off("userStatus");
      
      // Leave conversation if we were in one
      if (userId && conversationId) {
        socket.emit("leave", { userId, conversationId });
      }
      
      socket.disconnect();
      socketRef.current = null;
    }
  }, [userId, conversationId]);

  const attemptReconnection = useCallback(() => {
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current++;
      console.log(`useChatSocket: Attempting reconnection ${retryCountRef.current}/${maxRetries} in ${retryDelay}ms...`);
      
      retryTimeoutRef.current = setTimeout(() => {
        cleanup();
        connectSocket();
      }, retryDelay);
    } else {
      console.error('useChatSocket: Max reconnection attempts reached');
      setConnectionError('Unable to connect to chat server. Please check your connection and try again.');
    }
  }, [maxRetries, retryDelay, cleanup]);

  const connectSocket = useCallback(() => {
    if (!userId) {
      console.log('useChatSocket: No userId provided, skipping socket connection');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('useChatSocket: Socket already connected');
      return;
    }

    try {
      console.log('useChatSocket: Attempting to connect to socket server...');
      
             const socket: Socket = io("http://localhost:5000", {
         transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
         timeout: 10000, // 10 second timeout
         reconnection: false, // We'll handle reconnection manually
       });

      socketRef.current = socket;

      let retryCount = 0;
             const handleConnect = () => {
         setIsConnected(true);
         setConnectionError(null);
         retryCount = 0;
         retryCountRef.current = 0;
         
         // Join conversation if we have both userId and conversationId
         if (userId && conversationId) {
           socket.emit("join", { userId, conversationId });
         }
       };

      const handleDisconnect = (reason: string) => {
        console.log('useChatSocket: Socket disconnected:', reason);
        setIsConnected(false);
        
        // Only attempt reconnection if it wasn't a manual disconnect
        if (reason !== 'io client disconnect') {
          attemptReconnection();
        }
      };

      const handleConnectError = (error: any) => {
        console.error('useChatSocket: Connection error:', error);
        setIsConnected(false);
        setConnectionError(error.message || 'Connection failed');
        retryCount++;
        if (retryCount > 5) {
          socket.disconnect();
          console.warn("Too many socket retries. Stopped trying.");
          setConnectionError('Failed to connect after multiple attempts. Please try again later.');
        } else {
          attemptReconnection();
        }
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);
      socket.on("newMessage", onNewMessage);
      if (onNotification) socket.on("notification", onNotification);
      if (onUserStatus) socket.on("userStatus", onUserStatus);

    } catch (error) {
      console.error('useChatSocket: Error creating socket connection:', error);
      setConnectionError('Failed to initialize socket connection');
    }
  }, [userId, conversationId, onNewMessage, onNotification, onUserStatus, attemptReconnection]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    
    connectSocket();

    return () => {
      if (socketRef.current) {
        const socket = socketRef.current;
        socket.emit("leave", { userId, conversationId });
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("newMessage");
        if (onNotification) socket.off("notification", onNotification);
        if (onUserStatus) socket.off("userStatus", onUserStatus);
        socket.disconnect();
      }
      cleanup();
    };
  }, [userId, connectSocket, cleanup]);

    // Handle conversation changes
  useEffect(() => {
    if (socketRef.current?.connected && userId && conversationId) {
      socketRef.current.emit("join", { userId, conversationId });
    }
  }, [userId, conversationId]);

  // Send message with server acknowledgment
  const sendMessage = useCallback((data: any): Promise<{ status: string; message?: string }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) {
        resolve({ status: "error", message: "Socket not initialized" });
        return;
      }

      if (!socketRef.current.connected) {
        resolve({ status: "error", message: "Socket not connected" });
        return;
      }

      try {
        // Reduced timeout for faster response
        const timeoutId = setTimeout(() => {
          resolve({ status: "error", message: "Message send timeout after 3 seconds" });
        }, 3000);

        socketRef.current.emit("sendMessage", data, (ack: any) => {
          clearTimeout(timeoutId);
          if (ack) {
            resolve(ack);
          } else {
            resolve({ status: "error", message: "No acknowledgment received" });
          }
        });
      } catch (error) {
        console.error('useChatSocket: Error sending message:', error);
        resolve({ status: "error", message: "Failed to send message" });
      }
    });
  }, []);

  // Manual reconnection function
  const reconnect = useCallback(() => {
    console.log('useChatSocket: Manual reconnection triggered');
    retryCountRef.current = 0;
    setConnectionError(null);
    cleanup();
    connectSocket();
  }, [cleanup, connectSocket]);

  return { 
    sendMessage, 
    isConnected, 
    connectionError, 
    reconnect,
    retryCount: retryCountRef.current 
  };
}