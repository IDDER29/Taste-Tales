import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validation";
import { jsonOk, toErrorResponse, getClientIp } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/auth/forgot-password { email }
// Always responds 200 (no account enumeration); emails a reset link if the
// account exists.
export async function POST(req: NextRequest) {
  try {
    await enforceRateLimit({
      name: "auth:forgot",
      identifier: getClientIp(req),
      limit: 5,
      window: "15 m",
    });

    const { email } = forgotPasswordSchema.parse(
      await req.json().catch(() => null)
    );

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = await createToken(email, "reset");
      await sendPasswordResetEmail(email, token);
    }

    return jsonOk({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
