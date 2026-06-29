import { TrendingUp } from "lucide-react";

import type { KPI } from "@/types";
import { SurfaceCard } from "@/components/ui/surface-card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  item: KPI;
}

export function KpiCard({ item }: KpiCardProps) {
  return (
    <SurfaceCard className="rounded-[1.8rem] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-stone-500">{item.title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            {item.value}
          </p>
        </div>
        <div
          className={cn(
            "inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            item.trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-stone-100 text-stone-600",
          )}
        >
          <TrendingUp className={cn("size-3.5", item.trend === "steady" && "rotate-90")} />
          {item.change}
        </div>
      </div>
      <p className="mt-4 text-sm text-stone-500">{item.detail}</p>
    </SurfaceCard>
  );
}
