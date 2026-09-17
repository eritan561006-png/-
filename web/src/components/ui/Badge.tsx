import type { ReactNode } from "react";
import clsx from "clsx";

const tones = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  gold: "bg-gold-50 text-gold-700 dark:bg-gold-700/20 dark:text-gold-200",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  danger: "bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
