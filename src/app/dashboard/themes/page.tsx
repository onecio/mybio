import { Check } from "lucide-react";

import { selectThemeAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
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

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Aparência"
        description="Escolha uma identidade visual. A alteração é aplicada à página pública."
      />

      <StatusMessage error={params.error} success={params.success} />

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
                  label={theme.selected ? "Ativo" : "Selecionar"}
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
            <span className="text-xs text-stone-500">Página pública</span>
          </div>
          <div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm">
            <PhoneMockup profile={toPreviewProfile(dashboardData)} compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
