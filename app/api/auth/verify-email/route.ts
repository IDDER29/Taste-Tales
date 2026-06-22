import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";
import { consumeToken } from "@/lib/tokens";

export const runtime = "nodejs";

// POST /api/auth/verify-email { token }
export async function POST(req: NextRequest) {
  try {
    const { token } = verifyEmailSchema.parse(await req.json().catch(() => null));

    const email = await consumeToken(token, "verify");
    if (!email) {
      throw new ApiError(
        "VALIDATION_ERROR",
        "This verification link is invalid or has expired."
      );
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return jsonOk({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
