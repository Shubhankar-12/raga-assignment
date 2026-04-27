"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (initialized && !user) router.replace("/login");
  }, [initialized, user, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span
          aria-hidden
          className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        />
        <span className="sr-only">Loading session…</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
