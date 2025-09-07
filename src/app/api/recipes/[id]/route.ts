import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const dbo = await db();
  const r = await dbo.collection("recipes").findOne({ _id: new ObjectId(params.id), userId });
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(r);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const body = await req.json();
  const dbo = await db();
  await dbo.collection("recipes").updateOne(
    { _id: new ObjectId(params.id), userId },
    { $set: { ...body, updatedAt: new Date() } }
  );
  return NextResponse.json({ ok: true });
}
