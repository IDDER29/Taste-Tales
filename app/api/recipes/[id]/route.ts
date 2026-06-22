import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { recipeInputSchema } from "@/lib/validation";
import { sanitizeHtml } from "@/src/utils/sanitize";

type Params = { params: { id: string } };

// GET /api/recipes/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const recipe = await prisma.recipe.findUnique({ where: { id: params.id } });
  if (!recipe) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(recipe);
}

// Shared ownership guard: returns the recipe if the caller may modify it.
async function authorizeOwner(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  const isOwner = recipe.authorId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { recipe };
}

// PUT /api/recipes/[id] — update (owner or admin only).
export async function PUT(req: NextRequest, { params }: Params) {
  const guard = await authorizeOwner(params.id);
  if (guard.error) return guard.error;

  const body = await req.json().catch(() => null);
  const parsed = recipeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const updated = await prisma.recipe.update({
    where: { id: params.id },
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
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/recipes/[id] — delete (owner or admin only).
export async function DELETE(_req: NextRequest, { params }: Params) {
  const guard = await authorizeOwner(params.id);
  if (guard.error) return guard.error;

  await prisma.recipe.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
