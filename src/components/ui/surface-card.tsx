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
        "rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.25)] backdrop-blur-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
