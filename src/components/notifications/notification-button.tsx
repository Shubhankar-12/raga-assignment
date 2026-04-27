"use client";

import { Bell, BellOff, Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getNotificationSupport,
  requestPermission,
  showLocalNotification,
} from "@/lib/notifications";
import { Button } from "@/components/ui/button";

type State = "loading" | "unsupported" | "default" | "granted" | "denied";

export function NotificationButton() {
  const [state, setState] = useState<State>("loading");
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const sup = getNotificationSupport();
    if (!sup.supported) {
      setState("unsupported");
      return;
    }
    setState(sup.permission as State);
  }, []);

  async function handleClick() {
    if (state === "unsupported") return;

    if (state === "default") {
      const next = await requestPermission();
      setState(next as State);
      if (next === "granted") {
        await showLocalNotification({
          title: "Notifications enabled",
          body: "You'll be alerted about critical patient updates here.",
          tag: "hc-welcome",
        });
      }
      return;
    }

    if (state === "granted") {
      setPulsing(true);
      await showLocalNotification({
        title: "Critical patient alert",
        body: "Vikram Joshi (P-1003) — vitals trending below threshold. Open chart.",
        tag: "hc-critical-1003",
        url: "/patients/P-1003",
      });
      setTimeout(() => setPulsing(false), 800);
    }
  }

  if (state === "loading") {
    return (
      <Button size="sm" variant="outline" disabled>
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  if (state === "unsupported") {
    return (
      <Button size="sm" variant="outline" disabled title="Notifications not supported">
        <BellOff className="h-4 w-4" />
      </Button>
    );
  }

  if (state === "denied") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        title="Notifications blocked. Enable them in your browser settings."
      >
        <BellOff className="h-4 w-4" />
        <span className="hidden md:inline">Blocked</span>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant={state === "granted" ? "outline" : "primary"}
      onClick={handleClick}
      title={state === "granted" ? "Send a test notification" : "Enable notifications"}
    >
      {state === "granted" ? (
        <>
          <Bell className={`h-4 w-4 ${pulsing ? "animate-bounce" : ""}`} />
          <span className="hidden md:inline">Test alert</span>
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden md:inline">Enable alerts</span>
        </>
      )}
    </Button>
  );
}
