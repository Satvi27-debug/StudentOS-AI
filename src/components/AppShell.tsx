'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarContent } from '@/components/Sidebar'
import { IconClose, IconMenu } from '@/components/icons'

/**
 * App shell: fixed sidebar on desktop, top bar + slide-over drawer on
 * mobile. Matches the StudentOS layout rules — structured, restrained.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  // Close the drawer whenever the route changes (adjusting state during
  // render, per React guidance — no setState in an effect).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-zinc-200 bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            StudentOS
          </span>
        </span>
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100"
        >
          <IconMenu />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-900/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
            >
              <IconClose />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}