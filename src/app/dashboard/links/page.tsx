import { ExternalLink, Star } from "lucide-react";

import { createLinkAction, deleteLinkAction, toggleLinkAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Gerenciar links"
        description="Cadastre links reais no Supabase, ative ou pause destinos e acompanhe os cliques acumulados."
        action={<Button href="/dashboard/analytics">Ver analytics</Button>}
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            novo link
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Adicione um novo destino
          </h2>
          <form action={createLinkAction} className="mt-6 grid gap-4">
            <Field label="Título">
              <TextInput name="title" placeholder="Ex.: Mentoria estratégica" required />
            </Field>
            <Field label="URL">
              <TextInput name="url" type="url" placeholder="https://..." required />
            </Field>
            <Field label="Descrição curta">
              <TextInput name="description" placeholder="Ex.: Landing principal da oferta" />
            </Field>
            <Field label="Ícone">
              <TextInput name="icon" placeholder="link, star, play" defaultValue="link" />
            </Field>
            <SubmitButton label="Salvar link" pendingLabel="Salvando..." />
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="grid gap-4">
            {dashboardData.links.length > 0 ? (
              dashboardData.links.map((link, index) => (
                <div
                  key={link.id}
                  className="grid gap-4 rounded-[1.7rem] border border-stone-200/70 bg-stone-50/80 p-5 lg:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                        {link.title}
                      </h2>
                      {index === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          <Star className="size-3.5" />
                          destaque
                        </span>
                      ) : null}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          link.is_active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {link.is_active ? "ativo" : "pausado"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-stone-600">{link.hostname}</p>
                    <p className="mt-2 break-all text-sm text-stone-500">{link.url}</p>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="rounded-[1.4rem] bg-white px-4 py-3 text-left shadow-[0_18px_40px_-30px_rgba(15,23,42,0.3)] lg:text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-stone-400">cliques</p>
                      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                        {link.clicks.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button href={link.url} variant="secondary" className="gap-2">
                        Abrir <ExternalLink className="size-4" />
                      </Button>
                      <form action={toggleLinkAction}>
                        <input type="hidden" name="linkId" value={link.id} />
                        <input
                          type="hidden"
                          name="nextValue"
                          value={String(!link.is_active)}
                        />
                        <SubmitButton
                          label={link.is_active ? "Pausar" : "Ativar"}
                          pendingLabel="Atualizando..."
                          variant="secondary"
                        />
                      </form>
                      <form action={deleteLinkAction}>
                        <input type="hidden" name="linkId" value={link.id} />
                        <SubmitButton
                          label="Remover"
                          pendingLabel="Removendo..."
                          variant="ghost"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                eyebrow="sem links ainda"
                title="Seu perfil ainda não tem links publicados."
                description="Cadastre ao menos um destino para começar a registrar cliques reais e exibir a sua vitrine pública."
              />
            )}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
