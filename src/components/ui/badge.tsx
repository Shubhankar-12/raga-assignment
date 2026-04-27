import * as React from "react";
import { cn } from "@/lib/utils";
import type { PatientStatus } from "@/types";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-brand-50 text-brand-700 ring-brand-200",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ring-transparent",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusToneMap: Record<PatientStatus, Tone> = {
  stable: "success",
  monitoring: "warning",
  critical: "danger",
  discharged: "neutral",
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge tone={statusToneMap[status]}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status[0].toUpperCase() + status.slice(1)}
    </Badge>
  );
}
