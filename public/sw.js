/* Carevia service worker
 * - Handles install/activate lifecycle
 * - Listens for `push` events (server-driven web push)
 * - Listens for `notificationclick` to focus or open the relevant URL
 * - Local notifications can also be shown via `registration.showNotification()`
 *   from the app — this works without any push backend.
 */

const CACHE_NAME = "carevia-shell-v1";

self.addEventListener("install", (event) => {
  // Activate this SW as soon as it finishes installing
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  // Take control of all open clients immediately
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("push", (event) => {
  let payload = { title: "Carevia", body: "You have a new alert.", url: "/dashboard" };
  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon.svg",
      badge: "/icon.svg",
      tag: payload.tag || "carevia-push",
      data: { url: payload.url || "/dashboard" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/dashboard";
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of all) {
        try {
          const u = new URL(client.url);
          if (u.pathname === url) return client.focus();
        } catch {}
      }
      return self.clients.openWindow(url);
    })()
  );
});
