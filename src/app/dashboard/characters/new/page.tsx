"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCharacterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [basePrompt, setBasePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        base_prompt: basePrompt,
        negative_prompt: negativePrompt,
      }),
    });

   const text = await res.text();
   let data: any = null;
   try {
   data = text ? JSON.parse(text) : null;
   } catch {
   data = null;
   }


    if (!res.ok) {
      setError((data && data.error) || text || "Something went wrong");
      setLoading(false);
      return;
    }
    router.refresh();
    router.push("/dashboard/characters");
  }

  return (
    <div className="min-h-screen p-8 max-w-xl">
      <h1 className="text-2xl font-bold">New Character</h1>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full border p-2 rounded"
          placeholder="Character name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Base prompt (fixed)"
          rows={4}
          value={basePrompt}
          onChange={(e) => setBasePrompt(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Negative prompt (fixed)"
          rows={4}
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Character"}
        </button>
      </form>
    </div>
  );
}
