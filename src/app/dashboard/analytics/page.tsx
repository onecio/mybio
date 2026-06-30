import { ArrowUpRight } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardAnalyticsPage() {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Analytics"
        description="Visualize métricas reais registradas no Supabase para entender distribuição de cliques e desempenho dos links."
        action={
          dashboardData.publicUrl ? (
            <Button href={dashboardData.publicUrl} variant="secondary" className="gap-2">
              Abrir página pública <ArrowUpRight className="size-4" />
            </Button>
          ) : undefined
        }
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
            <div className="rounded-full border border-stone-200/70 bg-stone-50 px-4 py-2 text-sm text-stone-600">
              14 dias monitorados
            </div>
          </div>
          <div className="mt-6">
            <MiniBarChart
              values={dashboardData.dailyClicks.map((item) => item.value)}
              labels={dashboardData.dailyClicks.map((item) => item.label)}
            />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.analytics?.total_views ?? 0} visualizações únicas registradas.
            </div>
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.analytics?.total_clicks ?? 0} cliques totais.
            </div>
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.analytics?.views_last_7_days ?? 0} visualizações na última semana.
            </div>
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
            {dashboardData.topLinks.length > 0 ? (
              dashboardData.topLinks.map((link, index) => (
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
                      <p className="text-sm text-stone-500">{link.hostname}</p>
                    </div>
                    <p className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                      {link.clicks.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                eyebrow="sem dados ainda"
                title="Os analytics aparecerão assim que seus links começarem a receber visitas."
                description="Publique pelo menos um link na página pública para começar a registrar cliques."
              />
            )}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
