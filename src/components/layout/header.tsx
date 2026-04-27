"use client";

import { LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { NotificationButton } from "@/components/notifications/notification-button";
import { useRouter } from "next/navigation";

export function Header({ title }: { title: string }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-ink-200 bg-white/80 p-4  backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-1.5 text-ink-600 hover:bg-ink-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-ink-900 lg:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationButton />
        {user ? (
          <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-3 shadow-sm">
            <Avatar
              src={user.photoURL}
              name={user.displayName ?? user.email ?? "User"}
              size={28}
            />
            <div className="hidden text-xs leading-tight sm:block">
              <div className="font-medium text-ink-800">
                {user.displayName ?? user.email?.split("@")[0]}
              </div>
              <div className="text-ink-500">{user.email}</div>
            </div>
          </div>
        ) : null}
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
