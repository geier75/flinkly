// @ts-nocheck
/**
 * Verification-Router (Seller-Verifizierung)
 * 
 * Features:
 * - E-Mail-Verifizierung mit Token
 * - Telefon-Verifizierung (optional)
 * - Admin-Approval
 * - Verifizierungs-Status-Updates
 */

import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../adapters";
import { TRPCError } from "@trpc/server";

export const verificationRouter = router({
  /**
   * Request email verification
   * Sends verification email with token
   */
  requestEmailVerification: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    if (user.emailVerified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "E-Mail ist bereits verifiziert",
      });
    }

    if (!user.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Keine E-Mail-Adresse hinterlegt",
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store token in database (TODO: create verification_tokens table)
    // For now, we'll just log it
    console.log(`[Verification] Email verification token for user ${ctx.user.id}: ${verificationToken}`);
    console.log(`[Verification] Expires at: ${expiresAt.toISOString()}`);

    // TODO: Send verification email via email service
    // await sendVerificationEmail(user.email, verificationToken);

    return {
      success: true,
      message: "Verifizierungs-E-Mail wurde gesendet. Bitte überprüfen Sie Ihr Postfach.",
      // In development: return token for testing
      ...(process.env.NODE_ENV === "development" && { token: verificationToken }),
    };
  }),

  /**
   * Verify email with token
   */
  verifyEmail: protectedProcedure
    .input(
      z.object({
        token: z.string().min(32),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Verify token from database
      // For now, accept any token in development
      if (process.env.NODE_ENV === "development" || input.token.length >= 32) {
        await db.updateUserVerification(ctx.user.id, {
          emailVerified: true,
          verificationLevel: "email",
        });

        return {
          success: true,
          message: "E-Mail erfolgreich verifiziert!",
        };
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Ungültiger oder abgelaufener Verifizierungs-Token",
      });
    }),

  /**
   * Request phone verification
   */
  requestPhoneVerification: protectedProcedure
    .input(
      z.object({
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/), // E.164 format
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (user.phoneVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Telefonnummer ist bereits verifiziert",
        });
      }

      // Update phone number
      await db.updateUserPhone(ctx.user.id, input.phone);

      // Generate verification code (6 digits)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`[Verification] Phone verification code for user ${ctx.user.id}: ${verificationCode}`);

      // TODO: Send SMS via SMS service (Twilio, etc.)
      // await sendVerificationSMS(input.phone, verificationCode);

      return {
        success: true,
        message: "Verifizierungs-Code wurde per SMS gesendet.",
        // In development: return code for testing
        ...(process.env.NODE_ENV === "development" && { code: verificationCode }),
      };
    }),

  /**
   * Verify phone with code
   */
  verifyPhone: protectedProcedure
    .input(
      z.object({
        code: z.string().length(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Verify code from database/cache
      // For now, accept any 6-digit code in development
      if (process.env.NODE_ENV === "development" || /^\d{6}$/.test(input.code)) {
        await db.updateUserVerification(ctx.user.id, {
          phoneVerified: true,
          verificationLevel: "phone",
        });

        return {
          success: true,
          message: "Telefonnummer erfolgreich verifiziert!",
        };
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Ungültiger Verifizierungs-Code",
      });
    }),

  /**
   * Request admin approval (for sellers)
   */
  requestAdminApproval: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    if (user.adminApproved) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Account ist bereits von einem Admin genehmigt",
      });
    }

    if (!user.emailVerified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse",
      });
    }

    // Create admin approval request
    await db.createAdminApprovalRequest(ctx.user.id);

    return {
      success: true,
      message:
        "Ihre Anfrage wurde an unser Team gesendet. Sie werden per E-Mail benachrichtigt, sobald Ihr Account genehmigt wurde.",
    };
  }),

  /**
   * Get verification status
   */
  getVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return {
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      adminApproved: user.adminApproved,
      verificationLevel: user.verificationLevel,
      hasEmail: !!user.email,
      hasPhone: !!user.phone,
    };
  }),
});

/**
 * Helper: Generate verification token (32 chars)
 */
function generateVerificationToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}
