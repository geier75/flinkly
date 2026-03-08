// @ts-nocheck
/**
 * Messages-Router (tRPC Procedures für Messaging-System)
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../adapters";
import { sanitizeMessage } from "@shared/sanitize";
import { storagePut } from "../storage";
import { scanFileForVirus } from "../_core/virusScan";
import { sendEmail } from "../_core/email";
import { messageNotificationTemplate } from "../_core/emailTemplates";
import { TRPCError } from "@trpc/server";

export const messagesRouter = router({
  /**
   * Get all conversations for current user
   */
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const convs = await db.getConversationsByUserId(userId);
    
    // Enrich with user data and last message
    const enriched = await Promise.all(
      convs.map(async (conv) => {
        const partnerId = conv.buyerId === userId ? conv.sellerId : conv.buyerId;
        const partner = await db.getUserById(partnerId);
        
        const msgs = await db.getMessagesByConversationId(conv.id, 1, 0);
        const lastMessage = msgs[0] || null;
        
        const allMsgs = await db.getMessagesByConversationId(conv.id, 1000, 0);
        const unreadCount = allMsgs.filter(
          (m) => m.senderId !== userId && !m.readAt
        ).length;
        
        return {
          ...conv,
          partner,
          lastMessage,
          unreadCount,
        };
      })
    );
    
    return enriched;
  }),

  /**
   * Get messages for a specific conversation
   */
  getMessages: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Use adapter function instead of direct DB access
      const conversation = await db.getConversationById(input.conversationId);
      
      if (!conversation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a participant" });
      }
      
      const msgs = await db.getMessagesByConversationId(
        input.conversationId,
        input.limit,
        input.offset
      );
      
      return msgs;
    }),

  /**
   * Send a message
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string().min(1).max(2000),
        type: z.enum(["text", "file", "system"]).default("text"),
        fileUrl: z.string().url().optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        fileMimeType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Use adapter function instead of direct DB access
      const conversation = await db.getConversationById(input.conversationId);
      
      if (!conversation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a participant" });
      }
      
      // Rate limiting
      const recentMsgs = await db.getMessagesByConversationId(input.conversationId, 10, 0);
      const userRecentMsgs = recentMsgs.filter(m => m.senderId === userId);
      if (userRecentMsgs.length >= 10) {
        const oldestMsg = userRecentMsgs[userRecentMsgs.length - 1];
        const timeSince = Date.now() - new Date(oldestMsg.createdAt).getTime();
        if (timeSince < 60 * 1000) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Sending too fast" });
        }
      }
      
      await db.createMessage({
        conversationId: input.conversationId,
        senderId: userId,
        content: sanitizeMessage(input.content),
        type: input.type,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileMimeType: input.fileMimeType,
      });
      
      // Send email notification to recipient
      const recipientId = conversation.buyerId === userId ? conversation.sellerId : conversation.buyerId;
      const recipient = await db.getUserById(recipientId);
      const sender = await db.getUserById(userId);
      
      if (recipient?.email && input.type === 'text') {
        const messagePreview = input.content.length > 100 
          ? input.content.substring(0, 100) + '...' 
          : input.content;
        
        const emailHtml = messageNotificationTemplate({
          recipientName: recipient.name || 'Nutzer',
          senderName: sender?.name || 'Ein Nutzer',
          messagePreview,
          conversationId: input.conversationId,
        });
        
        await sendEmail({
          to: recipient.email,
          subject: `Neue Nachricht von ${sender?.name || 'einem Nutzer'}`,
          html: emailHtml,
        });
      }
      
      return { success: true };
    }),

  /**
   * Mark message as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const msg = await db.getMessageById(input.messageId);
      if (!msg) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Message not found" });
      }
      
      // Use adapter function instead of direct DB access
      const conversation = await db.getConversationById(msg.conversationId);
      
      if (!conversation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a participant" });
      }
      
      if (msg.senderId !== userId) {
        await db.markMessageAsRead(input.messageId);
      }
      
      return { success: true };
    }),

  /**
   * Upload file for message
   */
  uploadFile: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        fileData: z.string(),
        fileName: z.string(),
        fileMimeType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Use adapter function instead of direct DB access
      const conversation = await db.getConversationById(input.conversationId);
      
      if (!conversation) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found" });
      }
      
      if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a participant" });
      }
      
      if (input.fileSize > 10 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "File size exceeds 10MB" });
      }
      
      const allowedTypes = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
      ];
      
      if (!allowedTypes.includes(input.fileMimeType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "File type not allowed" });
      }
      
      const fileBuffer = Buffer.from(input.fileData, "base64");
      
      // Virus-Scan BEFORE uploading to S3
      const scanResult = await scanFileForVirus(fileBuffer, input.fileName);
      
      if (!scanResult.isClean) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: `Virus detected: ${scanResult.viruses.join(", ")}` 
        });
      }
      
      const randomId = Math.random().toString(36).substring(7);
      const fileKey = `messages/${input.conversationId}/${randomId}-${input.fileName}`;
      
      const { url } = await storagePut(fileKey, fileBuffer, input.fileMimeType);
      
      return {
        fileUrl: url,
        fileName: input.fileName,
        fileSize: input.fileSize,
        fileMimeType: input.fileMimeType,
      };
    }),

  /**
   * Get unread message count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const count = await db.getUnreadMessageCount(userId);
    return { count };
  }),
});
