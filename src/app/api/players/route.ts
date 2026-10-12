import { NextResponse } from "next/server";
import { sanitizeNames, sendPlayersEmail } from "@/lib/mail";

/** Silently records the players that started a game. */
export async function POST(request: Request) {
  let names: string[] | null = null;
  try {
    const body = await request.json();
    names = sanitizeNames(body?.names);
  } catch {
    names = null;
  }

  if (!names) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await sendPlayersEmail(names);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send players email:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
