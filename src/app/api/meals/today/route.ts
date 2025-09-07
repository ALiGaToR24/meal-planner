// src/app/api/meals/today/route.ts  (GET — на сегодня)
import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { formatISO9075 } from "date-fns";

export async function GET() {
  const userId = await requireUserId();
  const today = new Date();
  const ymd = formatISO9075(today, { representation: "date" }); // YYYY-MM-DD
  const d = await db();
  const meals = await d.collection("meals").find({ userId, date: ymd })
    .sort({ time: 1, type: 1 }).toArray();
  return NextResponse.json(meals);
}
