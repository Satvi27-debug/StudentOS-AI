import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile, listSubjectsDetail, listTasks } from "@/db/queries";
import { dateKey, todayKey, formatDate } from "@/lib/date";
import { Panel } from "@/components/Panel";
import { TaskRow } from "@/components/tasks/TaskRow";
import type { TaskView } from "@/components/tasks/TaskRow";
import { DashboardAsk } from "@/components/DashboardAsk";
import { SetupNotice } from "@/components/SetupNotice";
import {
  IconArrowRight,
  IconBook,
  IconCalendar,
  IconFlame,
  IconSparkles,
  IconTarget,
  IconTasks,
} from "@/components/icons";

export const dynamic = "force-dynamic";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const userId = await getCurrentUserId();
  const [profileQ, subjectsQ, tasksQ] = await Promise.all([
    getProfile(userId),
    listSubjectsDetail(userId),
    listTasks(userId),
  ]);

  const profile = profileQ.data;
  const subjects = subjectsQ.data ?? [];
  const tasks = tasksQ.data ?? [];

  const today = todayKey();
  const openTasks = tasks
    .filter((t) => t.status !== "done")
    .map((t) => ({ ...t, dueDateKey: dateKey(t.dueDate) }))
    .filter((t) => t.dueDateKey !== null && t.dueDateKey <= today)
    .map(
      (t): TaskView => ({
        id: t.id,
        title: t.title,
        description: t.description,
        dueDate: t.dueDateKey,
        status: t.status === "done" ? "done" : "todo",
        source: t.source,
        overdue: t.dueDateKey! < today,
      })
    )
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));

  const allTopics = subjects.flatMap((s) => s.topics);
  const doneCount = allTopics.filter((t) => t.status === "done").length;
  const topicPct = allTopics.length
    ? Math.round((doneCount / allTopics.length) * 100)
    : 0;

  const upcomingExams = subjects
    .filter((s) => s.examDate && (dateKey(s.examDate) ?? "9999") >= today)
    .sort((a, b) =>
      (dateKey(a.examDate) ?? "9999").localeCompare(dateKey(b.examDate) ?? "9999")
    );
  const nextExam = upcomingExams[0];

  const name = profile?.name && profile.name !== "Student" ? profile.name : "";
  const firstName = name ? name.split(" ")[0] : "";

  const stats = [
    {
      label: "Due today",
      value: openTasks.length,
      icon: <IconTasks className="h-4 w-4" />,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Topics done",
      value: `${doneCount}/${allTopics.length}`,
      icon: <IconBook className="h-4 w-4" />,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Next exam",
      value: nextExam ? formatDate(nextExam.examDate) : "—",
      icon: <IconCalendar className="h-4 w-4" />,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Target role",
      value: profile?.targetRole ?? "—",
      icon: <IconTarget className="h-4 w-4" />,
      accent: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="space-y-8">
      <SetupNotice />

      <header className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {greeting(new Date().getHours())}
          {firstName ? `, ${firstName}` : ""}
          <span className="ml-1 inline-block animate-wave">👋</span>
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Here is what you need to know right now. ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
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

      {/* AI Assistant */}
      <div className="rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
            <IconSparkles className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-zinc-900">AI Assistant</h2>
        </div>
        <DashboardAsk />
        <p className="mt-2.5 text-xs text-zinc-500">
          Ask anything — StudentOS routes it to the right agent and can turn plans into tasks.
        </p>
      </div>

      {/* Today */}
      <section aria-label="Today" className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
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
        <Panel className="!p-2">
          {openTasks.length > 0 ? (
            <div className="divide-y divide-zinc-50">
              {openTasks.slice(0, 6).map((t) => (
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
        </Panel>
      </section>

      {/* Academic + Career */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Academic"
          hover
          className="animate-fade-in-up"
          action={
            <Link
              href="/study"
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Study →
            </Link>
          }
        >
          {nextExam ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-amber-50/60 px-3.5 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <IconCalendar className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">{nextExam.name}</p>
                  <p className="text-xs text-zinc-500">Next exam · {formatDate(nextExam.examDate)}</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600">
                <span className="font-semibold text-zinc-900">{doneCount}</span> of{" "}
                <span className="font-semibold text-zinc-900">{allTopics.length}</span> topics
                completed across {subjects.length} subject{subjects.length === 1 ? "" : "s"}.
              </p>
              {allTopics.length > 0 ? (
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-zinc-600">{topicPct}%</span>
                </div>
              ) : null}
            </div>
          ) : subjects.length > 0 ? (
            <p className="text-sm text-zinc-500">
              No upcoming exam date recorded. Add exam dates in Study.
            </p>
          ) : (
            <div className="py-2 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg">
                📚
              </div>
              <p className="text-sm text-zinc-500">
                No subjects yet. Start building your syllabus in Study.
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Career"
          hover
          className="animate-fade-in-up"
          action={
            <Link
              href="/career"
              className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Career →
            </Link>
          }
        >
          {profile?.targetRole ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-violet-50/60 px-3.5 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <IconTarget className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500">Working towards</p>
                  <p className="truncate text-sm font-semibold text-zinc-900">{profile.targetRole}</p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-zinc-500">Skills</p>
                {profile.skills?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 6).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
                      >
                        {s}
                      </span>
                    ))}
                    {profile.skills.length > 6 ? (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-400">
                        +{profile.skills.length - 6}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No skills recorded yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="py-2 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                🎯
              </div>
              <p className="text-sm text-zinc-500">
                No career goal yet. Set a target role so the Career Agent can guide you.
              </p>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}