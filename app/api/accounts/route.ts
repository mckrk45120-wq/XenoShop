import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const db = await readDB();
    return NextResponse.json(
      { accounts: db.accounts },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to read accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await readDB();

    const newAccount = {
      id: uuidv4(),
      number: db.accounts.length > 0 ? Math.max(...db.accounts.map((a) => a.number)) + 1 : 1,
      price: Number(body.price) || 0,
      rank: body.rank || "unranked",
      description: body.description || "",
      imageUrl: body.imageUrl || "",
      sold: false,
      createdAt: new Date().toISOString(),
    };

    db.accounts.push(newAccount);
    await writeDB(db);

    return NextResponse.json({ account: newAccount }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
