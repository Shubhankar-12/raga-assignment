"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function RootPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [initialized, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
      />
    </div>
  );
}
