// @ts-nocheck
/**
 * Socket.io Real-time Messaging
 */

import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { sdk } from "./sdk";
import * as db from "../adapters";

export function initializeSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? ["https://flinkly.manus.space"] 
        : ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    },
    path: "/api/socket.io",
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      // Create fake request object with cookie
      const fakeReq = {
        headers: {
          cookie: `session=${token}`,
        },
      } as any;
      
      const user = await sdk.authenticateRequest(fakeReq);
      if (!user) {
        return next(new Error("Invalid token"));
      }
      
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`[Socket.io] User ${user.id} connected`);

    // Join user's personal room
    socket.join(`user:${user.id}`);

    // Join conversation rooms
    socket.on("join_conversation", async (conversationId: number) => {
      try {
        // Verify user is participant
        const dbInstance = await db.getDb();
        if (!dbInstance) {
          socket.emit("error", { message: "Database unavailable" });
          return;
        }

        const { conversations } = await import("../../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const convResult = await dbInstance.select().from(conversations)
          .where(eq(conversations.id, conversationId))
          .limit(1);
        
        const conversation = convResult[0];
        
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }
        
        if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) {
          socket.emit("error", { message: "Not a participant" });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        console.log(`[Socket.io] User ${user.id} joined conversation ${conversationId}`);
      } catch (error) {
        console.error("[Socket.io] Error joining conversation:", error);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    // Leave conversation room
    socket.on("leave_conversation", (conversationId: number) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`[Socket.io] User ${user.id} left conversation ${conversationId}`);
    });

    // Typing indicator
    socket.on("typing_start", (conversationId: number) => {
      socket.to(`conversation:${conversationId}`).emit("user_typing", {
        userId: user.id,
        userName: user.name,
        conversationId,
      });
    });

    socket.on("typing_stop", (conversationId: number) => {
      socket.to(`conversation:${conversationId}`).emit("user_stopped_typing", {
        userId: user.id,
        conversationId,
      });
    });

    // New message notification
    socket.on("message_sent", async (data: { conversationId: number; messageId: number }) => {
      try {
        // Get conversation to find recipient
        const dbInstance = await db.getDb();
        if (!dbInstance) return;

        const { conversations, messages } = await import("../../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const convResult = await dbInstance.select().from(conversations)
          .where(eq(conversations.id, data.conversationId))
          .limit(1);
        
        const conversation = convResult[0];
        if (!conversation) return;

        // Get message
        const msgResult = await dbInstance.select().from(messages)
          .where(eq(messages.id, data.messageId))
          .limit(1);
        
        const message = msgResult[0];
        if (!message) return;

        // Notify recipient
        const recipientId = conversation.buyerId === user.id 
          ? conversation.sellerId 
          : conversation.buyerId;

        io.to(`user:${recipientId}`).emit("new_message", {
          conversationId: data.conversationId,
          message,
        });

        // Broadcast to conversation room
        socket.to(`conversation:${data.conversationId}`).emit("message_received", {
          conversationId: data.conversationId,
          message,
        });
      } catch (error) {
        console.error("[Socket.io] Error broadcasting message:", error);
      }
    });

    // Message read notification
    socket.on("message_read", (data: { conversationId: number; messageId: number }) => {
      socket.to(`conversation:${data.conversationId}`).emit("message_marked_read", {
        conversationId: data.conversationId,
        messageId: data.messageId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] User ${user.id} disconnected`);
    });
  });

  console.log("[Socket.io] Real-time messaging initialized");
  return io;
}
