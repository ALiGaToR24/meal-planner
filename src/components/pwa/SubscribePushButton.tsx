"use client";
import { useEffect, useState } from "react";

export default function SubscribePushButton() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = "serviceWorker" in navigator && "PushManager" in window;
      setSupported(ok);
      if (!ok) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    })();
  }, []);

  async function subscribe() {
    setBusy(true);
    try {
      if (!("Notification" in window)) { alert("Браузер не поддерживает уведомления"); return; }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string | undefined;
      if (!vapid) { alert("NEXT_PUBLIC_VAPID_PUBLIC_KEY не задан"); return; }

      // ключ -> Uint8Array
      const keyBytes = urlBase64ToUint8Array(vapid);

      // ⬇️ ГЛАВНОЕ: приводим к any, чтобы обойти конфликт типов DOM/TS
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyBytes as any,
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });

      setSubscribed(true);
      alert("Подписка оформлена ✅");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });

      await sub.unsubscribe();
      setSubscribed(false);
      alert("Подписка отменена");
    } finally {
      setBusy(false);
    }
  }

  if (supported === false) {
    return <button className="btn btn-outline-secondary btn-sm" disabled>Уведомления не поддерживаются</button>;
  }

  return subscribed ? (
    <div className="btn-group">
      <button className="btn btn-outline-light btn-sm" disabled>
        <i className="bi bi-bell me-1" /> Подписка активна
      </button>
      <button className="btn btn-outline-danger btn-sm" onClick={unsubscribe} disabled={busy}>
        <i className="bi bi-x-lg" />
      </button>
    </div>
  ) : (
    <button className="btn btn-brand btn-sm" onClick={subscribe} disabled={busy}>
      <i className="bi bi-bell me-1" /> Подписаться на уведомления
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
