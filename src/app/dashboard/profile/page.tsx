import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { mockProfile } from "@/lib/mock-data";

export default function DashboardProfilePage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Editar perfil"
        description="Refine seu posicionamento, headline e bio para construir uma percepção premium consistente em todos os acessos."
        actionLabel="Salvar perfil"
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nome">
                <TextInput defaultValue={mockProfile.name} />
              </Field>
              <Field label="Username">
                <TextInput defaultValue={mockProfile.username} />
              </Field>
            </div>
            <Field label="Headline">
              <TextInput defaultValue={mockProfile.headline} />
            </Field>
            <Field label="Bio">
              <TextArea defaultValue={mockProfile.bio} />
            </Field>
            <Field label="Localização">
              <TextInput defaultValue={mockProfile.location} />
            </Field>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">Salvar ajustes</Button>
              <Button type="button" variant="secondary">
                Visualizar página
              </Button>
            </div>
          </form>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            checklist premium
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Perfil quase perfeito
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "Headline com promessa clara e valor percebido.",
              "Bio objetiva, elegante e orientada a conversão.",
              "Username limpo para compartilhamento fácil.",
              "Localização usada como sinal de contexto e confiança.",
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
