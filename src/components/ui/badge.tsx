import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
