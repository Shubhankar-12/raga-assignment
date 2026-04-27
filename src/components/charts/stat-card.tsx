import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  accent?: "brand" | "emerald" | "amber" | "red" | "indigo";
};

const accentClasses: Record<NonNullable<Props["accent"]>, string> = {
  brand: "bg-brand-50 text-brand-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export function StatCard({ label, value, delta, icon, accent = "brand" }: Props) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-ink-900">{value}</div>
        </div>
        {icon ? (
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl",
              accentClasses[accent]
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      {delta ? (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-medium",
            delta.positive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {delta.positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          {delta.value}
          <span className="font-normal text-ink-500">vs. last week</span>
        </div>
      ) : null}
    </div>
  );
}
