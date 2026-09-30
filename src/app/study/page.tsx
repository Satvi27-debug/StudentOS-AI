'use client'

import { useState } from 'react'
import { useStudent } from '@/lib/local/store'
import { SubjectBoard } from '@/components/study/SubjectBoard'
import { StudySessionForm } from '@/components/study/StudySessionForm'
import { studyTimeOn, studyTimeThisWeek, studyTimeBySubject } from '@/lib/local/selectors'
import { todayKey } from '@/lib/date'
import { IconClock, IconSparkles, IconTrendingUp } from '@/components/icons'

export default function StudyPage() {
  const { state, loading, error } = useStudent()
  const [showSessions, setShowSessions] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-zinc-400">Loading…</p>
      </div>
    )
  }

  if (error || !state) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-rose-500">{error ?? 'Failed to load data'}</p>
      </div>
    )
  }

  const today = todayKey()
  const todayMinutes = studyTimeOn(state.studySessions, today)
  const weekMinutes = studyTimeThisWeek(state.studySessions)
  const bySubject = studyTimeBySubject(state.studySessions, state.subjects)

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Study</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your subjects, syllabus topics, exam dates, progress, and study sessions.
        </p>
      </header>

      {/* Study stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Today',
            value: `${todayMinutes}m`,
            icon: <IconClock className="h-4 w-4" />,
            accent: 'bg-indigo-50 text-indigo-600',
          },
          {
            label: 'This week',
            value: `${Math.floor(weekMinutes / 60)}h ${weekMinutes % 60}m`,
            icon: <IconTrendingUp className="h-4 w-4" />,
            accent: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Subjects',
            value: state.subjects.length,
            icon: <IconTrendingUp className="h-4 w-4" />,
            accent: 'bg-violet-50 text-violet-600',
          },
          {
            label: 'Sessions',
            value: state.studySessions.length,
            icon: <IconClock className="h-4 w-4" />,
            accent: 'bg-amber-50 text-amber-600',
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up"
            style={{ animationDelay: `${0.05 + i * 0.05}s` }}
          >
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.accent}`}>
              {s.icon}
            </span>
            <p className="mt-2 text-lg font-bold text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Study time by subject */}
      {bySubject.length > 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Study time by subject</h2>
          <div className="space-y-2">
            {bySubject.slice(0, 5).map((s) => {
              const max = bySubject[0]?.minutes ?? 1
              const pct = Math.round((s.minutes / max) * 100)
              return (
                <div key={s.subjectId} className="flex items-center gap-3">
                  <span className="w-32 truncate text-xs font-medium text-zinc-600">{s.name}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-bold text-zinc-500">{s.minutes}m</span>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Log session toggle */}
      <button
        type="button"
        onClick={() => setShowSessions(!showSessions)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 active:scale-95"
      >
        <IconClock className="h-4 w-4" />
        {showSessions ? 'Hide session form' : 'Log a study session'}
      </button>

      {showSessions ? (
        <div className="animate-fade-in-up">
          <StudySessionForm />
        </div>
      ) : null}

      <SubjectBoard subjects={state.subjects} />

      {/* Ask AI — opens the assistant with a study-focused query */}
      <div className="flex justify-center">
        <a
          href="/assistant?q=I need help with my studies"
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md active:scale-95"
        >
          <IconSparkles className="h-4 w-4" />
          Ask AI for help with studies
        </a>
      </div>
    </div>
  )
}