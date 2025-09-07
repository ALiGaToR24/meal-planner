// src/app/api/recipes/route.ts  (GET все мои, POST создать)
import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";

export async function GET() {
  const userId = await requireUserId();
  const d = await db();
  const recs = await d.collection("recipes").find({ userId }).sort({ title: 1 }).toArray();
  return NextResponse.json(recs);
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  const body = await req.json();
  const d = await db();
  const res = await d.collection("recipes").insertOne({ ...body, userId });
  return NextResponse.json({ _id: res.insertedId });
}
