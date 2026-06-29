import { Check } from "lucide-react";

import { selectThemeAction } from "@/actions/dashboard";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData, toThemePreset } from "@/lib/queries/mybio";

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
        title="Temas e identidade"
        description="Escolha o tema salvo no Supabase para atualizar a aparência da página pública sem depender de mocks."
      />

      <StatusMessage error={params.error} success={params.success} />

      <div className="grid gap-5 lg:grid-cols-3">
        {themePresets.map((theme) => (
          <SurfaceCard key={theme.id} className="rounded-[2.2rem] p-5">
            <div
              className="h-36 rounded-[1.7rem] border border-white/70"
              style={{ background: theme.accent }}
            />
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-stone-950">
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
      </div>
    </div>
  );
}
