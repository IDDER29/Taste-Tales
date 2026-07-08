"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  FireIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectAllArticles,
  deleteAnArticle,
} from "../features/article/articleSlice";
import { AppImage } from "../components/ui/AppImage";
import { buttonVariants } from "../components/ui/Button";
import { useConfirm, useToast } from "../components/ui";
import { formatMinutes, totalMinutes } from "../utils/recipe";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { toast } = useToast();
  const articles = useAppSelector(selectAllArticles);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  const mine = useMemo(
    () =>
      session?.user?.id
        ? [...articles]
            .filter((a) => a.authorId === session.user!.id)
            .sort(
              (a, b) =>
                new Date(b.publishedDate ?? 0).getTime() -
                new Date(a.publishedDate ?? 0).getTime()
            )
        : [],
    [articles, session]
  );

  const stats = useMemo(() => {
    const likes = mine.reduce((s, r) => s + (r.likes || 0), 0);
    const views = mine.reduce((s, r) => s + (r.views || 0), 0);
    return { likes, views };
  }, [mine]);

  if (!session?.user) return null;

  const handleDelete = async (id: string, title: string) => {
    const ok = await confirm({
      title: "Delete this recipe?",
      description: `“${title}” will be permanently removed. This can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await dispatch(deleteAnArticle(id)).unwrap();
      toast({ title: "Recipe deleted", variant: "success" });
    } catch {
      toast({ title: "Could not delete recipe", variant: "error" });
    }
  };

  const STAT_ITEMS = [
    { icon: BookOpenIcon, value: mine.length, label: mine.length === 1 ? "Recipe" : "Recipes" },
    { icon: EyeIcon, value: stats.views.toLocaleString(), label: "Total views" },
    { icon: FireIcon, value: stats.likes.toLocaleString(), label: "Total likes" },
  ];

  return (
    <div className="container-page py-10 lg:py-14">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Your kitchen</span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-sand-950 sm:text-5xl">
            My recipes
          </h1>
          <p className="mt-2 text-sand-600">
            Manage everything you&apos;ve shared with the community.
          </p>
        </div>
        <Link href="/articles" className={buttonVariants({ size: "lg" })}>
          <PlusIcon className="h-5 w-5" />
          Share a recipe
        </Link>
      </header>

      {mine.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-sand-950 p-12 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-hero-mesh opacity-50" />
          <div className="relative mx-auto max-w-md">
            <h2 className="font-display text-2xl font-semibold">
              You haven&apos;t shared a recipe yet
            </h2>
            <p className="mt-2 text-white/75">
              Turn a family favorite into a beautiful, structured tale the whole
              community can cook from.
            </p>
            <Link
              href="/articles"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white shadow-glow transition-all hover:bg-brand-600 active:scale-[0.98]"
            >
              <PlusIcon className="h-5 w-5" />
              Share your first recipe
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
            {STAT_ITEMS.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-sand-200/70 bg-white px-4 py-4 shadow-soft"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-semibold text-sand-950">
                    {s.value}
                  </p>
                  <p className="text-xs text-sand-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recipe list */}
          <ul className="space-y-4">
            {mine.map((r) => {
              const time = formatMinutes(totalMinutes(r));
              return (
                <li
                  key={r.id}
                  className="flex flex-col gap-4 rounded-2xl border border-sand-200/70 bg-white p-4 shadow-soft sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/articles/${r.id}`}
                    className="relative aspect-[4/3] w-full flex-none overflow-hidden rounded-xl sm:h-24 sm:w-32"
                  >
                    <AppImage
                      src={r.imageUrl}
                      alt={r.title}
                      ratio=""
                      wrapperClassName="absolute inset-0 h-full w-full"
                      className="object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.category && (
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                          {r.category}
                        </span>
                      )}
                      {time && <span className="text-xs text-sand-500">{time}</span>}
                    </div>
                    <Link href={`/articles/${r.id}`}>
                      <h3 className="mt-1 font-display text-lg font-semibold text-sand-950 line-clamp-1 hover:text-brand-700">
                        {r.title}
                      </h3>
                    </Link>
                    <div className="mt-1 flex items-center gap-4 text-sm text-sand-500">
                      <span className="inline-flex items-center gap-1.5">
                        <EyeIcon className="h-4 w-4" />
                        {r.views}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FireIcon className="h-4 w-4 text-brand-400" />
                        {r.likes}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <Link
                      href={`/articles/${r.id}`}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-sand-300 px-4 text-sm font-semibold text-sand-800 transition-colors hover:bg-sand-50"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">View</span>
                    </Link>
                    <Link
                      href={`/edit-article/${r.id}`}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-sand-300 px-4 text-sm font-semibold text-sand-800 transition-colors hover:bg-sand-50"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sand-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${r.title}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
