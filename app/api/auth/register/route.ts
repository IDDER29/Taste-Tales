import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse, getClientIp } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

// POST /api/auth/register — create a new email/password account.
export async function POST(req: NextRequest) {
  try {
    await enforceRateLimit({
      name: "auth:register",
      identifier: getClientIp(req),
      limit: 5,
      window: "10 m",
    });

    const { email, password, name } = registerSchema.parse(
      await req.json().catch(() => null)
    );

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError("CONFLICT", "That email is already in use.");
    }

    const user = await prisma.user.create({
      data: { email, name, passwordHash: await hashPassword(password) },
      select: { id: true, email: true, name: true, role: true },
    });

    // TODO: enqueue verification email once the email provider is configured.
    return jsonOk(user, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
