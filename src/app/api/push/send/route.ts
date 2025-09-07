import { NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/mongo";

webpush.setVapidDetails("mailto:you@example.com", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function POST(req: Request) {
  const { title, body } = await req.json();
  const dbo = await db();
  const subs = await dbo.collection("pushSubs").find().toArray();

  await Promise.allSettled(subs.map(sub =>
    webpush.sendNotification(sub as any, JSON.stringify({ title, body })).catch(()=>{})
  ));

  return NextResponse.json({ ok:true, sent: subs.length });
}
