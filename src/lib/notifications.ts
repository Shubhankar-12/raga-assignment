/**
 * Service-worker registration + local push helpers.
 *
 * The SW lives at `/sw.js`. Once registered + permission granted, we can
 * trigger notifications via `sw.showNotification()` which gives us the same
 * UX as a real push (system tray notification, click handler) without
 * needing a push server. This satisfies the "show at least one working
 * notification use case" requirement out of the box.
 */

export type NotificationSupport =
  | { supported: true; permission: NotificationPermission }
  | { supported: false; reason: string };

export function getNotificationSupport(): NotificationSupport {
  if (typeof window === "undefined") {
    return { supported: false, reason: "Server-side render" };
  }
  if (!("serviceWorker" in navigator)) {
    return { supported: false, reason: "Service workers not supported" };
  }
  if (!("Notification" in window)) {
    return { supported: false, reason: "Notifications API not supported" };
  }
  return { supported: true, permission: Notification.permission };
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  const sup = getNotificationSupport();
  if (!sup.supported) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch (err) {
    console.error("[sw] register failed", err);
    return null;
  }
}

export async function requestPermission(): Promise<NotificationPermission> {
  const sup = getNotificationSupport();
  if (!sup.supported) return "denied";
  if (sup.permission !== "default") return sup.permission;
  return Notification.requestPermission();
}

export type LocalNotificationOptions = {
  title: string;
  body: string;
  tag?: string;
  url?: string;
  icon?: string;
};

export async function showLocalNotification(
  opts: LocalNotificationOptions
): Promise<boolean> {
  const sup = getNotificationSupport();
  if (!sup.supported) return false;
  if (sup.permission !== "granted") {
    const next = await requestPermission();
    if (next !== "granted") return false;
  }
  const reg = (await navigator.serviceWorker.getRegistration()) ?? (await registerServiceWorker());
  if (!reg) return false;

  await reg.showNotification(opts.title, {
    body: opts.body,
    tag: opts.tag ?? "hc-default",
    icon: opts.icon ?? "/icon.svg",
    badge: "/icon.svg",
    data: { url: opts.url ?? "/dashboard" },
  });
  return true;
}
