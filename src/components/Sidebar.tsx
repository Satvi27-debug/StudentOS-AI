'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  IconBook,
  IconBriefcase,
  IconCode,
  IconFlask,
  IconFolder,
  IconGlobe,
  IconHome,
  IconSparkles,
  IconTasks,
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
  { href: '/opportunities', label: 'Opportunities', icon: IconGlobe },
  { href: '/research', label: 'Research', icon: IconFlask },
  { href: '/tasks', label: 'Tasks', icon: IconTasks },
  { href: '/assistant', label: 'AI Assistant', icon: IconSparkles },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
        S
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
        StudentOS
      </span>
    </Link>
  )
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-zinc-200 px-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Student workspace
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
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                active
                  ? 'bg-zinc-100 font-medium text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-0.5 border-t border-zinc-200 px-3 py-3">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
            pathname.startsWith('/profile')
              ? 'bg-zinc-100 font-medium text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <IconUser className="h-4 w-4 shrink-0" />
          Profile
        </Link>
        {clerkEnabled ? (
          <div className="flex items-center justify-between px-2.5 py-1.5">
            <span className="text-xs text-zinc-500">Account</span>
            <UserButton />
          </div>
        ) : (
          <p className="px-2.5 py-1.5 text-xs text-zinc-400">Local mode · no auth</p>
        )}
      </div>
    </div>
  )
}

export { mainNav }