// src/app/api/inventory/[id]/route.ts  (DELETE, PATCH qty)
import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth-helpers";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const d = await db();
  await d.collection("inventory").deleteOne({ _id: new ObjectId(params.id), userId });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const { qty } = await req.json();
  const d = await db();
  await d.collection("inventory")
         .updateOne({ _id: new ObjectId(params.id), userId }, { $set: { qty } });
  return NextResponse.json({ ok: true });
}
