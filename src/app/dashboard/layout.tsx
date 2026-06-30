import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getDashboardData } from "@/lib/queries/mybio";

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    redirect("/login");
  }

  const name =
    dashboardData.profile?.title ||
    (typeof dashboardData.user.user_metadata?.name === "string"
      ? dashboardData.user.user_metadata.name
      : dashboardData.user.email?.split("@")[0]) ||
    "Meu MyBio";

  return (
    <div className="page-shell min-h-screen px-3 py-3 pb-24 sm:px-4 sm:py-4 sm:pb-24 md:px-6 md:py-6 md:pb-24 lg:pb-6">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-1.5rem)] w-full max-w-7xl gap-4 sm:gap-6 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[minmax(280px,300px)_minmax(0,1fr)]">
        <DashboardSidebar
          name={name}
          username={dashboardData.profile?.username ?? "meu-mybio"}
          headline={
            dashboardData.profile?.description ??
            "Personalize sua página pública com backend real e dados sincronizados."
          }
          initials={getInitials(name)}
          avatarUrl={dashboardData.profile?.avatar_url}
          publicUrl={dashboardData.publicUrl}
          isPublished={Boolean(dashboardData.profile?.is_published)}
        />
        <section className="min-w-0 overflow-x-clip">{children}</section>
      </div>
    </div>
  );
}
