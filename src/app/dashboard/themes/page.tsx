import { Check, ExternalLink, Link2, Palette, Share2 } from "lucide-react";

import { selectThemeAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData, toPreviewProfile, toThemePreset } from "@/lib/queries/mybio";

export default async function DashboardThemesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return null;
  }

  const themePresets = dashboardData.themes.map((theme) =>
    toThemePreset(theme, theme.id === dashboardData.profile?.theme_id),
  );
  const selectedTheme = themePresets.find((theme) => theme.selected) ?? themePresets[0];

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Aparência"
        description="Escolha o visual da página e publique com o mínimo de atrito. O foco aqui é decidir rápido e seguir para os links."
        action={
          <>
            <Button href="/dashboard/links" variant="secondary" className="gap-2">
              <Link2 className="size-4" /> Voltar aos links
            </Button>
            <Button href="/dashboard/share" variant="secondary" className="gap-2">
              <Share2 className="size-4" /> Compartilhar
            </Button>
            {dashboardData.publicUrl ? (
              <Button href={dashboardData.publicUrl} variant="secondary" className="gap-2">
                <ExternalLink className="size-4" /> Ver página
              </Button>
            ) : null}
          </>
        }
      />

      <StatusMessage error={params.error} success={params.success} />

      {selectedTheme ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <SurfaceCard className="rounded-[2rem] p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-400">
                    tema atual
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
                    {selectedTheme.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                    {selectedTheme.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-sage-soft)] px-4 py-2 text-sm font-semibold text-[var(--brand-petrol)]">
                  <Check className="size-4" /> ativo
                </span>
              </div>

              <div
                className="h-40 rounded-[1.8rem] border border-white/70 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.4)]"
                style={{ background: selectedTheme.accent }}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                  <div
                    className="mb-3 size-10 rounded-full border border-stone-200"
                    style={{ backgroundColor: selectedTheme.surface }}
                  />
                  <p className="text-sm font-semibold text-stone-900">Superfície</p>
                  <p className="mt-1 text-xs text-stone-500">Cartões e blocos da página</p>
                </div>
                <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                  <div
                    className="mb-3 size-10 rounded-full border border-stone-200"
                    style={{ backgroundColor: selectedTheme.text }}
                  />
                  <p className="text-sm font-semibold text-stone-900">Texto</p>
                  <p className="mt-1 text-xs text-stone-500">Leitura principal e contraste</p>
                </div>
                <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                  <div
                    className="mb-3 size-10 rounded-full border border-stone-200"
                    style={{ backgroundColor: selectedTheme.ring }}
                  />
                  <p className="text-sm font-semibold text-stone-900">Destaque</p>
                  <p className="mt-1 text-xs text-stone-500">Contornos, seleção e profundidade</p>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <Palette className="size-5 text-[var(--brand-petrol)]" />
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                Como decidir
              </h2>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">Escolha por percepção</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  O tema deve reforçar sua proposta, não competir com os links.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">Mantenha consistência</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Se o perfil já converte, altere o visual com parcimônia para não quebrar reconhecimento.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">Volte para os links</p>
                <p className="mt-1 text-sm leading-6 text-stone-500">
                  Depois do tema, o próximo ajuste de maior impacto continua sendo a ordem e o destaque dos links.
                </p>
              </div>
            </div>
          </SurfaceCard>
        </section>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-4 md:grid-cols-2">
        {themePresets.map((theme) => (
          <SurfaceCard key={theme.id} className="rounded-2xl p-4">
            <div
              className="h-36 rounded-[1.7rem] border border-white/70"
              style={{ background: theme.accent }}
            />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                  {theme.name}
                </h2>
                <p className="mt-2 text-sm leading-7 text-stone-600">{theme.description}</p>
              </div>
              {theme.selected ? (
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-stone-950 text-white">
                  <Check className="size-4" />
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.surface }}
                />
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.text }}
                />
                <span
                  className="size-8 rounded-full border border-stone-200"
                  style={{ backgroundColor: theme.ring }}
                />
              </div>
              <form action={selectThemeAction}>
                <input type="hidden" name="presetId" value={theme.id} />
                <input type="hidden" name="accentHex" value={theme.surface} />
                <SubmitButton
                  label={theme.selected ? "Tema ativo" : "Aplicar tema"}
                  pendingLabel="Aplicando..."
                  variant={theme.selected ? "primary" : "secondary"}
                />
              </form>
            </div>
          </SurfaceCard>
        ))}
        </section>
        <aside className="hidden lg:sticky lg:top-7 lg:block">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-stone-900">Preview</p>
            <span className="text-xs text-stone-500">leitura do visitante</span>
          </div>
          <div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
            <PhoneMockup profile={toPreviewProfile(dashboardData)} compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
