import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

/** Resolves Clerk user id for server code (auth() + currentUser() fallback avoids post-login RSC gaps). */
export async function getClerkUserId(): Promise<string | null> {
  const { userId } = await auth();
  if (userId) return userId;
  const user = await currentUser();
  return user?.id ?? null;
}
