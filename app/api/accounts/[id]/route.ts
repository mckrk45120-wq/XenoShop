import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDB();
    const account = db.accounts.find((a) => a.id === id);
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json({ account });
  } catch {
    return NextResponse.json({ error: "Failed to read account" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = await readDB();
    const idx = db.accounts.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    db.accounts[idx] = {
      ...db.accounts[idx],
      price: body.price !== undefined ? Number(body.price) : db.accounts[idx].price,
      rank: body.rank !== undefined ? body.rank : db.accounts[idx].rank,
      description: body.description !== undefined ? body.description : db.accounts[idx].description,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : db.accounts[idx].imageUrl,
      sold: body.sold !== undefined ? Boolean(body.sold) : db.accounts[idx].sold,
    };
    await writeDB(db);
    return NextResponse.json({ account: db.accounts[idx] });
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await readDB();
    const idx = db.accounts.findIndex((a) => a.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    db.accounts.splice(idx, 1);
    await writeDB(db);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
