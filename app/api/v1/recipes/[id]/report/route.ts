import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { reportInputSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// POST /api/v1/recipes/[id]/report — flag a recipe for moderation.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    await enforceRateLimit({
      name: "recipes:report",
      identifier: user.id,
      limit: 20,
      window: "1 h",
    });

    const { reason } = reportInputSchema.parse(await req.json().catch(() => null));

    const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!recipe) throw new ApiError("NOT_FOUND", "Recipe not found.");

    const report = await prisma.report.create({
      data: { recipeId: params.id, reporterId: user.id, reason },
      select: { id: true, status: true, createdAt: true },
    });

    return jsonOk(report, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
