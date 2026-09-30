import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/db/queries";
import { CareerPanel } from "@/components/career/CareerPanel";
import { IconArrowRight } from "@/components/icons";

export const metadata = { title: "Career" };
export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const userId = await getCurrentUserId();
  const res = await getProfile(userId);
  const profile = res.data;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Career</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your target role, skills and preparation — used by the Career Agent to plan your next steps.
          </p>
        </div>
        <Link
          href="/assistant?q=Help me plan my career preparation"
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/35 active:scale-95"
        >
          Career Assistant <IconArrowRight />
        </Link>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        <CareerPanel
          targetRole={profile?.targetRole ?? null}
          skills={profile?.skills ?? null}
          interests={profile?.interests ?? null}
        />
      </div>
    </div>
  );
}