import type { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-[-0.04em] text-stone-950 sm:text-[2rem]">
          {title}
        </h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-stone-500">{description}</p>
      </div>

      {action ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}
