import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function DashboardSettingsPage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Configurações"
        description="Ajuste domínio, SEO básico, preferências do workspace e prepare a base para ambientes reais."
        actionLabel="Salvar preferências"
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <form className="grid gap-5">
            <Field label="Título SEO">
              <TextInput defaultValue="Luna Ferraz | Creator e estrategista" />
            </Field>
            <Field label="Descrição">
              <TextInput defaultValue="Presença digital premium, cursos, mentoria e comunidade." />
            </Field>
            <Field label="Domínio personalizado">
              <TextInput defaultValue="bio.lunaferraz.com" />
            </Field>
            <Field label="E-mail de suporte">
              <TextInput defaultValue="contato@lunaferraz.com" />
            </Field>
            <Button type="submit">Salvar configuração</Button>
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            próximos passos
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Integrações futuras
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "Conectar variáveis do Supabase para autenticação real.",
              "Ativar Cloudinary para upload e transformação de mídia.",
              "Trocar dados mockados por tabelas e queries tipadas.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-sm leading-7 text-stone-600"
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
