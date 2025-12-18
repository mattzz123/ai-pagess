import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createCharacter } from "@/features/characters";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

    const name = String(body?.name ?? "").trim();
    const base_prompt = String(body?.base_prompt ?? "").trim();
    const negative_prompt = String(body?.negative_prompt ?? "").trim();

    if (!name || !base_prompt || !negative_prompt) {
      return NextResponse.json(
        { error: "Missing fields: name, base_prompt, negative_prompt" },
        { status: 400 }
      );
    }

    const character = await createCharacter({
      userId,
      name,
      base_prompt,
      negative_prompt,
    });

    return NextResponse.json({ character }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
