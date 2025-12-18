export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/db/supabase.server";
import DeleteCharacterButton from "@/features/characters/components/DeleteCharacterButton";
import { getCharacterById } from "@/features/characters";

type Params = { id: string };

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const supabase = supabaseServer();

  const { data: character, error } = await supabase
    .from("characters")
    .select("id,name,base_prompt,negative_prompt,created_at")
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .single();

  if (error || !character) {
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-600">Character not found.</p>
        <Link className="underline" href="/dashboard/characters">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{character.name}</h1>
          <p className="mt-1 text-sm opacity-60">
            {new Date(character.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DeleteCharacterButton id={character.id} />
          <Link className="underline" href="/dashboard/characters">
            Back
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <section className="border rounded p-4">
          <h2 className="font-semibold">Base prompt (fixed)</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm opacity-90">
            {character.base_prompt}
          </pre>
        </section>

        <section className="border rounded p-4">
          <h2 className="font-semibold">Negative prompt (fixed)</h2>
          <pre className="mt-2 whitespace-pre-wrap text-sm opacity-90">
            {character.negative_prompt}
          </pre>
        </section>
      </div>
    </div>
  );
}
