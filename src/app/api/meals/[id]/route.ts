import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const body = await req.json(); // {time?, type?, recipeId?, servings?}
  const dbo = await db();
  await dbo.collection("meals").updateOne(
    { _id: new ObjectId(params.id), userId },
    { $set: { ...body, ...(body.recipeId ? { recipeId:new ObjectId(body.recipeId) } : {}) } }
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();
  const dbo = await db();
  await dbo.collection("meals").deleteOne({ _id: new ObjectId(params.id), userId });
  return NextResponse.json({ ok: true });
}
