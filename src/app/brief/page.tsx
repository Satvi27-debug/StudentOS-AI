'use client'

import Link from 'next/link'
import { useStudent } from '@/lib/local/store'
import {
  productivitySummary,
  subjectProgress,
  tasksDueToday,
  tasksOverdue,
  tasksUpcoming,
} from '@/lib/local/selectors'
import { formatDate, todayKey } from '@/lib/date'
import { TaskRow } from '@/components/tasks/TaskRow'
import {
  IconArrowRight,
  IconAward,
  IconBook,
  IconCalendar,
  IconClock,
  IconFlame,
  IconFolder,
  IconSparkles,
  IconTarget,
  IconTasks,
  IconTrendingUp,
} from '@/components/icons'

export default function BriefPage() {
  const { state } = useStudent()
  const today = todayKey()

  const dueToday = tasksDueToday(state.tasks)
  const overdue = tasksOverdue(state.tasks)
  const upcoming = tasksUpcoming(state.tasks)
  const summary = productivitySummary(state)

  const nextExam = state.subjects
    .filter((s) => s.examDate && s.examDate >= today)
    .sort((a, b) => (a.examDate ?? '').localeCompare(b.examDate ?? ''))[0]

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-2 animate-fade-in-up">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          <IconSparkles className="h-4 w-4" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Brief</h1>
        <p className="text-sm text-zinc-500">— your day at a glance</p>
      </header>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Due today',
            value: dueToday.length,
            icon: <IconTasks className="h-4 w-4" />,
            accent: 'bg-indigo-50 text-indigo-600',
          },
          {
            label: 'Overdue',
            value: overdue.length,
            icon: <IconFlame className="h-4 w-4" />,
            accent: 'bg-rose-50 text-rose-600',
          },
          {
            label: 'Topics done',
            value: `${summary.doneTopics}/${summary.totalTopics}`,
            icon: <IconBook className="h-4 w-4" />,
            accent: 'bg-emerald-50 text-emerald-600',
          },
          {
            label: 'Study this week',
            value: `${Math.floor(summary.studyMinutesThisWeek / 60)}h ${summary.studyMinutesThisWeek % 60}m`,
            icon: <IconClock className="h-4 w-4" />,
            accent: 'bg-amber-50 text-amber-600',
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.08)] animate-fade-in-up"
            style={{ animationDelay: `${0.05 + i * 0.06}s` }}
          >
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${s.accent}`}>
              {s.icon}
            </span>
            <p className="mt-2.5 truncate text-lg font-bold text-zinc-900">{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today + Upcoming */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-label="Today" className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconFlame className="h-4 w-4 text-orange-500" />
              Today
            </h2>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              All tasks <IconArrowRight />
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]">
            {dueToday.length > 0 ? (
              <div className="divide-y divide-zinc-50">
                {dueToday.slice(0, 6).map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                  ✨
                </div>
                <p className="text-sm font-medium text-zinc-700">Nothing due today</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Tasks with today&apos;s date or overdue will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <section aria-label="Upcoming" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconCalendar className="h-4 w-4 text-indigo-500" />
              Upcoming
            </h2>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              View all <IconArrowRight />
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]">
            {upcoming.length > 0 ? (
              <div className="divide-y divide-zinc-50">
                {upcoming.slice(0, 6).map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                  📅
                </div>
                <p className="text-sm font-medium text-zinc-700">No upcoming tasks</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Tasks with future due dates will appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Progress + Goals */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconTrendingUp className="h-4 w-4 text-emerald-500" />
              Study Progress
            </h2>
            <Link href="/study" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Study →
            </Link>
          </div>
          <div className="space-y-3">
            {state.subjects.slice(0, 5).map((s) => {
              const pct = subjectProgress(s)
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-600">{s.name}</span>
                    <span className="font-bold text-zinc-800">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          {nextExam ? (
            <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-50/60 px-3.5 py-2.5">
              <IconCalendar className="h-4 w-4 text-amber-600" />
              <p className="text-xs text-amber-800">
                Next exam: <span className="font-semibold">{nextExam.name}</span> · {formatDate(nextExam.examDate)}
              </p>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconTarget className="h-4 w-4 text-violet-500" />
              Active Goals
            </h2>
            <Link href="/goals" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Goals →
            </Link>
          </div>
          {state.goals.filter((g) => g.status === 'active').length > 0 ? (
            <div className="space-y-2.5">
              {state.goals
                .filter((g) => g.status === 'active')
                .slice(0, 3)
                .map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700">{g.title}</span>
                      <span className="font-bold text-indigo-600">{g.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500 ease-out"
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                🎯
              </div>
              <p className="text-sm text-zinc-500">No active goals yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* Projects + Career */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconFolder className="h-4 w-4 text-indigo-500" />
              Active Projects
            </h2>
            <Link href="/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Projects →
            </Link>
          </div>
          {state.projects.filter((p) => p.status === 'in_progress' || p.status === 'planning').length > 0 ? (
            <div className="space-y-2.5">
              {state.projects
                .filter((p) => p.status === 'in_progress' || p.status === 'planning')
                .slice(0, 3)
                .map((p) => {
                  const pct = p.tasks.length > 0
                    ? Math.round((p.tasks.filter((t) => t.done).length / p.tasks.length) * 100)
                    : 0
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-800">{p.name}</p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-zinc-500">{pct}%</span>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                🚀
              </div>
              <p className="text-sm text-zinc-500">No active projects.</p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <IconAward className="h-4 w-4 text-amber-500" />
              Career
            </h2>
            <Link href="/career" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Career →
            </Link>
          </div>
          {state.student.targetRole ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-violet-50/60 px-3.5 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <IconTarget className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">Working towards</p>
                  <p className="truncate text-sm font-semibold text-zinc-900">{state.student.targetRole}</p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-500">Top skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {state.skills.slice(0, 5).map((s) => (
                    <span
                      key={s.id}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                🎯
              </div>
              <p className="text-sm text-zinc-500">
                No career goal yet. Set a target role so the Career Agent can guide you.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}