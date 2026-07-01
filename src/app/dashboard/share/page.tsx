import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ShareKit } from "@/components/dashboard/share-kit";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getDashboardData } from "@/lib/queries/mybio";

export default async function DashboardSharePage() {
  const data = await getDashboardData();

  if (!data?.publicUrl) return null;

  return (
    <div className="grid gap-6">
      <DashboardHeader
        title="Compartilhar"
        description="Copie a URL, baixe o QR Code e divulgue."
        action={<span className="rounded-full bg-[var(--brand-sage-soft)] px-4 py-2 text-sm font-semibold text-[var(--brand-petrol)]">Pronto</span>}
      />
      <SurfaceCard className="rounded-[2.2rem] p-5 sm:p-7">
        <ShareKit publicUrl={data.publicUrl} title={data.profile?.title ?? "Meu MyBio"} />
      </SurfaceCard>
    </div>
  );
}
