import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SurfaceCard({
  children,
  className,
  ...props
}: SurfaceCardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.6rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_92%,transparent)] p-6 shadow-[0_22px_70px_-42px_rgba(20,25,26,0.32)] backdrop-blur-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
