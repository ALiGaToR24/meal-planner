// src/app/api/meals/toggle-eaten/route.ts  (POST {mealId, eaten})
import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { requireUserId } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  const userId = await requireUserId();
  const { mealId, eaten } = await req.json();
  const d = await db();
  await d.collection("meals")
         .updateOne({ _id: new ObjectId(mealId), userId }, { $set: { eaten: !!eaten } });
  return NextResponse.json({ ok: true });
}
