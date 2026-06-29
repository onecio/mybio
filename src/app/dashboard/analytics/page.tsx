import { ArrowUpRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { analyticsSeries, mockLinks } from "@/lib/mock-data";

export default function DashboardAnalyticsPage() {
  const topLinks = [...mockLinks].sort((a, b) => b.clicks - a.clicks).slice(0, 3);

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Analytics"
        description="Entenda comportamento, distribuição de cliques e horários de maior atenção para ajustar sua estratégia."
        actionLabel="Exportar CSV"
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                desempenho mensal
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                Evolução de visitas e cliques
              </h2>
            </div>
            <Button variant="secondary" className="gap-2">
              Abrir relatório <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="mt-6">
            <MiniBarChart values={analyticsSeries} />
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            top links
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Conteúdos com maior tração
          </h2>
          <div className="mt-6 grid gap-4">
            {topLinks.map((link, index) => (
              <div
                key={link.id}
                className="rounded-[1.6rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                      #{index + 1}
                    </p>
                    <p className="mt-1 font-semibold text-stone-950">{link.title}</p>
                    <p className="text-sm text-stone-500">{link.description}</p>
                  </div>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                    {link.clicks.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
