import { createSocialAction, deleteSocialAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PlatformSelect } from "@/components/forms/platform-select";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";
import { getPlatformIconOption } from "@/lib/platform-icons";

export default async function DashboardSocialsPage({
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
        title="Redes sociais"
        description="Conecte canais reais ao seu perfil para reforçar distribuição de audiência e prova social."
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="grid gap-4">
            {dashboardData.socials.length > 0 ? (
              dashboardData.socials.map((social) => {
              const Icon = getPlatformIconOption(social.platform).icon;

              return (
                <div
                  key={social.platform}
                  className="flex flex-col gap-3 rounded-[1.7rem] border border-stone-200/70 bg-stone-50/80 p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[1.4rem] bg-white text-stone-900 shadow-[0_18px_30px_-24px_rgba(15,23,42,0.24)]">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold capitalize text-stone-950">{social.platform}</p>
                      <p className="text-sm text-stone-500">{social.handle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <a
                      href={social.url}
                      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700"
                    >
                      abrir
                    </a>
                    <form action={deleteSocialAction}>
                      <input type="hidden" name="socialId" value={social.id} />
                      <SubmitButton
                        label="Remover"
                        pendingLabel="Removendo..."
                        variant="ghost"
                      />
                    </form>
                  </div>
                </div>
              );
              })
            ) : (
              <EmptyState
                eyebrow="nenhuma rede conectada"
                title="Adicione suas redes para ampliar a descoberta."
                description="Instagram, LinkedIn, TikTok e outros canais ajudam a dar contexto e credibilidade à sua página pública."
              />
            )}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            conectar nova rede
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Distribua o tráfego com intenção
          </h2>
          <form action={createSocialAction} className="mt-6 grid gap-4">
            <Field label="Plataforma">
              <PlatformSelect name="platform" />
            </Field>
            <Field label="Handle" hint="Usado apenas para validar e orientar a URL.">
              <TextInput name="handle" placeholder="@seuperfil" required />
            </Field>
            <Field label="URL pública">
              <TextInput name="url" type="url" placeholder="https://..." required />
            </Field>
            <SubmitButton label="Salvar rede" pendingLabel="Salvando..." />
          </form>
        </SurfaceCard>
      </div>
    </div>
  );
}
