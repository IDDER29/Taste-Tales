import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import path from "path";

const prisma = new PrismaClient();

// Seeds the database from data/db.json (the old json-server dataset).
async function main() {
  const raw = readFileSync(path.join(process.cwd(), "data", "db.json"), "utf8");
  const db = JSON.parse(raw) as { blogs: Array<Record<string, any>> };

  const passwordHash = await bcrypt.hash("password123", 12);
  const author = await prisma.user.upsert({
    where: { email: "demo@taste-tales.test" },
    update: {},
    create: {
      email: "demo@taste-tales.test",
      name: "Demo Chef",
      role: "AUTHOR",
      passwordHash,
    },
  });

  let created = 0;
  for (const blog of db.blogs) {
    const hasStructured =
      Array.isArray(blog.ingredients) && blog.ingredients.length > 0;
    if (!hasStructured) continue; // skip the legacy HTML-only post

    const slug = `${String(blog.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)}-${blog.id}`;

    await prisma.recipe.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        authorId: author.id,
        title: blog.title,
        subtitle: blog.subtitle ?? "",
        category: blog.category ?? "Main Course",
        cuisine: blog.cuisine ?? "",
        diet: blog.diet ?? [],
        tags: blog.tags ?? [],
        imageUrl: blog.imageUrl,
        prepTime: blog.prepTime ?? null,
        cookTime: blog.cookTime ?? null,
        servings: blog.servings ?? null,
        nutrition: (blog.nutrition ?? undefined) as Prisma.InputJsonValue,
        ingredients: blog.ingredients as Prisma.InputJsonValue,
        instructions: (blog.instructions ?? []) as Prisma.InputJsonValue,
        content: blog.content ?? "",
        status: "PUBLISHED",
        views: blog.views ?? 0,
        likes: blog.likes ?? 0,
        publishedAt: blog.publishedDate
          ? new Date(blog.publishedDate)
          : new Date(),
      },
    });
    created += 1;
  }

  console.log(
    `Seed complete: author ${author.email} (password: password123), ${created} recipes.`
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
