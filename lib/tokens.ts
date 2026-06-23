import crypto from "crypto";
import { prisma } from "./prisma";

export type TokenType = "verify" | "reset";

// Time-to-live per token type.
const TTL_MS: Record<TokenType, number> = {
  verify: 1000 * 60 * 60 * 24, // 24h
  reset: 1000 * 60 * 60, // 1h
};

// Issue a single-use token for an identifier (email), invalidating any prior
// tokens of the same type. Stored in the VerificationToken table.
export async function createToken(
  identifier: string,
  type: TokenType
): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TTL_MS[type]);
  await prisma.verificationToken.deleteMany({ where: { identifier, type } });
  await prisma.verificationToken.create({
    data: { identifier, token, expires, type },
  });
  return token;
}

// Validate + consume a token. Returns the identifier (email) on success, or null
// if the token is missing, the wrong type, or expired. Always deletes the row.
export async function consumeToken(
  token: string,
  type: TokenType
): Promise<string | null> {
  const row = await prisma.verificationToken.findUnique({ where: { token } });
  if (!row || row.type !== type) return null;
  await prisma.verificationToken.delete({ where: { token } });
  if (row.expires.getTime() < Date.now()) return null;
  return row.identifier;
}
