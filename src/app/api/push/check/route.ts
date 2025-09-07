import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/mongo";
import { addMinutes, isAfter, isBefore } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  // 1) Безопасно инициализируем VAPID на запросе (а не на уровне модуля)
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    return NextResponse.json(
      { ok: false, error: "VAPID keys are missing" },
      { status: 500 }
    );
  }
  try {
    webpush.setVapidDetails("mailto:you@example.com", pub, priv);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid VAPID keys" },
      { status: 500 }
    );
  }

  // 2) Собираем данные
  const d = await db();
  const subs = await d.collection("pushSubs").find().toArray();

  const now = new Date();
  const ymd = now.toISOString().slice(0, 10);
  const meals = await d.collection("meals").find({ date: ymd }).toArray();
  // NOTE: если хочешь — подгружай настройки по userId (уведомление за N минут и т.п.)

  // 3) Решаем, кому слать
  const toNotify: Array<{ userId: string; title: string; body: string }> = [];

  for (const m of meals) {
    if (m.eaten) continue;
    if (!m.time) continue;
    const [hh, mm] = String(m.time).split(":").map((x: string) => +x);
    const mealTime = new Date(now);
    mealTime.setHours(hh || 0, mm || 0, 0, 0);

    // окно «за 20 минут» — узкая минутная форточка, чтобы не дублировать
    const windowStart = addMinutes(mealTime, -21);
    const windowEnd = addMinutes(mealTime, -20);
    const overdue = addMinutes(mealTime, 30);

    if (isAfter(now, windowStart) && isBefore(now, windowEnd)) {
      toNotify.push({
        userId: m.userId,
        title: "Скоро приём пищи",
        body: `Через 20 минут: ${m.type}`,
      });
    } else if (isAfter(now, overdue)) {
      toNotify.push({
        userId: m.userId,
        title: "Не забывай поесть",
        body: `${m.type} уже был. Отметь, если поел.`,
      });
    }
  }

  // 4) Рассылаем (чистим мёртвые подписки)
  let sent = 0,
    removed = 0,
    errors = 0;

  for (const n of toNotify) {
    const userSubs = subs.filter(
      (s: any) => s.userId === n.userId || true /* если не хранишь userId — шлём всем */
    );
    for (const s of userSubs) {
      try {
        await webpush.sendNotification(
          s as any,
          JSON.stringify({ title: n.title, body: n.body })
        );
        sent++;
      } catch (err: any) {
        errors++;
        // 410/404 — подписка умерла -> удаляем
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await d.collection("pushSubs").deleteOne({ endpoint: s.endpoint });
          removed++;
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: meals.length,
    toNotify: toNotify.length,
    sent,
    removed,
    errors,
  });
}
