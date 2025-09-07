"use client";
import { useEffect } from "react";

export default function RegisterPush(){
  useEffect(()=> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    (async () => {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) return;

      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;

      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const convertedKey = urlBase64ToUint8Array(vapid);

      const newSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      await fetch("/api/push/subscribe", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(newSub)
      });
    })();
  }, []);
  return null;
}

function urlBase64ToUint8Array(base64String:string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
