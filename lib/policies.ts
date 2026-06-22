import { auth } from "@/auth";
import { ApiError } from "./errors";

export interface SessionUser {
  id: string;
  role: string;
  email?: string | null;
  name?: string | null;
}

// Require an authenticated user; throws 401 otherwise.
export async function requireUser(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new ApiError("UNAUTHORIZED", "You must be signed in to do that.");
  }
  return session.user as SessionUser;
}

// Returns the current user or null (for endpoints that vary by auth but don't require it).
export async function getOptionalUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user?.id ? (session.user as SessionUser) : null;
}

// Owner-or-admin guard for mutations on owned resources; throws 403 otherwise.
export function assertOwnerOrAdmin(user: SessionUser, ownerId: string): void {
  if (user.id !== ownerId && user.role !== "ADMIN") {
    throw new ApiError("FORBIDDEN", "You don't have permission to do that.");
  }
}
