import { NextRequest } from "next/server";
import { requireUser } from "@/lib/policies";
import { uploadSignSchema } from "@/lib/validation";
import { jsonOk, toErrorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { signUpload } from "@/lib/cloudinary";

export const runtime = "nodejs";

// POST /api/v1/uploads/sign — returns a signed Cloudinary upload payload so the
// browser can upload directly without ever seeing the API secret.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    await enforceRateLimit({
      name: "uploads:sign",
      identifier: user.id,
      limit: 60,
      window: "1 h",
    });
    const { folder } = uploadSignSchema.parse(await req.json().catch(() => ({})));
    return jsonOk(signUpload(folder));
  } catch (err) {
    return toErrorResponse(err);
  }
}
