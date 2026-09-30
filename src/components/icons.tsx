import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function base(props: IconProps, size = 18): IconProps {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    ...props,
  }
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  )
}
export function IconBook(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  )
}
export function IconCode(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 4-3 16" />
    </svg>
  )
}
export function IconFolder(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  )
}
export function IconBriefcase(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  )
}
export function IconGlobe(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
    </svg>
  )
}
export function IconFlask(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5.2 9A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.8-3L14 9V3" />
      <path d="M7.5 15h9" />
    </svg>
  )
}
export function IconTasks(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m4 6 1.5 1.5L8 5" />
      <path d="m4 13 1.5 1.5L8 12" />
      <path d="m4 20 1.5 1.5L8 19" />
      <path d="M12 6.5h8" />
      <path d="M12 13.5h8" />
      <path d="M12 20.5h8" />
    </svg>
  )
}
export function IconSparkles(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3l1.7 4.6L18.3 9.3 13.7 11 12 15.6 10.3 11 5.7 9.3 10.3 7.6 12 3Z" />
      <path d="M19 14l.9 2.4 2.4.9-2.4.9L19 20.6l-.9-2.4-2.4-.9 2.4-.9L19 14Z" />
    </svg>
  )
}
export function IconUser(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}
export function IconMenu(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  )
}
export function IconClose(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}
export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}
export function IconTrash(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  )
}
export function IconArrowRight(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}
export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  )
}
export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  )
}
export function IconClock(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}
export function IconFlame(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M12 22c4.4 0 7-2.8 7-6.5 0-3-2-5.5-3.5-7C14 7 13 5.5 13 3c-3 2-5 4.5-5 8-1-.5-1.7-1.3-2-2.5C4.7 10 4 12 4 14c0 4.5 3.6 8 8 8Z" />
    </svg>
  )
}
export function IconTarget(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}
export function IconZap(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
    </svg>
  )
}
export function IconSend(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3 14 21l-3.5-7.5L3 10 21 3Z" />
    </svg>
  )
}
export function IconBot(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <path d="M9 17h6" />
    </svg>
  )
}
export function IconDatabase(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5V12c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5" />
      <path d="M4 12v6.5c0 1.7 3.6 3 8 3s8-1.3 8-3V12" />
    </svg>
  )
}
export function IconKey(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.5 11.5 8-8" />
      <path d="m17 5 2.5 2.5" />
      <path d="m14 8 2 2" />
    </svg>
  )
}
export function IconShield(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M12 2 4.5 5.5v5.7c0 4.6 3.2 8 7.5 9.8 4.3-1.8 7.5-5.2 7.5-9.8V5.5L12 2Z" />
      <path d="m8.8 11.8 2.3 2.3 4.2-4.6" />
    </svg>
  )
}
export function IconChevronDown(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
export function IconTrendingUp(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  )
}
export function IconAward(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-2 7 5.5-3 5.5 3-2-7" />
    </svg>
  )
}
export function IconRocket(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M12 15c5-3 7-8 7-12-4 0-9 2-12 7l-3 1 4 4 1-3" />
      <path d="M9 12 5 16" />
      <path d="M14 5.5c1.5-1 3.5-1.5 5.5-1.5-.5 2-1 4-2 5.5" />
      <circle cx="14.5" cy="9.5" r="1.5" />
    </svg>
  )
}
export function IconBell(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z" />
      <path d="M10 20a2.2 2.2 0 0 0 4 0" />
    </svg>
  )
}
export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.6-4.6" />
    </svg>
  )
}
export function IconSettings(p: IconProps) {
  return (
    <svg {...base(p, 16)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  )
}