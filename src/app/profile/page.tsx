import { getCurrentUserId } from "@/lib/auth";
import { getProfile } from "@/db/queries";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  const res = await getProfile(userId);
  const p = res.data;

  return (
    <div className="space-y-6">
      <header className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your basic academic information — the context every StudentOS agent uses.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)] animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
        <ProfileForm
          name={p?.name ?? ""}
          college={p?.college ?? ""}
          degree={p?.degree ?? ""}
          branch={p?.branch ?? ""}
          year={p?.year ?? ""}
          semester={p?.semester ?? ""}
        />
      </div>
    </div>
  );
}