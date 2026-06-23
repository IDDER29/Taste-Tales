import { NextResponse } from "next/server";

// Served OpenAPI contract for the Taste-Tales API. Kept in sync with the route
// handlers + Zod schemas under app/api and lib/validation.
const spec = {
  openapi: "3.1.0",
  info: {
    title: "Taste-Tales API",
    version: "1.0.0",
    description:
      "Recipe platform API. Success responses use { data, meta? }; errors use { error: { code, message, details? } }. Auth is a session cookie (Auth.js).",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "auth" },
    { name: "recipes" },
    { name: "reviews" },
    { name: "saved" },
    { name: "account" },
    { name: "moderation" },
    { name: "ai" },
    { name: "uploads" },
    { name: "system" },
  ],
  paths: {
    "/api/health": {
      get: { tags: ["system"], summary: "Liveness + DB ping", responses: { "200": { description: "ok" }, "503": { description: "degraded" } } },
    },
    "/api/auth/register": {
      post: { tags: ["auth"], summary: "Create an account", requestBody: ref("Register"), responses: r201("User") },
    },
    "/api/auth/forgot-password": {
      post: { tags: ["auth"], summary: "Request a password reset email", responses: { "200": { description: "Always 200 (no enumeration)" } } },
    },
    "/api/auth/reset-password": {
      post: { tags: ["auth"], summary: "Set a new password from a reset token", responses: ok() },
    },
    "/api/auth/verify-email": {
      post: { tags: ["auth"], summary: "Verify an email from a token", responses: ok() },
    },
    "/api/v1/recipes": {
      get: {
        tags: ["recipes"],
        summary: "List published recipes",
        parameters: [
          q("page", "integer"),
          q("pageSize", "integer"),
          q("category", "string"),
          q("q", "string"),
          q("sort", "string", "-publishedAt | -ratingAvg | -views"),
        ],
        responses: { "200": { description: "Paginated recipes" } },
      },
      post: {
        tags: ["recipes"],
        summary: "Create a recipe (auth; supports Idempotency-Key)",
        security: [{ session: [] }],
        requestBody: ref("RecipeInput"),
        responses: r201("Recipe"),
      },
    },
    "/api/v1/recipes/{id}": {
      get: { tags: ["recipes"], summary: "Get a recipe", parameters: [p("id")], responses: r200("Recipe") },
      put: { tags: ["recipes"], summary: "Replace a recipe (owner/admin)", security: [{ session: [] }], parameters: [p("id")], requestBody: ref("RecipeInput"), responses: r200("Recipe") },
      patch: { tags: ["recipes"], summary: "Update a recipe (owner/admin)", security: [{ session: [] }], parameters: [p("id")], requestBody: ref("RecipeInput"), responses: r200("Recipe") },
      delete: { tags: ["recipes"], summary: "Delete a recipe (owner/admin)", security: [{ session: [] }], parameters: [p("id")], responses: ok() },
    },
    "/api/v1/recipes/{id}/reviews": {
      get: { tags: ["reviews"], summary: "List reviews", parameters: [p("id")], responses: r200("ReviewList") },
      post: { tags: ["reviews"], summary: "Add/update your review (auth; one per user)", security: [{ session: [] }], parameters: [p("id")], requestBody: ref("ReviewInput"), responses: r201("Review") },
    },
    "/api/v1/recipes/{id}/report": {
      post: { tags: ["moderation"], summary: "Report a recipe (auth)", security: [{ session: [] }], parameters: [p("id")], requestBody: ref("ReportInput"), responses: r201("Report") },
    },
    "/api/v1/saved": {
      get: { tags: ["saved"], summary: "List your saved recipes (auth)", security: [{ session: [] }], responses: r200("RecipeList") },
      post: { tags: ["saved"], summary: "Save a recipe (auth)", security: [{ session: [] }], requestBody: ref("SavedInput"), responses: ok() },
      delete: { tags: ["saved"], summary: "Unsave a recipe (auth)", security: [{ session: [] }], parameters: [q("recipeId", "string")], responses: ok() },
    },
    "/api/v1/account": {
      patch: { tags: ["account"], summary: "Update name/email/password (auth)", security: [{ session: [] }], requestBody: ref("AccountUpdate"), responses: r200("User") },
      delete: { tags: ["account"], summary: "Delete your account (auth)", security: [{ session: [] }], responses: ok() },
    },
    "/api/v1/account/export": {
      get: { tags: ["account"], summary: "Export your data (auth)", security: [{ session: [] }], responses: { "200": { description: "User data JSON" } } },
    },
    "/api/v1/admin/reports": {
      get: { tags: ["moderation"], summary: "List reports (admin)", security: [{ session: [] }], parameters: [q("status", "string", "OPEN | RESOLVED | DISMISSED")], responses: { "200": { description: "Reports" } } },
    },
    "/api/v1/admin/reports/{id}": {
      patch: { tags: ["moderation"], summary: "Resolve/dismiss a report (admin)", security: [{ session: [] }], parameters: [p("id")], responses: ok() },
    },
    "/api/v1/ai/recipes/generate": {
      post: { tags: ["ai"], summary: "Generate a recipe from ingredients (auth, rate-limited)", security: [{ session: [] }], requestBody: ref("AiGenerate"), responses: { "200": { description: "Generated recipe" }, "503": { description: "AI not configured" } } },
    },
    "/api/v1/uploads/sign": {
      post: { tags: ["uploads"], summary: "Signed Cloudinary upload params (auth)", security: [{ session: [] }], responses: { "200": { description: "Signed payload" } } },
    },
  },
  components: {
    securitySchemes: {
      session: { type: "apiKey", in: "cookie", name: "authjs.session-token" },
    },
    schemas: {
      Register: obj({ email: "string", password: "string", name: "string" }, ["email", "password"]),
      RecipeInput: obj(
        {
          title: "string", subtitle: "string", category: "string", cuisine: "string",
          imageUrl: "string", content: "string",
        },
        ["title", "category", "imageUrl"]
      ),
      ReviewInput: obj({ rating: "integer", comment: "string" }, ["rating"]),
      ReportInput: obj({ reason: "string" }, ["reason"]),
      SavedInput: obj({ recipeId: "string" }, ["recipeId"]),
      AccountUpdate: obj({ name: "string", email: "string", currentPassword: "string", newPassword: "string" }, []),
      AiGenerate: { type: "object", required: ["ingredients"], properties: { ingredients: { type: "array", items: { type: "string" } } } },
      Error: { type: "object", properties: { error: { type: "object", properties: { code: { type: "string" }, message: { type: "string" } } } } },
    },
  },
};

// ---- tiny builders to keep the spec readable ----
function p(name: string) {
  return { name, in: "path", required: true, schema: { type: "string" } };
}
function q(name: string, type: string, description?: string) {
  return { name, in: "query", required: false, schema: { type }, description };
}
function obj(props: Record<string, string>, required: string[]) {
  const properties: Record<string, { type: string }> = {};
  for (const [k, t] of Object.entries(props)) properties[k] = { type: t };
  return { type: "object", required, properties };
}
function ref(schema: string) {
  return {
    required: true,
    content: { "application/json": { schema: { $ref: `#/components/schemas/${schema}` } } },
  };
}
function ok() {
  return { "200": { description: "OK" }, "400": { description: "Invalid input" } };
}
function r200(_schema: string) {
  return { "200": { description: "OK" }, "404": { description: "Not found" } };
}
function r201(_schema: string) {
  return { "201": { description: "Created" }, "400": { description: "Invalid input" } };
}

export function GET() {
  return NextResponse.json(spec);
}
