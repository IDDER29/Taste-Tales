import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/policies";
import { reportUpdateSchema } from "@/lib/validation";
import { ApiError, jsonOk, toErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";

type Params = { params: { id: string } };

// PATCH /api/v1/admin/reports/[id] — resolve/dismiss a report, optionally
// deleting the offending recipe (admin only).
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireAdmin();
    const { status, deleteRecipe } = reportUpdateSchema.parse(
      await req.json().catch(() => null)
    );

    const report = await prisma.report.findUnique({ where: { id: params.id } });
    if (!report) throw new ApiError("NOT_FOUND", "Report not found.");

    if (deleteRecipe) {
      // Removes the recipe and cascades its reviews/saves/reports.
      await prisma.recipe.delete({ where: { id: report.recipeId } }).catch(() => {
        /* already gone */
      });
    }

    const updated = await prisma.report
      .update({ where: { id: params.id }, data: { status } })
      .catch(() => null); // may have cascaded away if the recipe was deleted

    return jsonOk(updated ?? { id: params.id, status, deleted: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}
