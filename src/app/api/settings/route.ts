import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";
import { requireUserId } from "@/lib/auth-helpers";
import { DEFAULT_PANTRY_BASICS } from "@/lib/pantry";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await requireUserId();
  const d = await db();

  // ВАЖНО: приводим к any, чтобы TS не ругался на поля
  const s: any = (await d.collection("settings").findOne({ userId })) || {};

  if (s.usePantryBasics == null) s.usePantryBasics = true;
  if (!Array.isArray(s.pantryBasics) || s.pantryBasics.length === 0) {
    s.pantryBasics = DEFAULT_PANTRY_BASICS;
  }
  return NextResponse.json(s);
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  const body = await req.json();
  const d = await db();

  const patch: any = {};
  if ("dailyGoal" in body) patch.dailyGoal = body.dailyGoal;
  if ("notifyBeforeMin" in body) patch.notifyBeforeMin = body.notifyBeforeMin;
  if ("coverageThreshold" in body) patch.coverageThreshold = body.coverageThreshold;

  // базовый набор
  if ("usePantryBasics" in body) patch.usePantryBasics = !!body.usePantryBasics;
  if ("pantryBasics" in body && Array.isArray(body.pantryBasics)) {
    patch.pantryBasics = body.pantryBasics.map((x: any) => String(x).trim()).filter(Boolean);
  }

  await d.collection("settings").updateOne(
    { userId },
    { $set: { ...patch, userId, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  const saved: any = (await d.collection("settings").findOne({ userId })) || {};
  if (saved.usePantryBasics == null) saved.usePantryBasics = true;
  if (!Array.isArray(saved.pantryBasics) || saved.pantryBasics.length === 0) {
    saved.pantryBasics = DEFAULT_PANTRY_BASICS;
  }
  return NextResponse.json(saved);
}
