import { NextRequest } from "next/server";
import { requireUser } from "@/lib/policies";
import { aiGenerateSchema } from "@/lib/validation";
import { jsonOk, toErrorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { generateRecipeFromIngredients } from "@/lib/ai";

export const runtime = "nodejs";

// POST /api/v1/ai/recipes/generate — server-side AI proxy (key stays server-only).
// Rate limited per user/day to cap cost.
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    await enforceRateLimit({
      name: "ai:generate",
      identifier: user.id,
      limit: 10,
      window: "1 d",
    });
    const { ingredients } = aiGenerateSchema.parse(
      await req.json().catch(() => null)
    );
    const recipe = await generateRecipeFromIngredients(ingredients);
    return jsonOk(recipe);
  } catch (err) {
    return toErrorResponse(err);
  }
}
