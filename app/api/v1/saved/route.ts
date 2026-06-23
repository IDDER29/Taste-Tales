import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { savedInputSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const authorSelect = {
  author: { select: { id: true, name: true, avatarUrl: true } },
};

// GET /api/v1/saved — the current user's saved recipes (newest first).
export async function GET() {
  try {
    const user = await requireUser();
    const saved = await prisma.savedRecipe.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { recipe: { include: authorSelect } },
    });
    return jsonOk(saved.map((s) => s.recipe));
  } catch (err) {
    return toErrorResponse(err);
  }
}

// POST /api/v1/saved { recipeId } — save a recipe (idempotent).
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { recipeId } = savedInputSchema.parse(
      await req.json().catch(() => null)
    );

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new ApiError("NOT_FOUND", "Recipe not found.");

    await prisma.savedRecipe.upsert({
      where: { userId_recipeId: { userId: user.id, recipeId } },
      create: { userId: user.id, recipeId },
      update: {},
    });
    return jsonOk({ recipeId, saved: true }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

// DELETE /api/v1/saved?recipeId=... — unsave (idempotent).
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const recipeId = new URL(req.url).searchParams.get("recipeId");
    if (!recipeId) throw new ApiError("VALIDATION_ERROR", "recipeId is required.");
    await prisma.savedRecipe.deleteMany({
      where: { userId: user.id, recipeId },
    });
    return jsonOk({ recipeId, saved: false });
  } catch (err) {
    return toErrorResponse(err);
  }
}
