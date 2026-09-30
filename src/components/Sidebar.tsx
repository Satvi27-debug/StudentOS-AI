'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  IconBook,
  IconBriefcase,
  IconCode,
  IconFolder,
  IconHome,
  IconTarget,
  IconTasks,
  IconTrendingUp,
  IconUser,
} from '@/components/icons'
import { clerkEnabled } from '@/lib/auth-client'

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const mainNav: NavItem[] = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/study', label: 'Study', icon: IconBook },
  { href: '/coding', label: 'Coding', icon: IconCode },
  { href: '/projects', label: 'Projects', icon: IconFolder },
  { href: '/career', label: 'Career', icon: IconBriefcase },
  { href: '/tasks', label: 'Tasks', icon: IconTasks },
  { href: '/goals', label: 'Goals', icon: IconTarget },
  { href: '/skills', label: 'Skills', icon: IconTrendingUp },
  { href: '/productivity', label: 'Productivity', icon: IconTrendingUp },
]

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105 group-hover:rotate-3">
        S
      </span>
      <span className="text-[15px] font-bold tracking-tight text-white">
        StudentOS
      </span>
    </Link>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-2.5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          Workspace
        </p>
        {mainNav.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-950/50'
                  : 'text-zinc-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  active ? '' : 'text-zinc-500 group-hover:text-indigo-300'
                }`}
              />
              {item.label}
              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
            pathname.startsWith('/profile')
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-950/50'
              : 'text-zinc-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white'
          }`}
        >
          <IconUser className="h-[18px] w-[18px] shrink-0 text-zinc-500 transition-transform duration-200 group-hover:scale-110 group-hover:text-indigo-300" />
          Profile
        </Link>
        {clerkEnabled ? (
          <div className="flex items-center justify-between rounded-xl px-3 py-2">
            <span className="text-xs text-zinc-500">Account</span>
            <UserButton />
          </div>
        ) : (
          <p className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Local mode · no auth
          </p>
        )}
      </div>
    </div>
  )
}

export { mainNav }