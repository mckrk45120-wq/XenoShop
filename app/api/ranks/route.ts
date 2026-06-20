import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json({ ranks: db.ranks });
  } catch {
    return NextResponse.json({ error: "Failed to read ranks" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await readDB();
    const idx = db.ranks.findIndex((r) => r.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Rank not found" }, { status: 404 });
    }
    db.ranks[idx] = { ...db.ranks[idx], ...body };
    await writeDB(db);
    return NextResponse.json({ rank: db.ranks[idx] });
  } catch {
    return NextResponse.json({ error: "Failed to update rank" }, { status: 500 });
  }
}
