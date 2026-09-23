import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile, listSubjectsDetail, listTasks } from "@/db/queries";
import { dateKey, todayKey, formatDate } from "@/lib/date";
import { Panel } from "@/components/Panel";
import { TaskRow } from "@/components/tasks/TaskRow";
import type { TaskView } from "@/components/tasks/TaskRow";
import { DashboardAsk } from "@/components/DashboardAsk";
import { SetupNotice } from "@/components/SetupNotice";
import { IconArrowRight } from "@/components/icons";

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

  return (
    <div className="space-y-8">
      <SetupNotice />

      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          {greeting(new Date().getHours())}
          {name ? `, ${name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here is what you need to know right now. ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <Panel title="AI Assistant">
        <DashboardAsk />
        <p className="mt-2 text-xs text-zinc-500">
          Ask anything — StudentOS routes it to the right agent and can turn plans into tasks.
        </p>
      </Panel>

      <section aria-label="Today">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Today</h2>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            All tasks <IconArrowRight />
          </Link>
        </div>
        <Panel className="!p-2">
          {openTasks.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {openTasks.slice(0, 6).map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Nothing due today. Tasks with today’s date or overdue will appear here.
            </p>
          )}
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Academic"
          action={
            <Link
              href="/study"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Study →
            </Link>
          }
        >
          {nextExam ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-700">
                Next exam:{" "}
                <span className="font-medium text-zinc-900">{nextExam.name}</span>
                <span className="text-zinc-500"> · {formatDate(nextExam.examDate)}</span>
              </p>
              <p className="text-sm text-zinc-600">
                {doneCount} of {allTopics.length} topics completed across{" "}
                {subjects.length} subject{subjects.length === 1 ? "" : "s"}.
              </p>
              {allTopics.length > 0 ? (
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${topicPct}%` }}
                  />
                </div>
              ) : null}
            </div>
          ) : subjects.length > 0 ? (
            <p className="text-sm text-zinc-500">
              No upcoming exam date recorded. Add exam dates in Study.
            </p>
          ) : (
            <p className="text-sm text-zinc-500">No subjects yet. Start building your syllabus in Study.</p>
          )}
        </Panel>

        <Panel
          title="Career"
          action={
            <Link
              href="/career"
              className="text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Career →
            </Link>
          }
        >
          {profile?.targetRole ? (
            <div className="space-y-2">
              <p className="text-sm text-zinc-700">
                Working towards:{" "}
                <span className="font-medium text-zinc-900">{profile.targetRole}</span>
              </p>
              <p className="text-sm text-zinc-600">
                {profile.skills?.length ? (
                  <>
                    Skills:{" "}
                    <span className="text-zinc-900">
                      {profile.skills.slice(0, 6).join(", ")}
                      {profile.skills.length > 6 ? "…" : ""}
                    </span>
                  </>
                ) : (
                  "No skills recorded yet."
                )}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              No career goal yet. Set a target role so the Career Agent can guide you.
            </p>
          )}
        </Panel>
      </section>
    </div>
  );
}