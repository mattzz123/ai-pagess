import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">AI Page ✅</h1>

      <SignedOut>
        <div className="flex gap-3">
          <Link className="px-4 py-2 rounded bg-black text-white" href="/sign-in">
            Sign in
          </Link>
          <Link className="px-4 py-2 rounded border" href="/sign-up">
            Sign up
          </Link>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <Link className="px-4 py-2 rounded bg-black text-white" href="/dashboard">
            Go to Dashboard
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}
