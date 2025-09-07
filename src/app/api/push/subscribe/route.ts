import { NextResponse } from "next/server";
import { db } from "@/lib/mongo";

export async function POST(req: Request){
  const sub = await req.json();
  const dbo = await db();
  await dbo.collection("pushSubs").updateOne(
    { endpoint: sub.endpoint },
    { $set: { ...sub, updatedAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ ok:true });
}
