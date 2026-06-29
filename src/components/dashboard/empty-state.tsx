import type { ReactNode } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";

interface EmptyStateProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <SurfaceCard className="rounded-[2rem] p-6 md:p-8">
      <div className="grid gap-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          {eyebrow}
        </p>
        <div className="grid gap-2">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-stone-950">{title}</h2>
          <p className="max-w-2xl text-sm leading-7 text-stone-600">{description}</p>
        </div>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </SurfaceCard>
  );
}
