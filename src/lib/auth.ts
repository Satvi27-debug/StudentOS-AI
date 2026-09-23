/**
 * Auth is optional in MVP: with Clerk keys present the app requires
 * sign-in; without them it runs in single-user local mode ('local').
 */
export const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
)

export async function getCurrentUserId(): Promise<string> {
  if (!clerkEnabled) return 'local'
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId ?? 'local'
  } catch {
    return 'local'
  }
}
