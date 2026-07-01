import { ExternalLink, Palette, Share2 } from "lucide-react";

import { saveProfileAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SocialManagerPanel } from "@/components/dashboard/social-manager-panel";
import { CloudinaryAvatarField } from "@/components/forms/cloudinary-avatar-field";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const data = await getDashboardData();
  if (!data) return null;

  const accountName =
    (typeof data.user.user_metadata?.name === "string" ? data.user.user_metadata.name : "") ||
    data.user.email?.split("@")[0] ||
    "Meu MyBio";

  return (
    <div className="grid gap-5">
      <DashboardHeader
        title="Perfil"
        description="Ajuste identidade, username e publicação. Redes sociais ficam como complemento, não como fluxo principal."
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

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,760px)_320px]">
        <form action={saveProfileAction} className="grid gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
          <input type="hidden" name="name" value={accountName} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nome exibido">
              <TextInput name="headline" defaultValue={data.profile?.title ?? accountName} required />
            </Field>
            <Field label="Username" hint="mybio.ecomnix.com.br/username">
              <TextInput name="username" defaultValue={data.profile?.username ?? ""} required />
            </Field>
          </div>
          <Field label="Bio">
            <TextArea name="bio" defaultValue={data.profile?.description ?? ""} required />
          </Field>
          <div className="grid gap-2 text-sm text-stone-700">
            <span className="font-semibold">Foto de perfil</span>
            <CloudinaryAvatarField
              initialValue={data.profile?.avatar_url ?? ""}
              fallbackLabel={data.profile?.title ?? accountName}
            />
          </div>
          <label className="flex items-center gap-3 rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700">
            <input type="checkbox" name="isPublished" defaultChecked={data.profile?.is_published ?? true} className="size-4 accent-[var(--brand-petrol)]" />
            Página pública ativa
          </label>
          <div><SubmitButton label="Salvar perfil" pendingLabel="Salvando..." /></div>
        </form>

        <aside className="grid gap-3">
          <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-stone-500">Redes conectadas</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
              {data.socials.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Use apenas os canais que realmente ajudam o visitante a agir.
            </p>
          </div>
          <Button href="/dashboard/design" variant="secondary" className="h-14 justify-start gap-3 rounded-xl bg-white px-4">
            <Palette className="size-5" /> Alterar aparência
          </Button>
          <p className="px-2 text-sm leading-6 text-stone-500">
            Mantenha o perfil curto. O foco principal continua sendo os links.
          </p>
        </aside>
      </div>

      <section id="redes-sociais" className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            Redes sociais
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Trate redes como suporte do perfil. Adicione poucos canais, com prioridade para os que
            realmente ajudam a converter ou dar confiança.
          </p>
        </div>
        <SocialManagerPanel socials={data.socials} returnTo="/dashboard/profile" />
      </section>
    </div>
  );
}
