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