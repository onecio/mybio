import { BarChart3, CalendarClock, GripVertical, ImageIcon } from "lucide-react";

import { createLinkAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LinkManager } from "@/components/dashboard/link-manager";
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

  if (!dashboardData) return null;

  return (
    <div className="grid gap-5 sm:gap-6">
      <DashboardHeader
        title="Links e conteúdo"
        description="Organize sua jornada, programe campanhas e destaque o que merece atenção. Cada alteração atualiza sua página pública."
        action={
          <Button href="/dashboard/insights" variant="secondary" className="gap-2">
            <BarChart3 className="size-4" /> Ver resultados
          </Button>
        }
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid items-start gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <SurfaceCard className="rounded-[1.6rem] p-5 sm:p-6 xl:sticky xl:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-petrol)]">
            novo destino
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--brand-ink)] sm:text-3xl">
            Adicione conteúdo à sua página
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
            Comece pelo essencial. Thumbnail, destaque e agenda são opcionais.
          </p>

          <form action={createLinkAction} className="mt-6 grid gap-4">
            <Field label="Título">
              <TextInput name="title" placeholder="Ex.: Consultoria estratégica" required />
            </Field>
            <Field label="URL">
              <TextInput name="url" type="url" placeholder="https://..." required />
            </Field>
            <Field label="Descrição curta">
              <TextInput name="description" placeholder="Explique o valor deste destino" maxLength={140} />
            </Field>
            <Field label="Thumbnail" hint="Opcional">
              <TextInput name="thumbnailUrl" type="url" placeholder="https://.../imagem.jpg" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <Field label="Publicar em" hint="Opcional">
                <TextInput name="scheduledAt" type="datetime-local" />
              </Field>
              <Field label="Expirar em" hint="Opcional">
                <TextInput name="expiresAt" type="datetime-local" />
              </Field>
            </div>
            <input type="hidden" name="icon" value="link" />
            <label className="flex items-center gap-3 rounded-xl border border-[var(--brand-line)] bg-[#f4f2ec] px-4 py-3 text-sm font-medium text-[var(--brand-ink)]">
              <input type="checkbox" name="featured" className="size-4 accent-[var(--brand-petrol)]" />
              Destacar este conteúdo
            </label>
            <SubmitButton label="Adicionar à página" pendingLabel="Adicionando..." size="lg" />
          </form>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[var(--brand-line)] pt-5 text-center text-[0.68rem] font-semibold text-[var(--brand-muted)]">
            <span className="grid gap-1"><GripVertical className="mx-auto size-4" /> Reordene</span>
            <span className="grid gap-1"><CalendarClock className="mx-auto size-4" /> Agende</span>
            <span className="grid gap-1"><ImageIcon className="mx-auto size-4" /> Enriqueça</span>
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[1.6rem] p-4 sm:p-6">
          {dashboardData.links.length > 0 ? (
            <LinkManager initialLinks={dashboardData.links} />
          ) : (
            <EmptyState
              eyebrow="página pronta para começar"
              title="Adicione seu primeiro destino."
              description="Seus links aparecerão aqui com controles de edição, agenda, destaque e ordenação."
            />
          )}
        </SurfaceCard>
      </div>
    </div>
  );
}
