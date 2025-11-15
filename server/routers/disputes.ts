/**
 * Dispute Resolution Router
 * 
 * 3-Stage Process:
 * 1. Open - Buyer creates dispute
 * 2. Mediation - Admin reviews evidence
 * 3. Resolved - Admin makes decision (refund/revision/no action)
 */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { disputes, fraudAlerts } from "../../drizzle/schema";
import { eq, and, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const disputesRouter = router({
  /**
   * Create a new dispute (Buyer only)
   */
  create: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        gigId: z.number(),
        sellerId: z.number(),
        reason: z.enum([
          "not_delivered",
          "poor_quality",
          "wrong_service",
          "communication_issue",
          "other",
        ]),
        description: z.string().min(50, "Beschreibung muss mindestens 50 Zeichen lang sein"),
        buyerEvidence: z.array(z.string()).optional(), // Array of file URLs
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify user is the buyer of this order
      // TODO: Add order ownership check

      await db.insert(disputes).values({
        orderId: input.orderId,
        buyerId: ctx.user.id,
        sellerId: input.sellerId,
        gigId: input.gigId,
        reason: input.reason,
        description: input.description,
        buyerEvidence: input.buyerEvidence ? JSON.stringify(input.buyerEvidence) : null,
        status: "open",
        resolution: "pending",
      });

      return { success: true };
    }),

  /**
   * Add seller evidence to dispute
   */
  addSellerEvidence: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
        evidence: z.array(z.string()), // Array of file URLs
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify user is the seller of this dispute
      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispute not found" });
      }

      if (dispute.sellerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      await db
        .update(disputes)
        .set({
          sellerEvidence: JSON.stringify(input.evidence),
        })
        .where(eq(disputes.id, input.disputeId));

      return { success: true };
    }),

  /**
   * Escalate dispute to mediation (Admin only)
   */
  escalateToMediation: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Admin-only
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db
        .update(disputes)
        .set({
          status: "mediation",
          adminId: ctx.user.id,
          mediationStartedAt: new Date(),
        })
        .where(eq(disputes.id, input.disputeId));

      return { success: true };
    }),

  /**
   * Resolve dispute (Admin only)
   */
  resolve: protectedProcedure
    .input(
      z.object({
        disputeId: z.number(),
        resolution: z.enum([
          "refund_full",
          "refund_partial",
          "revision_requested",
          "buyer_favor",
          "seller_favor",
          "no_action",
        ]),
        refundAmount: z.number().optional(),
        refundReason: z.string().optional(),
        adminNotes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Admin-only
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db
        .update(disputes)
        .set({
          status: "resolved",
          resolution: input.resolution,
          refundAmount: input.refundAmount,
          refundReason: input.refundReason,
          adminNotes: input.adminNotes,
          resolvedAt: new Date(),
        })
        .where(eq(disputes.id, input.disputeId));

      // TODO: Process refund via Stripe if refund_full or refund_partial

      return { success: true };
    }),

  /**
   * Get all disputes for current user (Buyer or Seller)
   */
  myDisputes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const results = await db
      .select()
      .from(disputes)
      .where(
        or(
          eq(disputes.buyerId, ctx.user.id),
          eq(disputes.sellerId, ctx.user.id)
        )
      );

    return results;
  }),

  /**
   * Get all disputes (Admin only)
   */
  all: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    // Admin-only
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    const results = await db.select().from(disputes);
    return results;
  }),

  /**
   * Get dispute by ID
   */
  getById: protectedProcedure
    .input(z.object({ disputeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispute not found" });
      }

      // Only buyer, seller, or admin can view
      if (
        dispute.buyerId !== ctx.user.id &&
        dispute.sellerId !== ctx.user.id &&
        ctx.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized" });
      }

      return dispute;
    }),
});
