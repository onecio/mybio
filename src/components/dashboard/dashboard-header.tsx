import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
}

export function DashboardHeader({
  title,
  description,
  actionLabel = "Salvar alterações",
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          painel premium
        </p>
        <h1 className="mt-2 font-display text-4xl leading-none tracking-[-0.045em] text-stone-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-stone-200/70 bg-stone-50/90 px-4 py-3 text-sm text-stone-500">
          <Search className="size-4" />
          Buscar atalho ou página
        </div>
        <button
          type="button"
          aria-label="Notificações"
          className="flex size-12 items-center justify-center rounded-full border border-stone-200/70 bg-white text-stone-700"
        >
          <Bell className="size-4" />
        </button>
        <Button>{actionLabel}</Button>
      </div>
    </div>
  );
}
