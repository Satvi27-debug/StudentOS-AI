import { getCurrentUserId } from "@/lib/auth";
import { listTasks } from "@/db/queries";
import { dateKey, todayKey } from "@/lib/date";
import { AddTask } from "@/components/tasks/AddTask";
import { TaskRow } from "@/components/tasks/TaskRow";
import type { TaskView } from "@/components/tasks/TaskRow";

export const metadata = { title: "Tasks" };
export const dynamic = "force-dynamic";

function Section({
  title,
  tasks,
}: {
  title: string;
  tasks: TaskView[];
}) {
  return (
    <section className="space-y-1">
      <h2 className="px-2 pb-1 pt-2 text-sm font-semibold text-zinc-900">
        {title} <span className="font-normal text-zinc-400">{tasks.length}</span>
      </h2>
      {tasks.length === 0 ? (
        <p className="px-2 py-1 text-sm text-zinc-400">Nothing here.</p>
      ) : (
        <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white px-2 py-1">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      )}
    </section>
  )
}

export default async function TasksPage() {
  const userId = await getCurrentUserId();
  const res = await listTasks(userId);
  const tasks = res.data ?? [];
  const today = todayKey();

  const toView = (t: (typeof tasks)[number], overdue = false): TaskView => ({
    id: t.id,
    title: t.title,
    description: t.description,
    dueDate: dateKey(t.dueDate),
    status: t.status === "done" ? "done" : "todo",
    source: t.source,
    overdue,
  });

  const open = tasks.filter((t) => t.status !== "done");
  const key = (t: (typeof tasks)[number]) => dateKey(t.dueDate) ?? "9999";

  const overdue = open
    .filter((t) => (dateKey(t.dueDate) ?? "9999") < today)
    .sort((a, b) => key(a).localeCompare(key(b)))
    .map((t) => toView(t, true));
  const dueToday = open
    .filter((t) => dateKey(t.dueDate) === today)
    .map((t) => toView(t));
  const upcoming = open
    .filter((t) => (dateKey(t.dueDate) ?? "9999") > today)
    .sort((a, b) => key(a).localeCompare(key(b)))
    .map((t) => toView(t));
  const noDate = open.filter((t) => !dateKey(t.dueDate)).map((t) => toView(t));
  const done = tasks
    .filter((t) => t.status === "done")
    .sort((a, b) => new Date(b.completedAt ?? b.createdAt).getTime() - new Date(a.completedAt ?? a.createdAt).getTime())
    .slice(0, 20)
    .map((t) => toView(t));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          One task list for everything — your own to-dos plus plans created by the AI agents.
        </p>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-5">
        <AddTask />
      </div>

      <div className="space-y-4">
        <Section title="Overdue" tasks={overdue} />
        <Section title="Today" tasks={dueToday} />
        <Section title="Upcoming" tasks={upcoming} />
        <Section title="No date" tasks={noDate} />
        <Section title="Completed" tasks={done} />
      </div>
    </div>
  );
}