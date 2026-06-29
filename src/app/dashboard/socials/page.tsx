import { BriefcaseBusiness, Camera, Globe, Music2 } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { mockSocials } from "@/lib/mock-data";

const iconMap = {
  instagram: Camera,
  linkedin: BriefcaseBusiness,
  tiktok: Music2,
};

export default function DashboardSocialsPage() {
  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Redes sociais"
        description="Conecte seus canais principais e deixe o perfil preparado para distribuir tráfego de forma elegante."
        actionLabel="Conectar rede"
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <SurfaceCard className="rounded-[2.2rem] p-6">
          <div className="grid gap-4">
            {mockSocials.map((social) => {
              const Icon = iconMap[social.platform as keyof typeof iconMap] ?? Globe;

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
                  <div className="text-left md:text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
                      audiência
                    </p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
                      {social.followers}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[2.2rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
            estratégia
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            Distribua o tráfego com intenção
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "Leve o público de awareness para links de conversão.",
              "Destaque canais com melhor retenção e prova social.",
              "Use handles consistentes para reforçar marca pessoal.",
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
