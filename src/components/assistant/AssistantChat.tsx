'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ToolEvent = { name: string; args?: string; result?: unknown }

type Msg = {
  id: string
  role: 'user' | 'assistant'
  text: string
  agent?: string
  reasoning?: string
  tools: ToolEvent[]
  warning?: string
  error?: string
  done: boolean
}

const AGENT_LABELS: Record<string, string> = {
  study: 'Study Agent',
  productivity: 'Productivity Agent',
  career: 'Career Agent',
  general: 'StudentOS',
}

const SUGGESTIONS = [
  'Plan my week for my exam',
  'What should I learn next for my career goal?',
  'Help me organise the work I need to finish',
]

function uid() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Math.random()).slice(2)
}

export function AssistantChat({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const [contextUnavailable, setContextUnavailable] = useState(false)
  const startedRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, busy])

  useEffect(() => {
    if (initialQuery && !startedRef.current) {
      startedRef.current = true
      void send(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    setInput('')

    const history = messages.filter((m) => m.done || m.role === 'user')
    const userMsg: Msg = { id: uid(), role: 'user', text, tools: [], done: true }
    const asstMsg: Msg = {
      id: uid(),
      role: 'assistant',
      text: '',
      tools: [],
      done: false,
    }
    const next = [...history, userMsg, asstMsg]
    setMessages(next)
    setBusy(true)
    setNotConfigured(false)

    const patch = (fn: (m: Msg) => Msg) =>
      setMessages((prev) => prev.map((m) => (m.id === asstMsg.id ? fn(m) : m)))

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, userMsg].map((m) => ({ role: m.role, content: m.text })),
        }),
      })

      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as { code?: string; error?: string } | null
        if (body?.code === 'ai_not_configured') setNotConfigured(true)
        patch((m) => ({
          ...m,
          error: body?.error ?? `Request failed (${res.status}).`,
          done: true,
        }))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })

        let nl: number
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim()
          buf = buf.slice(nl + 1)
          if (!line) continue
          let ev: { type: string; [k: string]: unknown }
          try {
            ev = JSON.parse(line)
          } catch {
            continue
          }
          switch (ev.type) {
            case 'meta':
              patch((m) => ({ ...m, agent: ev.agent as string, reasoning: ev.reasoning as string }))
              break
            case 'text':
              patch((m) => ({ ...m, text: m.text + String(ev.delta ?? '') }))
              break
            case 'tool-call':
              patch((m) => ({
                ...m,
                tools: [...m.tools, { name: String(ev.name ?? ''), args: String(ev.args ?? '') }],
              }))
              break
            case 'tool-result':
              patch((m) => ({
                ...m,
                tools: m.tools.map((t) =>
                  t.name === ev.name ? { ...t, result: ev.result } : t
                ),
              }))
              break
            case 'warning':
              patch((m) => ({ ...m, warning: String(ev.message ?? '') }))
              break
            case 'context':
              if (ev.available === false) setContextUnavailable(true)
              break
            case 'error':
              patch((m) => ({ ...m, error: String(ev.message ?? 'Something went wrong.'), done: true }))
              break
            case 'done':
              patch((m) => ({ ...m, done: true }))
              break
          }
        }
      }

      // Safety net: mark the message complete if the stream ended without 'done'.
      setMessages((prev) => prev.map((m) => (m.id === asstMsg.id ? { ...m, done: true } : m)))
    } catch {
      patch((m) => ({ ...m, error: 'Network error — please try again.', done: true }))
    } finally {
      setBusy(false)
    }
  }

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await send(input)
  }

  return (
    <div className="flex h-[calc(100dvh-6rem)] flex-col lg:h-[calc(100dvh-5rem)]">
      {contextUnavailable ? (
        <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Live student data could not be loaded. Set up PostgreSQL (.env + docker compose up -d)
          to let the agents personalise answers.
        </div>
      ) : null}

      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.length === 0 && !busy ? (
          <div className="pt-8">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Ask anything about your student life
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-500">
              StudentOS routes your request to the right agent — study, productivity, or career —
              and turns AI-generated plans into real tasks.
            </p>
            <div className="mt-5 flex max-w-xl flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-left text-sm text-zinc-600 hover:border-blue-300 hover:text-blue-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-zinc-900 sm:max-w-[70%]">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="max-w-[95%]">
              {m.agent ? (
                <div className="mb-1 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    {AGENT_LABELS[m.agent] ?? m.agent}
                  </span>
                  {m.reasoning ? (
                    <span className="text-[11px] text-zinc-400">{m.reasoning}</span>
                  ) : null}
                </div>
              ) : null}

              {m.text ? (
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-800">
                  {m.text}
                </div>
              ) : m.done ? null : (
                <p className="text-sm text-zinc-400">Thinking…</p>
              )}

              {m.tools.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {m.tools.map((t, i) => {
                    const created = (t.result as { created?: number } | undefined)?.created ?? 0
                    return (
                      <li
                        key={`${t.name}-${i}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600"
                      >
                        <span className="font-medium text-zinc-800">{t.name}</span>
                        {created > 0 ? (
                          <span className="text-green-700">
                            {created} task{created > 1 ? 's' : ''} created
                          </span>
                        ) : null}
                        {created > 0 ? (
                          <Link href="/tasks" className="text-blue-700 underline underline-offset-2">
                            View tasks
                          </Link>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              ) : null}

              {m.warning ? (
                <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {m.warning}
                </p>
              ) : null}
              {m.error ? (
                <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {m.error}
                </div>
              ) : null}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {notConfigured ? (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">AI Assistant is not configured</p>
          <p className="mt-1">
            Set{' '}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
              GOOGLE_API_KEY
            </code>{' '}
            in your{' '}
            <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">.env</code>{' '}
            file (copy from .env.example), then restart the dev server. Get a key at{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              aistudio.google.com/apikey
            </a>
            .
          </p>
        </div>
      ) : null}

      <form onSubmit={(e) => void submit(e)} className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void submit()
            }
          }}
          rows={2}
          placeholder="Ask StudentOS…"
          className="flex-1 resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}