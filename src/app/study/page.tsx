import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { listSubjectsDetail } from "@/db/queries";
import { dateKey } from "@/lib/date";
import { SubjectBoard } from "@/components/study/SubjectBoard";
import { IconArrowRight } from "@/components/icons";

export const metadata = { title: "Study" };
export const dynamic = "force-dynamic";

type TopicStatus = "todo" | "in_progress" | "done";

/** DB varchar columns widen status to string — coerce to the view union. */
function toTopicStatus(s: string): TopicStatus {
  return s === "in_progress" || s === "done" ? s : "todo";
}

export default async function StudyPage() {
  const userId = await getCurrentUserId();
  const res = await listSubjectsDetail(userId);
  const subjects = (res.data ?? []).map((s) => ({
    ...s,
    examDate: dateKey(s.examDate),
    topics: s.topics.map((t) => ({
      id: t.id,
      name: t.name,
      status: toTopicStatus(t.status),
    })),
  }));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Study</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your subjects, syllabus topics, exam dates and progress.
          </p>
        </div>
        <Link
          href="/assistant?q=I need help with my studies"
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95"
        >
          Study Assistant <IconArrowRight />
        </Link>
      </header>

      <SubjectBoard subjects={subjects} />
    </div>
  );
}