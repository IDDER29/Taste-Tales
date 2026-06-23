import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { reviewInputSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Params = { params: { id: string } };

const authorSelect = {
  author: { select: { id: true, name: true, avatarUrl: true } },
};

// GET /api/v1/recipes/[id]/reviews
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const reviews = await prisma.review.findMany({
      where: { recipeId: params.id },
      orderBy: { createdAt: "desc" },
      include: authorSelect,
    });
    return jsonOk(reviews);
  } catch (err) {
    return toErrorResponse(err);
  }
}

// POST /api/v1/recipes/[id]/reviews — add/update the caller's review (1 per user),
// maintaining the recipe's denormalized rating aggregates transactionally.
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    await enforceRateLimit({
      name: "reviews:create",
      identifier: user.id,
      limit: 30,
      window: "1 h",
    });

    const { rating, comment } = reviewInputSchema.parse(
      await req.json().catch(() => null)
    );

    const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!recipe) throw new ApiError("NOT_FOUND", "Recipe not found.");
    if (recipe.authorId === user.id) {
      throw new ApiError("FORBIDDEN", "You can't review your own recipe.");
    }

    const review = await prisma.$transaction(async (tx) => {
      const r = await tx.review.upsert({
        where: {
          recipeId_authorId: { recipeId: params.id, authorId: user.id },
        },
        create: { recipeId: params.id, authorId: user.id, rating, comment },
        update: { rating, comment },
        include: authorSelect,
      });
      const agg = await tx.review.aggregate({
        where: { recipeId: params.id },
        _avg: { rating: true },
        _count: { rating: true },
      });
      await tx.recipe.update({
        where: { id: params.id },
        data: {
          ratingAvg: agg._avg.rating ?? 0,
          ratingCount: agg._count.rating,
        },
      });
      return r;
    });

    return jsonOk(review, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
