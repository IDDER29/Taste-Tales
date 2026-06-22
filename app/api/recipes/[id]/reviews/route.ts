import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { reviewInputSchema } from "@/lib/validation";

type Params = { params: { id: string } };

// GET /api/recipes/[id]/reviews — list reviews for a recipe.
export async function GET(_req: NextRequest, { params }: Params) {
  const reviews = await prisma.review.findMany({
    where: { recipeId: params.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
  return NextResponse.json(reviews);
}

// POST /api/recipes/[id]/reviews — add/update the caller's review (one per user).
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = reviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const { rating, comment } = parsed.data;
  const review = await prisma.review.upsert({
    where: {
      recipeId_authorId: { recipeId: params.id, authorId: session.user.id },
    },
    create: {
      recipeId: params.id,
      authorId: session.user.id,
      rating,
      comment,
    },
    update: { rating, comment },
  });

  return NextResponse.json(review, { status: 201 });
}
