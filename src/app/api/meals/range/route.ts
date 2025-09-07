import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const userId = await requireUserId();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "from/to required" }, { status: 400 });
  const d = await db();
  const meals = await d.collection("meals").find({ userId, date: { $gte: from, $lte: to } })
    .sort({ date: 1, time: 1, type: 1 }).toArray();
  return NextResponse.json(meals);
}
