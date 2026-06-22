import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse, getClientIp } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/password";
import { consumeToken } from "@/lib/tokens";

export const runtime = "nodejs";

// POST /api/auth/reset-password { token, password }
export async function POST(req: NextRequest) {
  try {
    await enforceRateLimit({
      name: "auth:reset",
      identifier: getClientIp(req),
      limit: 10,
      window: "15 m",
    });

    const { token, password } = resetPasswordSchema.parse(
      await req.json().catch(() => null)
    );

    const email = await consumeToken(token, "reset");
    if (!email) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "This reset link is invalid or has expired."
      );
    }

    await prisma.user.update({
      where: { email },
      data: { passwordHash: await hashPassword(password) },
    });

    return jsonOk({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
