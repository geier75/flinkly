/**
 * Socket.io Client Hook for Real-time Messaging
 */

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get session token from cookie
    const token = Cookies.get("session");
    
    if (!token) {
      console.warn("[Socket.io] No session token found");
      return;
    }

    // Connect to Socket.io server
    const socket = io({
      path: "/api/socket.io",
      auth: {
        token,
      },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket.io] Connection error:", error);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}

export function useConversation(conversationId: number | null) {
  const { socket, isConnected } = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit("join_conversation", conversationId);

    // Listen for typing indicators
    socket.on("user_typing", (data: { userId: number; userName: string; conversationId: number }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));
      }
    });

    socket.on("user_stopped_typing", (data: { userId: number; conversationId: number }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    });

    return () => {
      // Leave conversation room
      socket.emit("leave_conversation", conversationId);
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, [socket, conversationId]);

  const startTyping = () => {
    if (!socket || !conversationId) return;

    if (!isTyping) {
      socket.emit("typing_start", conversationId);
      setIsTyping(true);
    }

    // Reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!socket || !conversationId) return;

    socket.emit("typing_stop", conversationId);
    setIsTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const notifyMessageSent = (messageId: number) => {
    if (!socket || !conversationId) return;
    socket.emit("message_sent", { conversationId, messageId });
  };

  const notifyMessageRead = (messageId: number) => {
    if (!socket || !conversationId) return;
    socket.emit("message_read", { conversationId, messageId });
  };

  return {
    isConnected,
    typingUsers,
    startTyping,
    stopTyping,
    notifyMessageSent,
    notifyMessageRead,
  };
}
