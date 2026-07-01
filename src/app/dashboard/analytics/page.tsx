import { ArrowUpRight, Eye, Lightbulb, MousePointerClick } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

export default async function DashboardAnalyticsPage() {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  const totalViews = dashboardData.analytics?.total_views ?? 0;
  const totalClicks = dashboardData.analytics?.total_clicks ?? 0;
  const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const topLink = dashboardData.topLinks[0];

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Métricas"
        description="Acompanhe apenas o que ajuda a decidir a próxima ação: audiência, cliques e qual link merece prioridade."
        action={
          <Button href="/dashboard/links" variant="secondary" className="gap-2">
            Otimizar links <ArrowUpRight className="size-4" />
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Visualizações</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                {formatNumber(totalViews)}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]">
              <Eye className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-sm text-stone-500">pessoas que chegaram até sua página</p>
        </SurfaceCard>

        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Cliques</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                {formatNumber(totalClicks)}
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]">
              <MousePointerClick className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-sm text-stone-500">interações geradas pelos seus links</p>
        </SurfaceCard>

        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">Taxa de clique</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                {clickRate.toFixed(1).replace(".", ",")}%
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-sm text-stone-500">quantos visitantes avançam para um destino</p>
        </SurfaceCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                últimos 14 dias
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                Ritmo de cliques
              </h2>
            </div>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600">
              foco em tendência, não em excesso de detalhe
            </span>
          </div>
          <div className="mt-6">
            <MiniBarChart
              values={dashboardData.dailyClicks.map((item) => item.value)}
              labels={dashboardData.dailyClicks.map((item) => item.label)}
            />
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            leitura rápida
          </p>
          {topLink ? (
            <div className="mt-3 grid gap-4">
              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
                <p className="text-sm text-stone-500">Link líder</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {topLink.title}
                </h2>
                <p className="mt-2 text-sm text-stone-500">{topLink.hostname}</p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                  {formatNumber(topLink.clicks)}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-[#f1dfd3] text-[var(--brand-copper)]">
                    <Lightbulb className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-950">Próxima melhor ação</p>
                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {totalViews === 0
                        ? "Compartilhe sua página antes de ajustar detalhes visuais."
                        : totalClicks === 0
                          ? "Reescreva o título do primeiro link para deixá-lo mais direto."
                          : "Mantenha o melhor link no topo e teste um segundo CTA complementar."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              eyebrow="sem dados ainda"
              title="As métricas aparecerão quando a página começar a circular."
              description="Publique e compartilhe a página para começar a registrar visitas e cliques."
              action={<Button href="/dashboard/share" variant="secondary">Abrir compartilhamento</Button>}
            />
          )}
        </SurfaceCard>
      </section>
    </div>
  );
}
