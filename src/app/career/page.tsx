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
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Career</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your target role, skills and preparation — used by the Career Agent to plan your next steps.
          </p>
        </div>
        <Link
          href="/assistant?q=Help me plan my career preparation"
          className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          Career Assistant <IconArrowRight />
        </Link>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <CareerPanel
          targetRole={profile?.targetRole ?? null}
          skills={profile?.skills ?? null}
          interests={profile?.interests ?? null}
        />
      </div>
    </div>
  );
}