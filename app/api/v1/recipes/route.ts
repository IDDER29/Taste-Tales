import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/policies";
import { recipeInputSchema } from "@/lib/validation";
import { jsonOk, toErrorResponse } from "@/lib/errors";
import { enforceRateLimit } from "@/lib/rate-limit";
import { withIdempotency } from "@/lib/idempotency";
import { slugify } from "@/lib/slug";
import { sanitizeHtml } from "@/src/utils/sanitize";

export const runtime = "nodejs";

const authorSelect = {
  author: { select: { id: true, name: true, avatarUrl: true } },
};

// GET /api/v1/recipes?page=&pageSize=&category=&q=&sort=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 12));
    const category = searchParams.get("category") || undefined;
    const q = searchParams.get("q")?.trim() || undefined;
    const sort = searchParams.get("sort") || "-publishedAt";

    const orderBy: Prisma.RecipeOrderByWithRelationInput =
      sort === "-ratingAvg"
        ? { ratingAvg: "desc" }
        : sort === "-views"
        ? { views: "desc" }
        : { publishedAt: "desc" };

    const where: Prisma.RecipeWhereInput = {
      status: "PUBLISHED",
      ...(category ? { category } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: authorSelect,
      }),
      prisma.recipe.count({ where }),
    ]);

    return jsonOk(items, { meta: { total, page, pageSize } });
  } catch (err) {
    return toErrorResponse(err);
  }
}

// POST /api/v1/recipes — create (auth required)
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    await enforceRateLimit({
      name: "recipes:create",
      identifier: user.id,
      limit: 20,
      window: "1 h",
    });

    const input = recipeInputSchema.parse(await req.json().catch(() => null));

    // Safe to retry: an Idempotency-Key replays the first result (when Redis is on).
    const recipe = await withIdempotency(
      req.headers.get("Idempotency-Key"),
      `recipes:create:${user.id}`,
      () =>
        prisma.recipe.create({
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
            content: input.content ? sanitizeHtml(input.content) : "",
            status: input.status,
            slug: `${slugify(input.title)}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,
            authorId: user.id,
            publishedAt: input.status === "PUBLISHED" ? new Date() : null,
          },
          include: authorSelect,
        })
    );

    return jsonOk(recipe, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
