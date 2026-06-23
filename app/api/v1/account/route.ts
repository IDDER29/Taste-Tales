import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { accountUpdateSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

// PATCH /api/v1/account — update name / email / password for the current user.
export async function PATCH(req: NextRequest) {
  try {
    const sessionUser = await requireUser();
    const input = accountUpdateSchema.parse(await req.json().catch(() => null));

    const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user) throw new ApiError("NOT_FOUND", "Account not found.");

    const data: {
      name?: string;
      email?: string;
      emailVerified?: Date | null;
      passwordHash?: string;
    } = {};

    if (input.name !== undefined) data.name = input.name;

    // Changing password requires the current one.
    if (input.newPassword) {
      if (!user.passwordHash) {
        throw new ApiError("FORBIDDEN", "This account has no password set.");
      }
      const ok = await verifyPassword(input.currentPassword!, user.passwordHash);
      if (!ok) throw new ApiError("FORBIDDEN", "Your current password is incorrect.");
      data.passwordHash = await hashPassword(input.newPassword);
    }

    // Changing email re-triggers verification and checks uniqueness.
    let emailChanged = false;
    if (input.email && input.email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new ApiError("CONFLICT", "That email is already in use.");
      data.email = input.email;
      data.emailVerified = null;
      emailChanged = true;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, email: true, name: true, role: true, emailVerified: true },
    });

    if (emailChanged) {
      try {
        const token = await createToken(updated.email, "verify");
        await sendVerificationEmail(updated.email, token);
      } catch {
        /* best-effort */
      }
    }

    return jsonOk(updated);
  } catch (err) {
    return toErrorResponse(err);
  }
}

// DELETE /api/v1/account — permanently delete the account (recipes, reviews,
// saves, reports cascade).
export async function DELETE() {
  try {
    const sessionUser = await requireUser();
    await prisma.user.delete({ where: { id: sessionUser.id } });
    return jsonOk({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
