'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconArrowRight } from '@/components/icons'

/** Home screen composer — jumps into the assistant with the typed question. */
export function DashboardAsk() {
  const router = useRouter()
  const [value, setValue] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/assistant?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask StudentOS anything…"
        className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Ask StudentOS"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3.5 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <IconArrowRight />
      </button>
    </form>
  )
}