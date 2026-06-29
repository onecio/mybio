import { ArrowUpRight, Sparkles } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { MiniBarChart } from "@/components/dashboard/mini-bar-chart";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  activityFeed,
  analyticsSeries,
  audienceHighlights,
  kpis,
  mockProfile,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Visão geral do MyBio"
        description="Acompanhe os principais indicadores da sua página, descubra oportunidades e mantenha a experiência sempre premium."
        actionLabel="Publicar atualizações"
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {kpis.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                analytics de tráfego
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                Crescimento consistente nas últimas 12 janelas
              </h2>
            </div>
            <Button variant="secondary" className="gap-2">
              Exportar relatório <ArrowUpRight className="size-4" />
            </Button>
          </div>
          <div className="mt-6">
            <MiniBarChart values={analyticsSeries} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {audienceHighlights.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600"
              >
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="flex items-center justify-between gap-4">
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
              online
            </div>
          </div>
          <div className="mt-6">
            <PhoneMockup profile={mockProfile} compact />
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="rounded-[2.2rem] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
              atividade recente
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
              O que mudou no seu workspace
            </h2>
          </div>
          <Button href={`/${mockProfile.username}`} variant="secondary">
            Ver página pública
          </Button>
        </div>

        <div className="mt-6 grid gap-4">
          {activityFeed.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.6rem] border border-stone-200/70 bg-stone-50/80 px-5 py-4"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{item.title}</p>
                  <p className="text-sm leading-7 text-stone-600">{item.description}</p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
