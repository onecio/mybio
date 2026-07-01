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
    <div className="min-h-screen bg-[#f6f6f4] pb-20 lg:pb-0">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <DashboardSidebar
          name={name}
          username={dashboardData.profile?.username ?? "meu-mybio"}
          initials={getInitials(name)}
          avatarUrl={dashboardData.profile?.avatar_url}
          publicUrl={dashboardData.publicUrl}
        />
        <main className="min-w-0 overflow-x-clip px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
