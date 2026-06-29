import { ExternalLink, Star } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { mockLinks } from "@/lib/mock-data";

export default function DashboardLinksPage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Gerenciar links"
        description="Priorize seus destinos mais importantes com organização clara, hierarquia visual e leitura rápida."
        actionLabel="Novo link"
      />

      <SurfaceCard className="rounded-[2.2rem] p-6">
        <div className="grid gap-4">
          {mockLinks.map((link) => (
            <div
              key={link.id}
              className="grid gap-4 rounded-[1.7rem] border border-stone-200/70 bg-stone-50/80 p-5 lg:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                    {link.title}
                  </h2>
                  {link.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Star className="size-3.5" />
                      destaque
                    </span>
                  ) : null}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      link.active
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {link.active ? "ativo" : "pausado"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-stone-600">{link.description}</p>
                <p className="mt-2 text-sm text-stone-500">{link.url}</p>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <div className="rounded-[1.4rem] bg-white px-4 py-3 text-right shadow-[0_18px_40px_-30px_rgba(15,23,42,0.3)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-400">cliques</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                    {link.clicks.toLocaleString("pt-BR")}
                  </p>
                </div>
                <Button variant="secondary" className="gap-2">
                  Abrir <ExternalLink className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
