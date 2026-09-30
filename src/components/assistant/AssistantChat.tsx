'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IconBot, IconSend, IconSparkles } from '@/components/icons'

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

const AGENT_STYLES: Record<string, string> = {
  study: 'from-emerald-500 to-teal-500',
  productivity: 'from-amber-500 to-orange-500',
  career: 'from-violet-500 to-purple-500',
  general: 'from-indigo-500 to-violet-500',
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

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce-dot"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
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
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
          Live student data could not be loaded. Set up PostgreSQL (.env + docker compose up -d)
          to let the agents personalise answers.
        </div>
      ) : null}

      <div className="flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.length === 0 && !busy ? (
          <div className="pt-10 animate-fade-in-up">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 animate-float">
              <IconBot className="h-7 w-7" />
            </div>
            <h1 className="text-center text-2xl font-bold tracking-tight text-zinc-900">
              Ask anything about your{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                student life
              </span>
            </h1>
            <p className="mx-auto mt-2 max-w-md text-center text-sm text-zinc-500">
              StudentOS routes your request to the right agent — study, productivity, or career —
              and turns AI-generated plans into real tasks.
            </p>
            <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-left text-sm text-zinc-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md active:scale-95 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end animate-scale-in">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-600 to-violet-600 px-4 py-2.5 text-sm text-white shadow-md shadow-indigo-500/20 sm:max-w-[70%]">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="max-w-[95%] animate-fade-in-up">
              {m.agent ? (
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ${AGENT_STYLES[m.agent] ?? AGENT_STYLES.general}`}
                  >
                    <IconSparkles className="h-3 w-3" />
                    {AGENT_LABELS[m.agent] ?? m.agent}
                  </span>
                  {m.reasoning ? (
                    <span className="text-[11px] text-zinc-400">{m.reasoning}</span>
                  ) : null}
                </div>
              ) : null}

              {m.text ? (
                <div className="whitespace-pre-wrap rounded-2xl rounded-tl-md border border-zinc-200/80 bg-white px-4 py-3 text-[15px] leading-relaxed text-zinc-800 shadow-sm">
                  {m.text}
                </div>
              ) : m.done ? null : (
                <div className="inline-flex items-center rounded-2xl rounded-tl-md border border-zinc-200/80 bg-white px-4 py-3 shadow-sm">
                  <TypingDots />
                </div>
              )}

              {m.tools.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {m.tools.map((t, i) => {
                    const created = (t.result as { created?: number } | undefined)?.created ?? 0
                    return (
                      <li
                        key={`${t.name}-${i}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 shadow-sm"
                      >
                        <span className="font-medium text-zinc-800">{t.name}</span>
                        {created > 0 ? (
                          <span className="font-medium text-emerald-600">
                            {created} task{created > 1 ? 's' : ''} created
                          </span>
                        ) : null}
                        {created > 0 ? (
                          <Link
                            href="/tasks"
                            className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
                          >
                            View tasks
                          </Link>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              ) : null}

              {m.warning ? (
                <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
                  {m.warning}
                </p>
              ) : null}
              {m.error ? (
                <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
                  {m.error}
                </div>
              ) : null}
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {notConfigured ? (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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

      <form onSubmit={(e) => void submit(e)} className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void submit()
            }
          }}
          rows={1}
          placeholder="Ask StudentOS…"
          className="max-h-32 flex-1 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm transition-all placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-90 disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <IconSend className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  )
}