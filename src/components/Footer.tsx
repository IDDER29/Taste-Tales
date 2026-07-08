"use client";

import React from "react";
import Link from "next/link";
import { FaTiktok, FaInstagram, FaYoutube, FaPinterestP } from "react-icons/fa";
import Brand from "./Brand";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "All recipes", href: "/recipes" },
      { label: "Cook from pantry", href: "/cook" },
      { label: "Recipe box", href: "/saved" },
      { label: "Share a recipe", href: "/articles" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our story", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Settings", href: "/account" },
    ],
  },
];

const SOCIALS = [
  { icon: FaInstagram, href: "#instagram", label: "Instagram" },
  { icon: FaTiktok, href: "#tiktok", label: "TikTok" },
  { icon: FaYoutube, href: "#youtube", label: "YouTube" },
  { icon: FaPinterestP, href: "#pinterest", label: "Pinterest" },
];

const Footer: React.FC = () => {
  return (
    <footer className="mt-24 bg-sand-950 text-sand-300">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + blurb */}
          <div className="max-w-xs">
            <Brand inverted />
            <p className="mt-5 text-sm leading-relaxed text-sand-400">
              A community kitchen where every flavor tells a story. Discover,
              cook, and share recipes worth remembering.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sand-300 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-sand-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-sand-500">
            &copy; {new Date().getFullYear()} Taste&nbsp;Tales. Crafted with care.
          </p>
          <div className="flex items-center gap-6 text-sm text-sand-500">
            <a href="#privacy" className="transition-colors hover:text-sand-300">
              Privacy
            </a>
            <a href="#terms" className="transition-colors hover:text-sand-300">
              Terms
            </a>
            <a href="#cookies" className="transition-colors hover:text-sand-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
