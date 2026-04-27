"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToggleOption<T extends string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

type ToggleGroupProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: ToggleOption<T>[];
  ariaLabel: string;
  className?: string;
};

export function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex rounded-lg border border-ink-200 bg-white p-0.5 shadow-sm",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-ink-600 hover:bg-ink-50"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
