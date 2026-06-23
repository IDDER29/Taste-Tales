import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { jsonOk, toErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/v1/account/export — the current user's data (GDPR-style export).
export async function GET() {
  try {
    const sessionUser = await requireUser();

    const [user, recipes, reviews, saved] = await Promise.all([
      prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      }),
      prisma.recipe.findMany({ where: { authorId: sessionUser.id } }),
      prisma.review.findMany({ where: { authorId: sessionUser.id } }),
      prisma.savedRecipe.findMany({
        where: { userId: sessionUser.id },
        select: { recipeId: true, createdAt: true },
      }),
    ]);

    return jsonOk(
      { user, recipes, reviews, saved, exportedAt: new Date().toISOString() },
      {
        headers: {
          "Content-Disposition": 'attachment; filename="taste-tales-export.json"',
        },
      }
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}
