import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser, assertOwnerOrAdmin } from "@/lib/policies";
import { recipeInputSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";
import { sanitizeHtml } from "@/src/utils/sanitize";

export const runtime = "nodejs";

type Params = { params: { id: string } };

const authorSelect = {
  author: { select: { id: true, name: true, avatarUrl: true } },
};

// GET /api/v1/recipes/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: authorSelect,
    });
    if (!recipe) throw new ApiError("NOT_FOUND", "Recipe not found.");
    return jsonOk(recipe);
  } catch (err) {
    return toErrorResponse(err);
  }
}

async function update(req: NextRequest, id: string) {
  const user = await requireUser();
  const existing = await prisma.recipe.findUnique({ where: { id } });
  if (!existing) throw new ApiError("NOT_FOUND", "Recipe not found.");
  assertOwnerOrAdmin(user, existing.authorId);

  const input = recipeInputSchema.parse(await req.json().catch(() => null));

  return prisma.recipe.update({
    where: { id },
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
      publishedAt:
        input.status === "PUBLISHED"
          ? existing.publishedAt ?? new Date()
          : null,
    },
    include: authorSelect,
  });
}

// PUT/PATCH /api/v1/recipes/[id] — update (owner/admin)
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    return jsonOk(await update(req, params.id));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    return jsonOk(await update(req, params.id));
  } catch (err) {
    return toErrorResponse(err);
  }
}

// DELETE /api/v1/recipes/[id] — delete (owner/admin); reviews & saves cascade.
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const user = await requireUser();
    const existing = await prisma.recipe.findUnique({ where: { id: params.id } });
    if (!existing) throw new ApiError("NOT_FOUND", "Recipe not found.");
    assertOwnerOrAdmin(user, existing.authorId);
    await prisma.recipe.delete({ where: { id: params.id } });
    return jsonOk({ id: params.id });
  } catch (err) {
    return toErrorResponse(err);
  }
}
