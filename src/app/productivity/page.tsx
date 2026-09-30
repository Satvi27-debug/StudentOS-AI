'use client'

import { useStudent } from '@/lib/local/store'
import { productivitySummary, studyTimeBySubject } from '@/lib/local/selectors'
import { StatCard, ProgressBar } from '@/components/productivity/StatCard'
import {
  IconBook,
  IconCheck,
  IconClock,
  IconFolder,
  IconTarget,
  IconTrendingUp,
} from '@/components/icons'

export default function ProductivityPage() {
  const { state } = useStudent()
  const summary = productivitySummary(state)
  const bySubject = studyTimeBySubject(state.studySessions, state.subjects)

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Productivity</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your activity at a glance — tasks, goals, study time, and projects.
        </p>
      </header>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Completed tasks"
          value={summary.completedTasks}
          icon={<IconCheck className="h-4 w-4" />}
          accent="bg-emerald-50 text-emerald-600"
          sub={`${summary.pendingTasks} pending`}
        />
        <StatCard
          label="Completed goals"
          value={`${summary.completedGoals}/${summary.totalGoals}`}
          icon={<IconTarget className="h-4 w-4" />}
          accent="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Study today"
          value={`${summary.studyMinutesToday}m`}
          icon={<IconClock className="h-4 w-4" />}
          accent="bg-indigo-50 text-indigo-600"
          sub={`${Math.floor(summary.studyMinutesThisWeek / 60)}h ${summary.studyMinutesThisWeek % 60}m this week`}
        />
        <StatCard
          label="Active projects"
          value={summary.activeProjects}
          icon={<IconFolder className="h-4 w-4" />}
          accent="bg-amber-50 text-amber-600"
          sub={`${summary.completedProjects} completed`}
        />
      </div>

      {/* Progress bars */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <IconTrendingUp className="h-4 w-4 text-indigo-500" />
            Overall Progress
          </h2>
          <div className="space-y-4">
            <ProgressBar label="Study topics" value={summary.doneTopics} max={summary.totalTopics} />
            <ProgressBar label="Tasks" value={summary.completedTasks} max={summary.completedTasks + summary.pendingTasks} color="from-emerald-500 to-teal-500" />
            <ProgressBar label="Goals" value={summary.completedGoals} max={summary.totalGoals} color="from-violet-500 to-purple-500" />
            <ProgressBar label="Projects" value={summary.completedProjects} max={summary.totalProjects} color="from-amber-500 to-orange-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <IconClock className="h-4 w-4 text-indigo-500" />
            Study Time by Subject
          </h2>
          {bySubject.length > 0 ? (
            <div className="space-y-3">
              {bySubject.map((s) => (
                <ProgressBar
                  key={s.subjectId}
                  label={s.name}
                  value={s.minutes}
                  max={bySubject[0]?.minutes ?? 1}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                📊
              </div>
              <p className="text-sm text-zinc-500">No study sessions yet.</p>
              <p className="mt-0.5 text-xs text-zinc-400">Log a session in the Study page to see stats.</p>
            </div>
          )}
        </div>
      </div>

      {/* Subject progress */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <IconBook className="h-4 w-4 text-emerald-500" />
          Subject Progress
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.subjects.map((s) => {
            const pct = s.topics.length > 0
              ? Math.round((s.topics.filter((t) => t.status === 'done').length / s.topics.length) * 100)
              : 0
            return (
              <div key={s.id} className="rounded-xl bg-zinc-50 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-700">{s.name}</span>
                  <span className="text-xs font-bold text-zinc-500">{pct}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-400">
                  {s.topics.filter((t) => t.status === 'done').length}/{s.topics.length} topics
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}