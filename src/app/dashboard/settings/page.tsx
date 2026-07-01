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
        description="Gerencie a publicação da página e sua sessão."
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid max-w-4xl gap-5 lg:grid-cols-[1fr_0.72fr]">
        <SurfaceCard className="rounded-2xl p-5 sm:p-6">
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
            <SubmitButton label="Salvar" pendingLabel="Salvando..." />
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-2xl p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">Conta</h2>
          <p className="mt-2 break-all text-sm text-stone-500">{dashboardData.user.email}</p>
          <div className="mt-6 grid gap-3">
            {dashboardData.publicUrl ? (
              <Button href={dashboardData.publicUrl} variant="secondary">
                Abrir página pública
              </Button>
            ) : null}
            <form action={logoutAction}>
              <SubmitButton label="Sair da conta" pendingLabel="Saindo..." variant="ghost" className="w-full" />
            </form>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
