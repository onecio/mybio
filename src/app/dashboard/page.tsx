import { ArrowUpRight, Sparkles } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { StatusMessage } from "@/components/forms/status-message";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData, toPreviewProfile } from "@/lib/queries/mybio";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  const previewProfile = toPreviewProfile(dashboardData);
  const totalViews = dashboardData.analytics?.total_views ?? 0;
  const totalClicks = dashboardData.analytics?.total_clicks ?? 0;
  const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const kpis = [
    {
      title: "Visualizações",
      value: String(totalViews),
      change: `${dashboardData.analytics?.views_last_7_days ?? 0} na última semana`,
      trend: "up" as const,
      detail: "Visitantes únicos por dia",
    },
    {
      title: "Cliques",
      value: String(totalClicks),
      change: `${dashboardData.analytics?.clicks_last_7_days ?? 0} na última semana`,
      trend: "steady" as const,
      detail: "Interações registradas",
    },
    {
      title: "Taxa de clique",
      value: `${clickRate.toFixed(1).replace(".", ",")}%`,
      change: `${dashboardData.links.length} links configurados`,
      trend: "steady" as const,
      detail: "Cliques por visualização",
    },
  ];

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Visão geral do MyBio"
        description="Acompanhe os dados reais da sua página, refine sua vitrine pública e monitore a tração dos principais links."
        action={
          dashboardData.publicUrl ? (
            <Button href={dashboardData.publicUrl} variant="secondary" className="gap-2">
              Ver página pública <ArrowUpRight className="size-4" />
            </Button>
          ) : undefined
        }
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="overflow-hidden rounded-[2.2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                analytics de tráfego
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                Cliques reais dos últimos 14 dias
              </h2>
            </div>
            <Button href="/dashboard/insights" variant="secondary" className="w-full gap-2 sm:w-auto">
              Abrir insights <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="mt-6">
            <MiniBarChart
              values={dashboardData.dailyClicks.map((item) => item.value)}
              labels={dashboardData.dailyClicks.map((item) => item.label)}
            />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.analytics?.clicks_last_30_days ?? 0} cliques nos últimos 30 dias.
            </div>
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.links.filter((item) => item.is_active).length} links ativos prontos para conversão.
            </div>
            <div className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600">
              {dashboardData.isCloudinaryUploadEnabled
                ? "Cloudinary pronto para upload direto de avatar."
                : "Cloudinary opcional: avatar por URL manual ativo."}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                preview em destaque
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                Sua página pública
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <Sparkles className="size-3.5" />
              {dashboardData.profile?.is_published ? "publicada" : "rascunho"}
            </div>
          </div>
          <div className="mt-6">
            <PhoneMockup profile={previewProfile} compact />
          </div>
        </SurfaceCard>
      </div>

      {dashboardData.topLinks.length > 0 ? (
        <SurfaceCard className="rounded-[2.2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                links com melhor desempenho
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                O que mais está recebendo atenção
              </h2>
            </div>
            <Button href="/dashboard/links" variant="secondary" className="w-full sm:w-auto">
              Gerenciar links
            </Button>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboardData.topLinks.map((link) => (
              <div
                key={link.id}
                className="grid gap-3 rounded-[1.6rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-stone-900">{link.title}</p>
                  <p className="break-all text-sm leading-7 text-stone-600">{link.hostname}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    cliques
                  </p>
                  <p className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                    {link.clicks.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      ) : (
        <EmptyState
          eyebrow="comece pelo essencial"
          title="Seu dashboard está pronto para receber os primeiros links."
          description="Adicione links e redes sociais para começar a registrar cliques reais no Supabase."
          action={<Button href="/dashboard/links">Adicionar primeiro link</Button>}
        />
      )}
    </div>
  );
}
