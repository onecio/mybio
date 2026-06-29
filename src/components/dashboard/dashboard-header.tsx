import type { ReactNode } from "react";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  action?: ReactNode;
}

export function DashboardHeader({
  title,
  description,
  actionLabel = "Salvar alterações",
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

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <div className="flex w-full items-center gap-2 rounded-full border border-stone-200/70 bg-stone-50/90 px-4 py-3 text-sm text-stone-500 sm:w-auto">
          <Search className="size-4" />
          <span className="truncate">Buscar atalho ou página</span>
        </div>
        <button
          type="button"
          aria-label="Notificações"
          className="flex size-12 items-center justify-center rounded-full border border-stone-200/70 bg-white text-stone-700"
        >
          <Bell className="size-4" />
        </button>
        {action ?? <Button>{actionLabel}</Button>}
      </div>
    </div>
  );
}
