"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

type Status = "checking" | "unsupported" | "prompt" | "denied" | "enabled";

export function NotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      Boolean(VAPID_PUBLIC_KEY);

    if (!supported) {
      setStatus("unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? "enabled" : "prompt"))
      .catch(() => setStatus("prompt"));
  }, []);

  async function enable() {
    if (!VAPID_PUBLIC_KEY) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });

      setStatus("enabled");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("prompt");
    } finally {
      setBusy(false);
    }
  }

  if (status === "checking" || status === "unsupported") return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-sage-200 bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        {status === "enabled" ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">Meldingen op dit apparaat</p>
        <p className="text-xs text-ink-500">
          {status === "denied"
            ? "Geblokkeerd in je browser. Zet meldingen aan via je browserinstellingen om dit te gebruiken."
            : status === "enabled"
              ? "Je krijgt een melding zodra jou een taak wordt toegewezen."
              : "Ontvang een melding zodra jou een taak wordt toegewezen."}
        </p>
      </div>
      {status !== "denied" && (
        <button
          type="button"
          disabled={busy}
          onClick={status === "enabled" ? disable : enable}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-60 ${
            status === "enabled"
              ? "border border-sage-200 text-ink-700 hover:bg-sage-100"
              : "bg-sage-600 text-white hover:bg-sage-700"
          }`}
        >
          {status === "enabled" ? (
            <>
              <BellOff className="h-3.5 w-3.5" /> Uitzetten
            </>
          ) : busy ? (
            "Bezig..."
          ) : (
            "Inschakelen"
          )}
        </button>
      )}
    </div>
  );
}
