import { Check } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { themePresets } from "@/lib/mock-data";

export default function DashboardThemesPage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Temas e identidade"
        description="Escolha a paleta que melhor traduz sua marca e mantenha coerência visual em todo o perfil."
        actionLabel="Aplicar tema"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {themePresets.map((theme) => (
          <SurfaceCard key={theme.id} className="rounded-[2.2rem] p-5">
            <div
              className="h-36 rounded-[1.7rem] border border-white/70"
              style={{ background: theme.accent }}
            />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {theme.name}
                </h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{theme.description}</p>
              </div>
              {theme.selected ? (
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-stone-950 text-white">
                  <Check className="size-4" />
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.surface }}
                />
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.text }}
                />
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.ring }}
                />
              </div>
              <Button variant={theme.selected ? "primary" : "secondary"}>
                {theme.selected ? "Ativo" : "Selecionar"}
              </Button>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
