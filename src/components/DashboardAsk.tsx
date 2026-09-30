'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconSend, IconSparkles } from '@/components/icons'

const QUICK_PROMPTS = [
  'Plan my study week',
  'Explain a concept',
  'Build my resume plan',
]

/** Home screen composer — jumps into the assistant with the typed question. */
export function DashboardAsk() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/assistant?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={submit}
        className={`flex items-center gap-2 rounded-2xl border bg-white p-1.5 pl-4 transition-all duration-300 ${
          focused
            ? 'border-indigo-400 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]'
            : 'border-zinc-200 shadow-sm'
        }`}
      >
        <IconSparkles
          className={`h-4 w-4 shrink-0 transition-colors ${
            focused ? 'text-indigo-500' : 'text-zinc-400'
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask StudentOS anything…"
          className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Ask StudentOS"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-90 disabled:opacity-40 disabled:shadow-none"
        >
          <IconSend className="h-4 w-4" />
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-zinc-400">Try:</span>
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => router.push(`/assistant?q=${encodeURIComponent(q)}`)}
            className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-sm active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}