import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leadingIcon, id, ...rest }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leadingIcon ? (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
              {leadingIcon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 shadow-sm",
              "placeholder:text-ink-400",
              "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
              "disabled:cursor-not-allowed disabled:bg-ink-50",
              leadingIcon && "pl-9",
              error && "border-red-400 focus:border-red-500 focus:ring-red-200",
              className
            )}
            {...rest}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...rest }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={selectId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        ) : null}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 shadow-sm",
            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200",
            className
          )}
          {...rest}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";
