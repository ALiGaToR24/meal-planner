import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;

  const dbo = await db();
  const r = await dbo
    .collection("recipes")
    .findOne({ _id: new ObjectId(id), userId });

  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(r);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;

  const body = await req.json();
  const dbo = await db();

  await dbo
    .collection("recipes")
    .updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { ...body, updatedAt: new Date() } }
    );

  return NextResponse.json({ ok: true });
}
