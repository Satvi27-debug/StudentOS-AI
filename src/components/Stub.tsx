import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export type StubProps = {
  title: string
  description: string
  roadmap: string[]
  action?: { label: string; href: string }
}

export function Stub({ title, description, roadmap, action }: StubProps) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">{description}</p>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-sm font-semibold text-zinc-900">Planned for the next milestone</p>
        <ul className="mt-3 space-y-1.5">
          {roadmap.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              {item}
            </li>
          ))}
        </ul>
        {action ? (
          <Link
            href={action.href}
            className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            {action.label} <IconArrowRight />
          </Link>
        ) : null}
      </div>
    </div>
  )
}