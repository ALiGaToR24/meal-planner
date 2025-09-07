import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const userId = await requireUserId();
  const body = await req.json(); // {date, type, time, recipeId, servings}
  const d = await db();
  const res = await d.collection("meals").insertOne({
    ...body,
    userId,
    recipeId: new ObjectId(body.recipeId),
    eaten: false,
  });
  return NextResponse.json({ _id: res.insertedId });
}

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const d = await db();
  await d.collection("meals").deleteOne({ _id: new ObjectId(id), userId });
  return NextResponse.json({ ok: true });
}
