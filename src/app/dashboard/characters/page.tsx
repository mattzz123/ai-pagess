import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/db/supabase.server";

type Character = {
  id: string;
  name: string;
  created_at: string;
};

export default async function CharactersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = supabaseServer();

  const { data: characters, error } = await supabase
    .from("characters")
    .select("id,name,created_at")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Characters</h1>
        <p className="mt-4 text-red-600">Error: {error.message}</p>
        <div className="mt-6">
          <Link
            href="/dashboard/characters/new"
            className="px-4 py-2 rounded bg-black text-white"
          >
            + New Character
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Characters</h1>
        <Link
          href="/dashboard/characters/new"
          className="px-4 py-2 rounded bg-black text-white"
        >
          + New Character
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {!characters || characters.length === 0 ? (
          <p className="opacity-70">No characters yet.</p>
        ) : (
          characters.map((c: Character) => (
            <Link
              key={c.id}
              href={`/dashboard/characters/${c.id}`}
              className="block border rounded p-4 hover:bg-gray-50"
            >
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm opacity-60">
                {new Date(c.created_at).toLocaleString()}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
