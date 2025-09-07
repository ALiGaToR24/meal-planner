import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/lib/mongo";

export const dynamic = "force-dynamic"; // чтобы не пререндерили/не вызывали на билде

function getVapid() {
  const pub = (process.env.VAPID_PUBLIC_KEY || "").trim();
  const priv = (process.env.VAPID_PRIVATE_KEY || "").trim();
  if (!pub || !priv) throw new Error("VAPID keys are missing");
  return { pub, priv };
}

export async function POST(req: NextRequest) {
  // payload вида { title, body, userId? }
  const payload = await req.json().catch(() => ({}));
  const title = payload?.title ?? "Уведомление";
  const body = payload?.body ?? "";
  const forUser = payload?.userId ?? null;

  // Настраиваем web-push безопасно, внутри хендлера
  try {
    const { pub, priv } = getVapid();
    webpush.setVapidDetails("mailto:you@example.com", pub, priv);
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid VAPID keys" },
      { status: 500 }
    );
  }

  const dbo = await db();
  const subs = await dbo.collection("pushSubs").find().toArray();

  let sent = 0, removed = 0, errors = 0;
  for (const s of subs) {
    if (forUser && s.userId !== forUser) continue;
    try {
      await webpush.sendNotification(
        s as any,
        JSON.stringify({ title, body })
      );
      sent++;
    } catch (err: any) {
      errors++;
      // почистим “мертвые” подписки
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        await dbo.collection("pushSubs").deleteOne({ endpoint: (s as any).endpoint });
        removed++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent, removed, errors });
}
