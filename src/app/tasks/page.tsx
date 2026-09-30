import { getCurrentUserId } from "@/lib/auth";
import { listTasks } from "@/db/queries";
import { dateKey, todayKey } from "@/lib/date";
import { AddTask } from "@/components/tasks/AddTask";
import { TaskRow } from "@/components/tasks/TaskRow";
import type { TaskView } from "@/components/tasks/TaskRow";
import { IconCheck, IconClock, IconFlame } from "@/components/icons";

export const metadata = { title: "Tasks" };
export const dynamic = "force-dynamic";

function Section({
  title,
  icon,
  tasks,
  accent,
}: {
  title: string;
  icon: React.ReactNode;
  tasks: TaskView[];
  accent: string;
}) {
  return (
    <section className="space-y-1.5">
      <h2 className="flex items-center gap-2 px-2 pb-1 pt-2 text-sm font-semibold text-zinc-900">
        <span className={`flex h-5 w-5 items-center justify-center rounded-md ${accent}`}>
          {icon}
        </span>
        {title} <span className="font-normal text-zinc-400">{tasks.length}</span>
      </h2>
      {tasks.length === 0 ? (
        <p className="px-2 py-1 text-sm text-zinc-400">Nothing here.</p>
      ) : (
        <div className="divide-y divide-zinc-50 rounded-2xl border border-zinc-200/80 bg-white px-2 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]">
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      )}
    </section>
  );
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
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          One task list for everything — your own to-dos plus plans created by the AI agents.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        <AddTask />
      </div>

      <div className="space-y-4">
        <Section
          title="Overdue"
          icon={<IconFlame className="h-3 w-3 text-rose-500" />}
          tasks={overdue}
          accent="bg-rose-50"
        />
        <Section
          title="Today"
          icon={<IconClock className="h-3 w-3 text-indigo-500" />}
          tasks={dueToday}
          accent="bg-indigo-50"
        />
        <Section
          title="Upcoming"
          icon={<IconClock className="h-3 w-3 text-amber-500" />}
          tasks={upcoming}
          accent="bg-amber-50"
        />
        <Section
          title="No date"
          icon={<IconClock className="h-3 w-3 text-zinc-400" />}
          tasks={noDate}
          accent="bg-zinc-100"
        />
        <Section
          title="Completed"
          icon={<IconCheck className="h-3 w-3 text-emerald-500" />}
          tasks={done}
          accent="bg-emerald-50"
        />
      </div>
    </div>
  );
}