"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button, useToast, LoadingState, EmptyState } from "../components/ui";

interface ReportRow {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; name: string | null; email: string };
  recipe: { id: string; title: string; slug: string; authorId: string } | null;
}

export default function AdminReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    if (status === "loading") return;
    if (!isAdmin) router.push("/");
  }, [isAdmin, status, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/reports");
      const data = res.ok ? await res.json() : null;
      setReports(data?.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const act = async (id: string, newStatus: string, deleteRecipe?: boolean) => {
    const res = await fetch(`/api/v1/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: newStatus, deleteRecipe }),
    });
    if (res.ok) {
      toast({ title: "Report updated", variant: "success" });
      load();
    } else {
      toast({ title: "Action failed", variant: "error" });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Moderation queue</h1>
      {loading ? (
        <LoadingState />
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          title="No open reports"
          description="Nothing to moderate right now."
        />
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {r.recipe ? (
                      <Link
                        href={`/articles/${r.recipe.id}`}
                        className="text-red-500 hover:underline"
                      >
                        {r.recipe.title}
                      </Link>
                    ) : (
                      "(recipe deleted)"
                    )}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{r.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {r.reporter.name || r.reporter.email} ·{" "}
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" onClick={() => act(r.id, "RESOLVED")}>
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => act(r.id, "DISMISSED")}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => act(r.id, "RESOLVED", true)}
                  >
                    Delete recipe
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
