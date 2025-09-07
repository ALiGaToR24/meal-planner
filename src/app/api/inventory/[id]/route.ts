import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;

  const d = await db();
  await d.collection("inventory").deleteOne({ _id: new ObjectId(id), userId });

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;
  const body = await req.json();

  const d = await db();
  await d
    .collection("inventory")
    .updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { ...body, updatedAt: new Date() } }
    );

  return NextResponse.json({ ok: true });
}
