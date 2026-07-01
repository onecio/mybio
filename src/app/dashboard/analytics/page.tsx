import { ArrowUpRight, Eye, Lightbulb, MousePointerClick, Percent } from "lucide-react";

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

  const totalViews = dashboardData.analytics?.total_views ?? 0;
  const totalClicks = dashboardData.analytics?.total_clicks ?? 0;
  const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const summary = [
    { label: "Visualizações", value: totalViews.toLocaleString("pt-BR"), detail: "visitantes únicos por dia", icon: Eye },
    { label: "Cliques", value: totalClicks.toLocaleString("pt-BR"), detail: "interações acumuladas", icon: MousePointerClick },
    { label: "Taxa de clique", value: `${clickRate.toFixed(1).replace(".", ",")}%`, detail: "cliques por visualização", icon: Percent },
    { label: "Links ativos", value: String(dashboardData.links.filter((link) => link.is_active).length), detail: "destinos publicados", icon: ArrowUpRight },
  ];

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Insights"
        description="Entenda a atividade da sua página, descubra quais conteúdos atraem atenção e decida o próximo ajuste com dados reais."
        action={
          dashboardData.publicUrl ? (
            <Button href={dashboardData.publicUrl} variant="secondary" className="gap-2">
              Abrir página pública <ArrowUpRight className="size-4" />
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <SurfaceCard key={item.label} className="rounded-[1.7rem] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-stone-950">{item.value}</p>
                  <p className="mt-1 text-sm text-stone-500">{item.detail}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]">
                  <Icon className="size-4" />
                </span>
              </div>
            </SurfaceCard>
          );
        })}
      </div>

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
                title="Seus insights aparecerão assim que os links começarem a receber visitas."
                description="Publique pelo menos um link na página pública para começar a registrar cliques."
              />
            )}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="rounded-[2rem] p-6">
        <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="grid size-12 place-items-center rounded-[1rem] bg-[#f1dfd3] text-[var(--brand-copper)]">
            <Lightbulb className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">próxima melhor ação</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-stone-950">
              {totalViews === 0
                ? "Compartilhe seu QR Code para iniciar a coleta de audiência."
                : totalClicks === 0
                  ? "Teste um título mais direto no primeiro link para gerar o clique inicial."
                  : "Destaque o link com mais cliques e mantenha a oferta principal no topo."}
            </h2>
          </div>
          <Button href={totalViews === 0 ? "/dashboard/share" : "/dashboard/links"} variant="secondary">
            {totalViews === 0 ? "Abrir compartilhamento" : "Otimizar links"}
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
