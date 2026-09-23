import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

/**
 * Auth proxy.
 *
 * Without Clerk keys the app runs in single-user local mode and every
 * request passes through untouched. With Clerk keys present, all pages
 * and API routes are protected (sign-in page stays public).
 */
export async function proxy(req: NextRequest, event: NextFetchEvent) {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  )
  if (!enabled) return NextResponse.next()

  const { clerkMiddleware } = await import('@clerk/nextjs/server').catch(() => ({
    clerkMiddleware: null,
  }))
  if (!clerkMiddleware) return NextResponse.next()

  const handler = clerkMiddleware(async (auth, request) => {
    const { pathname } = request.nextUrl
    const isPublic = pathname.startsWith('/sign-in')
    if (isPublic) return
    await auth.protect()
  })
  return handler(req, event)
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}