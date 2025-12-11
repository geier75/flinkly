/**
 * Password-Reset-Router (tRPC Procedures)
 */

import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { getUserByEmail, getUserById } from "../adapters";
import { createPasswordResetToken, validatePasswordResetToken, markTokenAsUsed } from "../_core/passwordReset";
import { sendEmail } from "../_core/email";
import { passwordResetTemplate } from "../_core/emailTemplates";
import { TRPCError } from "@trpc/server";

export const passwordResetRouter = router({
  /**
   * Request password reset (send email with token)
   */
  requestReset: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);

      // Security: Always return success even if user not found
      // This prevents email enumeration attacks
      if (!user) {
        return { success: true, message: "If the email exists, a reset link has been sent." };
      }

      // Generate token (30 minutes expiration)
      const token = await createPasswordResetToken(user.id, 30);

      // Send email
      const emailHtml = passwordResetTemplate({
        userName: user.name || 'Nutzer',
        resetToken: token,
        expiresInMinutes: 30,
      });

      await sendEmail({
        to: input.email,
        subject: 'Passwort zurücksetzen - Flinkly',
        html: emailHtml,
      });

      return { success: true, message: "If the email exists, a reset link has been sent." };
    }),

  /**
   * Validate password reset token
   */
  validateToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const userId = await validatePasswordResetToken(input.token);

      if (!userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired token',
        });
      }

      return { valid: true, userId };
    }),

  /**
   * Reset password with token
   * 
   * NOTE: This is a placeholder! Flinkly uses Manus OAuth, so password reset
   * should redirect to the OAuth provider's password reset flow.
   * 
   * If you implement custom password auth, add password hashing here.
   */
  resetPassword: publicProcedure
    .input(z.object({
      token: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      const userId = await validatePasswordResetToken(input.token);

      if (!userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired token',
        });
      }

      // Mark token as used
      await markTokenAsUsed(input.token);

      // TODO: Implement password hashing and update user record
      // For now, this is a placeholder since Flinkly uses Manus OAuth
      
      throw new TRPCError({
        code: 'NOT_IMPLEMENTED',
        message: 'Password reset not implemented - Flinkly uses Manus OAuth. Please reset your password in your Manus account settings.',
      });
    }),
});
