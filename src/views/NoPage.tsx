"use client";

import React from "react";
import Link from "next/link";
import { HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { buttonVariants } from "../components/ui/Button";

const NoPage = () => {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="relative">
        <span
          className="text-gradient select-none font-display text-[9rem] font-semibold leading-none sm:text-[13rem]"
          aria-hidden="true"
        >
          404
        </span>
        <span className="absolute -right-3 top-3 text-5xl sm:text-6xl" aria-hidden="true">
          🍳
        </span>
      </div>

      <h1 className="mt-2 font-display text-3xl font-semibold text-sand-950 sm:text-4xl">
        This dish is off the menu
      </h1>
      <p className="mt-3 max-w-md text-sand-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to something delicious.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          <HomeIcon className="h-5 w-5" />
          Back to home
        </Link>
        <Link
          href="/recipes"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Browse recipes
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
