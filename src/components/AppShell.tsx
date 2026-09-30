'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarContent } from '@/components/Sidebar'
import { IconClose, IconMenu } from '@/components/icons'

/**
 * App shell: dark sidebar on desktop, glassy top bar + animated drawer on
 * mobile. The dark rail makes the light content area feel focused.
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-zinc-950 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-4 backdrop-blur-xl lg:hidden">
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/25">
            S
          </span>
          <span className="text-[15px] font-bold tracking-tight text-zinc-900">
            StudentOS
          </span>
        </span>
        <button
          type="button"
          aria-label="Open navigation"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-all hover:bg-zinc-100 active:scale-90"
        >
          <IconMenu />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-zinc-950 shadow-2xl animate-[slide-in-left_0.25s_ease-out]">
            <button
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3.5 flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-all hover:bg-white/10 hover:text-white active:scale-90"
            >
              <IconClose />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}