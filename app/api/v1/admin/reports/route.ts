import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/policies";
import { jsonOk, toErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/v1/admin/reports?status=OPEN — moderation queue (admin only).
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const statusParam = new URL(req.url).searchParams.get("status");
    const where: Prisma.ReportWhereInput =
      statusParam === "RESOLVED" || statusParam === "DISMISSED"
        ? { status: statusParam }
        : { status: "OPEN" };

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        recipe: { select: { id: true, title: true, slug: true, authorId: true } },
      },
    });

    return jsonOk(reports);
  } catch (err) {
    return toErrorResponse(err);
  }
}
