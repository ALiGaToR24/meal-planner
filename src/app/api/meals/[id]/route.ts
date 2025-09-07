import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;

  const body = await req.json(); // { time?, type?, recipeId?, servings? }
  const patch: any = { ...body };
  if (body?.recipeId) patch.recipeId = new ObjectId(body.recipeId);

  const dbo = await db();
  await dbo.collection("meals").updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { ...patch, updatedAt: new Date() } }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  const { id } = await params;

  const dbo = await db();
  await dbo.collection("meals").deleteOne({ _id: new ObjectId(id), userId });

  return NextResponse.json({ ok: true });
}
