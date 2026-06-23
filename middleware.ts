import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge middleware uses the Prisma-free authConfig to read the JWT session and
// gate the create/edit pages (defense in depth on top of the client guards +
// server-side ownership checks). Unauthenticated users are redirected to /login
// with a callbackUrl.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/articles", "/edit-article/:path*"],
};
