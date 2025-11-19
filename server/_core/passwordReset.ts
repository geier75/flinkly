/**
 * Password-Reset-Helper
 * 
 * Handles token generation, validation and password reset flow.
 */

import crypto from 'crypto';
import { getDb } from '../db';
import { passwordResetTokens } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Generate a secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a password reset token for a user
 * 
 * @param userId - User ID
 * @param expiresInMinutes - Token expiration time (default: 30 minutes)
 * @returns Token string
 */
export async function createPasswordResetToken(
  userId: number,
  expiresInMinutes: number = 30
): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const token = generateToken();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
    used: false,
  });

  return token;
}

/**
 * Validate a password reset token
 * 
 * @param token - Token string
 * @returns User ID if valid, null otherwise
 */
export async function validatePasswordResetToken(token: string): Promise<number | null> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null; // Token not found
  }

  const tokenData = result[0];

  // Check if token is expired
  if (new Date() > new Date(tokenData.expiresAt)) {
    return null; // Token expired
  }

  return tokenData.userId;
}

/**
 * Mark a password reset token as used
 * 
 * @param token - Token string
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(passwordResetTokens)
    .set({ used: true })
    .where(eq(passwordResetTokens.token, token));
}

/**
 * Clean up expired tokens (should be run periodically via cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const result = await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.used, true));

  // Also delete expired unused tokens
  const expiredResult = await db.execute(
    `DELETE FROM passwordResetTokens WHERE expiresAt < NOW() AND used = false`
  );

  return (result as any).affectedRows || 0;
}
