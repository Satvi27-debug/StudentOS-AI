import Link from "next/link";
import { IconArrowRight, IconRocket } from "@/components/icons";

export type StubProps = {
  title: string
  description: string
  roadmap: string[]
  action?: { label: string; href: string }
}

export function Stub({ title, description, roadmap, action }: StubProps) {
  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">{description}</p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <IconRocket className="h-4.5 w-4.5" />
          </span>
          <p className="text-sm font-semibold text-zinc-900">Planned for the next milestone</p>
        </div>
        <ul className="mt-4 space-y-2">
          {roadmap.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 animate-fade-in-up"
              style={{ animationDelay: `${0.05 + i * 0.05}s` }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              {item}
            </li>
          ))}
        </ul>
        {action ? (
          <Link
            href={action.href}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95"
          >
            {action.label} <IconArrowRight />
          </Link>
        ) : null}
      </div>
    </div>
  )
}