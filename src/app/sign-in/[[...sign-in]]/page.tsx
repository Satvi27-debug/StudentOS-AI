import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth-client";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  if (!clerkEnabled) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
          Sign-in is optional in local mode
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Add Clerk keys to your <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs">.env</code>{" "}
          to enable accounts. Without them, StudentOS runs as a single-user local app.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10">
      <SignIn />
    </div>
  );
}