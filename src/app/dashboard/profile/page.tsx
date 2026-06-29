import { saveProfileAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CloudinaryAvatarField } from "@/components/forms/cloudinary-avatar-field";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getAvatarStrategyLabel } from "@/lib/cloudinary";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  const profileName =
    dashboardData.profile?.title ||
    (typeof dashboardData.user.user_metadata?.name === "string"
      ? dashboardData.user.user_metadata.name
      : dashboardData.user.email?.split("@")[0]) ||
    "";

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Editar perfil"
        description="Sincronize seu nome, username, biografia e publicação com os dados reais do Supabase."
        action={
          dashboardData.publicUrl ? (
            <Button href={dashboardData.publicUrl} variant="secondary">
              Visualizar página
            </Button>
          ) : undefined
        }
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="rounded-[2.2rem] p-5 sm:p-6">
          <form action={saveProfileAction} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nome">
                <TextInput name="name" defaultValue={profileName} required />
              </Field>
              <Field label="Username" hint="Será usado na URL pública do seu perfil.">
                <TextInput
                  name="username"
                  defaultValue={dashboardData.profile?.username ?? ""}
                  required
                />
              </Field>
            </div>
            <Field label="Título principal" hint="Equivale ao nome exibido no topo da página pública.">
              <TextInput
                name="headline"
                defaultValue={dashboardData.profile?.title ?? profileName}
                required
              />
            </Field>
            <Field label="Bio" hint="Texto público exibido abaixo do título.">
              <TextArea
                name="bio"
                defaultValue={dashboardData.profile?.description ?? ""}
                required
              />
            </Field>
            <div className="grid gap-2 text-sm text-stone-700">
              <span className="font-semibold tracking-[-0.02em] text-stone-800">Avatar</span>
              <CloudinaryAvatarField initialValue={dashboardData.profile?.avatar_url ?? ""} />
              <span className="text-xs text-stone-500">{getAvatarStrategyLabel()}</span>
            </div>
            <Field
              label="Observação de contexto"
              hint="Este campo não é persistido nesta estrutura base; use-o apenas como lembrete editorial."
            >
              <TextInput name="location" defaultValue="" placeholder="Ex.: Creator focada em educação" />
            </Field>
            <label className="flex items-start gap-3 rounded-[1.4rem] border border-stone-200/70 bg-stone-50/70 px-4 py-3 text-sm leading-6 text-stone-600">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={dashboardData.profile?.is_published ?? true}
                className="mt-1 size-4 rounded border-stone-300"
              />
              Publicar a página imediatamente após salvar.
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SubmitButton label="Salvar ajustes" pendingLabel="Salvando..." />
              {dashboardData.publicUrl ? (
                <Button href={dashboardData.publicUrl} variant="secondary">
                  Ver resultado
                </Button>
              ) : null}
            </div>
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            checklist premium
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Sua base real está pronta para conversão
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "Username e título sincronizados com a página pública.",
              "Bio persistida direto no Supabase para leitura por Server Components.",
              "Avatar com fallback elegante para URL manual quando Cloudinary não estiver ativo.",
              dashboardData.profile?.is_published
                ? "Página pública atualmente publicada."
                : "Página salva como rascunho até a próxima publicação.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm text-stone-600"
              >
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
