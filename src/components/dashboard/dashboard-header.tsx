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
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          painel premium
        </p>
        <h1 className="mt-2 font-display text-3xl leading-none tracking-[-0.045em] text-stone-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">{description}</p>
      </div>

      {action ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}
