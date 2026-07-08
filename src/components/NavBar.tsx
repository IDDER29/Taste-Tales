"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  BookmarkIcon,
  PlusIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  toggleMobileMenu,
  selectMobileMenuOpen,
} from "../features/ui/uiSlice";
import { selectNotifications } from "../features/article/articleSlice";
import { selectSavedCount } from "../features/saved/savedSlice";
import { Avatar } from "./ui/Avatar";
import Brand from "./Brand";
import { cn } from "../utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#browse", label: "Browse" },
  { href: "/cook", label: "Cook" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();
  const notifications = useAppSelector(selectNotifications);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);
  const savedCount = useAppSelector(selectSavedCount);
  const headerRef = useRef<HTMLElement>(null);

  // Subtle border + shadow appear once the page is scrolled.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      el.dataset.scrolled = String(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    // Hash links (e.g. "/#browse") are in-page scroll targets, not routes —
    // never mark them active, or they'd light up on every page.
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className="sticky top-0 z-40 border-b border-transparent transition-colors duration-300 data-[scrolled=true]:border-sand-200/80 data-[scrolled=true]:shadow-soft glass"
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-4 lg:h-[72px]"
        aria-label="Global"
      >
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Brand />
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-brand-700"
                    : "text-sand-700 hover:text-sand-950"
                )}
              >
                {isActive(link.href) && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-brand-50" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <Popover className="relative hidden sm:block">
            <PopoverButton className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-sand-600 transition-colors hover:bg-sand-100 hover:text-sand-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20">
              <BellIcon className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </PopoverButton>
            <PopoverPanel
              transition
              className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-sand-200 bg-white p-2 shadow-lift transition data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-sm font-semibold text-sand-950">
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <span className="chip py-0.5 text-xs">{notifications.length} new</span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-sand-500">
                    You&apos;re all caught up 🎉
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {notifications.map((n, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-sand-50"
                      >
                        <span
                          className={cn(
                            "mt-1.5 h-2 w-2 flex-none rounded-full",
                            n.type === "new"
                              ? "bg-emerald-500"
                              : n.type === "edit"
                              ? "bg-accent-500"
                              : "bg-brand-500"
                          )}
                        />
                        <span className="text-sm text-sand-700">{n.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </PopoverPanel>
          </Popover>

          {/* Recipe box */}
          <Link
            href="/saved"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-sand-600 transition-colors hover:bg-sand-100 hover:text-sand-900 sm:inline-flex"
            aria-label={`Recipe box${savedCount ? `, ${savedCount} saved` : ""}`}
          >
            <BookmarkIcon className="h-5 w-5" />
            {savedCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Share a recipe */}
          <Link
            href="/articles"
            className="hidden items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-700 hover:shadow-glow active:scale-[0.98] md:inline-flex"
          >
            <PlusIcon className="h-4 w-4" />
            Share a recipe
          </Link>

          {/* Account */}
          {session?.user ? (
            <Menu as="div" className="relative hidden sm:block">
              <MenuButton className="flex items-center gap-2 rounded-full p-0.5 pl-1 transition-colors hover:bg-sand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20">
                <Avatar
                  name={session.user.name || session.user.email}
                  src={session.user.image}
                  size="sm"
                />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 mt-2 w-60 origin-top-right rounded-2xl border border-sand-200 bg-white p-1.5 shadow-lift transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                <div className="border-b border-sand-100 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-sand-950">
                    {session.user.name || "Home cook"}
                  </p>
                  <p className="truncate text-xs text-sand-500">
                    {session.user.email}
                  </p>
                </div>
                <div className="py-1">
                  <MenuItem>
                    <Link
                      href="/account"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-sand-700 data-[focus]:bg-sand-50 data-[focus]:text-sand-950"
                    >
                      <Cog6ToothIcon className="h-5 w-5 text-sand-500" />
                      Account settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="/saved"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-sand-700 data-[focus]:bg-sand-50 data-[focus]:text-sand-950"
                    >
                      <BookmarkIcon className="h-5 w-5 text-sand-500" />
                      Recipe box
                      {savedCount > 0 && (
                        <span className="ml-auto chip py-0.5 text-xs">{savedCount}</span>
                      )}
                    </Link>
                  </MenuItem>
                  {session.user.role === "ADMIN" && (
                    <MenuItem>
                      <Link
                        href="/admin/reports"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-sand-700 data-[focus]:bg-sand-50 data-[focus]:text-sand-950"
                      >
                        <ShieldCheckIcon className="h-5 w-5 text-sand-500" />
                        Moderation
                      </Link>
                    </MenuItem>
                  )}
                </div>
                <div className="border-t border-sand-100 pt-1">
                  <MenuItem>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-sand-700 data-[focus]:bg-brand-50 data-[focus]:text-brand-700"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Log out
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-sand-800 transition-colors hover:border-sand-400 hover:bg-sand-50 sm:inline-flex"
            >
              <UserCircleIcon className="h-5 w-5" />
              Log in
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sand-700 transition-colors hover:bg-sand-100 lg:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={() => dispatch(toggleMobileMenu())}
      >
        <div className="fixed inset-0 z-50 bg-sand-950/40 backdrop-blur-sm" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-[rgb(var(--surface))] px-6 py-5 shadow-lift animate-slide-in-right">
          <div className="flex items-center justify-between">
            <Brand />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sand-700 hover:bg-sand-100"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => dispatch(toggleMobileMenu())}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium",
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-sand-800 hover:bg-sand-100"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/saved"
              onClick={() => dispatch(toggleMobileMenu())}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-sand-800 hover:bg-sand-100"
            >
              <span className="flex items-center gap-2.5">
                <BookmarkIcon className="h-5 w-5 text-sand-500" />
                Recipe box
              </span>
              {savedCount > 0 && <span className="chip py-0.5 text-xs">{savedCount}</span>}
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-sand-200 pt-6">
            <Link
              href="/articles"
              onClick={() => dispatch(toggleMobileMenu())}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-soft"
            >
              <PlusIcon className="h-5 w-5" />
              Share a recipe
            </Link>
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => dispatch(toggleMobileMenu())}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 px-5 py-3 text-base font-semibold text-sand-800"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  Account
                </Link>
                <button
                  onClick={() => {
                    dispatch(toggleMobileMenu());
                    signOut();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-base font-semibold text-sand-700 hover:bg-sand-100"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => dispatch(toggleMobileMenu())}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 px-5 py-3 text-base font-semibold text-sand-800"
              >
                <UserCircleIcon className="h-5 w-5" />
                Log in
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
