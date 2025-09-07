import { NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/mongo";
import { startOfDay, endOfDay, isAfter, addMinutes } from "date-fns";

webpush.setVapidDetails("mailto:you@example.com", process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function GET() {
  const d = await db();
  const subs = await d.collection("pushSubs").find().toArray();

  const now = new Date();
  const ymd = now.toISOString().slice(0,10);
  const meals = await d.collection("meals").find({ date: ymd }).toArray();
  const settings = await d.collection("settings").find().toArray(); // в идеале по userId

  const toNotify:any[] = [];
  for (const m of meals) {
    if (m.eaten) continue;
    if (!m.time) continue;
    const [hh,mm] = m.time.split(":").map((x:string)=>+x);
    const mealTime = new Date(now); mealTime.setHours(hh,mm,0,0);

    // пример: напоминать за 20 мин до приёма, и ещё если прошло 30 мин и не съедено
    if (isAfter(addMinutes(mealTime,-20), now) && isAfter(now, addMinutes(mealTime,-21))) {
      toNotify.push({ userId:m.userId, title:"Скоро приём пищи", body:`Через 20 минут: ${m.type}` });
    } else if (isAfter(now, addMinutes(mealTime,30))) {
      toNotify.push({ userId:m.userId, title:"Не забывай поесть", body:`${m.type} уже был. Отметь, если поел.` });
    }
  }

  const sent = [];
  for (const n of toNotify) {
    const userSubs = subs.filter(s => s.userId===n.userId || true); // если не сохраняешь userId у подписки, шлём всем твоим устройствам
    for (const s of userSubs) {
      try { await webpush.sendNotification(s as any, JSON.stringify({ title:n.title, body:n.body })); sent.push(1); }
      catch {}
    }
  }
  return NextResponse.json({ ok:true, notifications: sent.length });
}
