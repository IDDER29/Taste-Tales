import type { NextAuthConfig } from "next-auth";

// Edge-safe Auth.js config (no Prisma / bcrypt). Shared by the middleware and
// the full server instance. Providers are added in auth.ts (server-only).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    // Protects routes matched by middleware.ts. Returning false redirects to the
    // sign-in page (with callbackUrl) automatically.
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
