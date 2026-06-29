import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <DashboardSidebar />
        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );
}
