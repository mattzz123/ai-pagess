import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteCharacter } from "@/features/characters";

type Params = { id: string };

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await deleteCharacter({ userId, id });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
