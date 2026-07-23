import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_EXPIRY_MINUTES = 5;

/**
 * Generates a high-entropy cryptographically secure token.
 * Returns both the raw token (to email the user) and the hashed token (to store).
 */
export function generateSecureToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

/**
 * Hashes a token using SHA-256 for secure database storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new password reset token in the database.
 * Opportunistically deletes previous active tokens for this user to prevent stuffing.
 */
export async function createPasswordResetToken(email: string) {
  // Clear any existing active tokens for this email to prevent token stuffing
  await clearUserTokens(email);

  const { rawToken, tokenHash } = generateSecureToken();
  const expires = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      email,
      tokenHash,
      expires,
    },
  });

  return rawToken;
}

/**
 * Validates a token hash. Checks existence, expiration, and used status.
 */
export async function validatePasswordResetToken(rawToken: string) {
  const tokenHash = hashToken(rawToken);

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!tokenRecord) {
    return { success: false, error: "Invalid token" };
  }

  if (tokenRecord.expires < new Date()) {
    return { success: false, error: "Token expired" };
  }

  if (tokenRecord.used) {
    return { success: false, error: "Token already used" };
  }

  return { success: true, email: tokenRecord.email, tokenId: tokenRecord.id };
}

/**
 * Marks a token as used. We keep the record for audit but prevent reuse.
 */
export async function consumePasswordResetToken(tokenId: string) {
  await prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { used: true },
  });
}

/**
 * Opportunistically cleans up a user's previous active reset tokens.
 */
export async function clearUserTokens(email: string) {
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });
}
