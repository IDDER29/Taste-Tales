import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { recipeInputSchema } from "@/lib/validation";
import { slugify } from "@/lib/slug";
import { sanitizeHtml } from "@/src/utils/sanitize";

// GET /api/recipes?page=1&pageSize=12&category=Dessert — paginated published list.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize") ?? 12))
  );
  const category = searchParams.get("category") || undefined;

  const where: Prisma.RecipeWhereInput = {
    status: "PUBLISHED",
    ...(category ? { category } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.recipe.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pageSize });
}

// POST /api/recipes — create a recipe (must be authenticated).
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = recipeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const recipe = await prisma.recipe.create({
    data: {
      title: input.title,
      subtitle: input.subtitle,
      category: input.category,
      cuisine: input.cuisine,
      diet: input.diet,
      tags: input.tags,
      imageUrl: input.imageUrl,
      prepTime: input.prepTime ?? null,
      cookTime: input.cookTime ?? null,
      servings: input.servings ?? null,
      nutrition: (input.nutrition ?? undefined) as Prisma.InputJsonValue,
      ingredients: input.ingredients as unknown as Prisma.InputJsonValue,
      instructions: input.instructions as unknown as Prisma.InputJsonValue,
      // Sanitize the rich-text story server-side (defense in depth).
      content: input.content ? sanitizeHtml(input.content) : "",
      status: input.status,
      slug: `${slugify(input.title)}-${Math.random().toString(36).slice(2, 7)}`,
      authorId: session.user.id,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}
