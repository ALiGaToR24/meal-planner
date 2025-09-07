// src/app/api/inventory/route.ts  (GET, POST)
import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { ensureIndexes } from "@/lib/ensure-indexes";

export async function GET() {
  await ensureIndexes();
  const userId = await requireUserId();
  const d = await db();
  const items = await d.collection("inventory").find({ userId }).sort({ name: 1 }).toArray();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await ensureIndexes();
  const userId = await requireUserId();
  const body = await req.json();
  const d = await db();
  const res = await d.collection("inventory").insertOne({ ...body, userId });
  return NextResponse.json({ _id: res.insertedId });
}
