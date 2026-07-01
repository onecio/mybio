import { BarChart3, ExternalLink, Link2, Palette, Share2, UserRound } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

function formatClicks(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return null;
  }

  const activeLinks = data.links.filter((link) => link.is_active).length;
  const completionItems = [
    {
      label: "Adicionar links principais",
      done: data.links.length > 0,
      href: "/dashboard/links",
    },
    {
      label: "Definir nome e username",
      done: Boolean(data.profile?.title && data.profile?.username),
      href: "/dashboard/profile",
    },
    {
      label: "Conectar ao menos uma rede",
      done: data.socials.length > 0,
      href: "/dashboard/socials",
    },
    {
      label: "Publicar a página",
      done: Boolean(data.profile?.is_published),
      href: "/dashboard/settings",
    },
  ];

  const completedSteps = completionItems.filter((item) => item.done).length;

  return (
    <div className="grid gap-5">
      <DashboardHeader
        title="Visão geral"
        description="Edite sua página com foco no que mais impacta: links, identidade e publicação."
        action={
          <>
            <Button href="/dashboard/share" variant="secondary" className="gap-2">
              <Share2 className="size-4" /> Compartilhar
            </Button>
            {data.publicUrl ? (
              <Button href={data.publicUrl} variant="secondary" className="gap-2">
                <ExternalLink className="size-4" /> Ver página
              </Button>
            ) : null}
          </>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <SurfaceCard className="rounded-[2rem] p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
                  página pública
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                  {data.profile?.title ?? "Seu MyBio"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  {data.publicUrl ?? "Defina o username para gerar a URL pública."}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  data.profile?.is_published
                    ? "bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {data.profile?.is_published ? "Publicado" : "Rascunho"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Links ativos</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {activeLinks}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Redes conectadas</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {data.socials.length}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm text-stone-500">Cliques 30 dias</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {formatClicks(data.analytics?.clicks_last_30_days)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button href="/dashboard/links" className="gap-2">
                <Link2 className="size-4" /> Editar links
              </Button>
              <Button href="/dashboard/profile" variant="secondary" className="gap-2">
                <UserRound className="size-4" /> Ajustar perfil
              </Button>
              <Button href="/dashboard/design" variant="secondary" className="gap-2">
                <Palette className="size-4" /> Alterar visual
              </Button>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2rem] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
            progresso
          </p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                {completedSteps}/4
              </h2>
              <p className="mt-1 text-sm text-stone-500">itens essenciais concluídos</p>
            </div>
            <Button href="/dashboard/settings" variant="secondary">
              Publicação
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {completionItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-[1.2rem] border border-stone-200 bg-stone-50 px-4 py-3 text-sm transition hover:border-[var(--brand-petrol)]"
              >
                <span className="font-medium text-stone-800">{item.label}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.done
                      ? "bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {item.done ? "ok" : "pendente"}
                </span>
              </a>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center gap-3">
            <Link2 className="size-5 text-[var(--brand-petrol)]" />
            <h3 className="text-lg font-semibold text-stone-950">Links primeiro</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            O painel principal agora prioriza o gerenciamento de links. Compartilhamento e ajustes
            secundários ficam fora da navegação primária.
          </p>
        </SurfaceCard>

        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center gap-3">
            <Share2 className="size-5 text-[var(--brand-petrol)]" />
            <h3 className="text-lg font-semibold text-stone-950">Compartilhar sem ruído</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            A rota de compartilhamento continua disponível, mas agora como ação contextual, não como
            etapa concorrente de edição.
          </p>
        </SurfaceCard>

        <SurfaceCard className="rounded-[1.8rem] p-5">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-5 text-[var(--brand-petrol)]" />
            <h3 className="text-lg font-semibold text-stone-950">Leitura operacional</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            O dono vê rapidamente status da página, volume de links e sinais básicos de tração,
            antes de aprofundar em métricas.
          </p>
        </SurfaceCard>
      </section>
    </div>
  );
}
