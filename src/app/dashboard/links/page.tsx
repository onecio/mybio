import { ExternalLink, Plus, Share2 } from "lucide-react";

import { createLinkAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { IconPicker } from "@/components/forms/icon-picker";
import { LinkManager } from "@/components/dashboard/link-manager";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { getDashboardData, toPreviewProfile } from "@/lib/queries/mybio";

export default async function DashboardLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const data = await getDashboardData();
  if (!data) return null;

  return (
    <div className="grid gap-5">
      <DashboardHeader
        title="Links"
        description="Este é o fluxo principal do produto. Organize a ordem, destaque o que converte e publique sem excesso de configuração."
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

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-500">Links totais</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {data.links.length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-500">Ativos</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {data.links.filter((link) => link.is_active).length}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-stone-500">Em destaque</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            {data.links.filter((link) => link.is_featured).length}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0">
          <details className="group mb-4 rounded-2xl border border-stone-200 bg-white shadow-sm" open={data.links.length === 0}>
            <summary className="flex h-14 cursor-pointer list-none items-center justify-center gap-2 px-5 text-sm font-bold text-stone-900">
              <Plus className="size-5" /> Adicionar link
            </summary>
            <form action={createLinkAction} className="grid gap-4 border-t border-stone-200 p-5 sm:grid-cols-2">
              <Field label="Título">
                <TextInput name="title" placeholder="Nome do link" required />
              </Field>
              <Field label="URL">
                <TextInput name="url" type="url" placeholder="https://..." required />
              </Field>
              <Field label="Descrição" hint="Opcional">
                <TextInput name="description" placeholder="Explique o destino" maxLength={140} />
              </Field>
              <Field label="Imagem" hint="Opcional">
                <TextInput name="thumbnailUrl" type="url" placeholder="https://.../imagem.jpg" />
              </Field>
              <div className="sm:col-span-2">
                <IconPicker name="icon" defaultValue="link" />
              </div>
              <details className="sm:col-span-2">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--brand-petrol)]">Opções avançadas</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Publicar em"><TextInput name="scheduledAt" type="datetime-local" /></Field>
                  <Field label="Expirar em"><TextInput name="expiresAt" type="datetime-local" /></Field>
                  <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
                    <input type="checkbox" name="featured" className="size-4 accent-[var(--brand-petrol)]" /> Destacar este link
                  </label>
                </div>
              </details>
              <div className="sm:col-span-2">
                <SubmitButton label="Adicionar" pendingLabel="Adicionando..." />
              </div>
            </form>
          </details>

          {data.links.length > 0 ? (
            <LinkManager initialLinks={data.links} />
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <EmptyState
                eyebrow="sua página está vazia"
                title="Adicione o primeiro link."
                description="Use o botão acima para publicar seu primeiro destino."
              />
            </div>
          )}
        </section>

        <aside className="hidden lg:sticky lg:top-7 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-stone-900">Preview</p>
            <span className="text-xs text-stone-500">Ao vivo</span>
          </div>
          <div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
            <PhoneMockup profile={toPreviewProfile(data)} compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
