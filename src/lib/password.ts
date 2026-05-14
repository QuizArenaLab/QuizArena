import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a password using bcrypt with secure salt rounds.
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Verifies a password against a hashed password.
 * @param password - Plain text password to verify
 * @param hashedPassword - Stored hashed password
 * @returns true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
