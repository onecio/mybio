import { logoutAction } from "@/actions/auth";
import { saveSettingsAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardSettingsPage({
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
        title="Configurações"
        description="Gerencie publicação, estado das integrações e dados essenciais da sua conta conectada ao Supabase."
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <form action={saveSettingsAction} className="grid gap-5">
            <Field label="E-mail da conta">
              <TextInput defaultValue={dashboardData.user.email ?? ""} disabled />
            </Field>
            <Field label="URL pública">
              <TextInput defaultValue={dashboardData.publicUrl ?? "Aguardando username"} disabled />
            </Field>
            <label className="flex items-start gap-3 rounded-[1.4rem] border border-stone-200/70 bg-stone-50/70 px-4 py-3 text-sm leading-6 text-stone-600">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={dashboardData.profile?.is_published ?? true}
                className="mt-1 size-4 rounded border-stone-300"
              />
              Manter a página pública visível para visitantes anônimos.
            </label>
            <Field label="Estratégia de avatar">
              <TextInput
                defaultValue={
                  dashboardData.isCloudinaryUploadEnabled
                    ? "Upload direto de avatar ativo via Cloudinary."
                    : "Cloudinary opcional ainda indisponível. URL manual segue ativa."
                }
                disabled
              />
            </Field>
            <SubmitButton label="Salvar configuração" pendingLabel="Salvando..." />
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            ambiente conectado
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Estado das integrações
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "Supabase configurado para autenticação, dashboard e página pública.",
              dashboardData.isCloudinaryUploadEnabled
                ? "Cloudinary pronto para upload direto de avatar com fallback manual."
                : "Cloudinary segue opcional; o app continua funcionando com URL manual de avatar.",
              `${dashboardData.links.length} links e ${dashboardData.socials.length} redes sincronizados.`,
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm leading-7 text-stone-600"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {dashboardData.publicUrl ? (
              <Button href={dashboardData.publicUrl} variant="secondary">
                Abrir página pública
              </Button>
            ) : null}
            <form action={logoutAction}>
              <SubmitButton label="Sair da conta" pendingLabel="Saindo..." variant="ghost" />
            </form>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
