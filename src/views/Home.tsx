"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Landing from "./Landing";
import HomeFeed from "./HomeFeed";

/**
 * `/` adapts to the visitor:
 *  - signed-in  → a personalized home feed (saved, popular, fresh, your recipes)
 *  - everyone else (and while the session loads) → the marketing landing page
 */
function Home() {
  const { status } = useSession();
  return status === "authenticated" ? <HomeFeed /> : <Landing />;
}

export default Home;
