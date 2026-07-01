/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BarChart3,
  ExternalLink,
  Link2,
  Palette,
  Settings,
  Share2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/ui/brand-mark";
import { dashboardNav } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: Link2,
  profile: UserRound,
  links: Link2,
  socials: UserRound,
  themes: Palette,
  share: Share2,
  analytics: BarChart3,
  settings: Settings,
} as const;

const mobileNav = dashboardNav.filter((item) => item.section !== "settings").slice(0, 5);

interface DashboardSidebarProps {
  name: string;
  username: string;
  initials: string;
  avatarUrl?: string | null;
  publicUrl?: string | null;
}

export function DashboardSidebar({
  name,
  username,
  initials,
  avatarUrl,
  publicUrl,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden">
        <BrandMark href="/" className="origin-left scale-90" />
        <div className="flex items-center gap-2">
          {publicUrl ? (
            <Link href={publicUrl} aria-label="Abrir página pública" className="grid size-10 place-items-center rounded-full bg-stone-100 text-stone-800">
              <ExternalLink className="size-4" />
            </Link>
          ) : null}
          <Link href="/dashboard/settings" aria-label="Configurações" className="grid size-10 place-items-center rounded-full bg-stone-900 text-white">
            <Settings className="size-4" />
          </Link>
        </div>
      </header>

      <aside className="hidden h-screen flex-col border-r border-stone-200 bg-white px-4 py-5 lg:sticky lg:top-0 lg:flex">
        <BrandMark href="/" />

        <nav className="mt-8 grid gap-1" aria-label="Painel principal">
          {dashboardNav.map((item) => {
            const section = item.section ?? "dashboard";
            const Icon = iconMap[section];
            const active = pathname === item.href || (item.href === "/dashboard/links" && pathname === "/dashboard");

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                  active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          {publicUrl ? (
            <Link href={publicUrl} className="mb-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
              <ExternalLink className="size-4" /> Ver página
            </Link>
          ) : null}
          <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-stone-100">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-9 rounded-full object-cover" />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-[var(--brand-petrol)] text-xs font-bold text-white">{initials}</span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-stone-900">{name}</span>
              <span className="block truncate text-xs text-stone-500">@{username}</span>
            </span>
            <Settings className="size-4 text-stone-400" />
          </Link>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-stone-200 bg-white px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 lg:hidden" aria-label="Navegação principal">
        {mobileNav.map((item) => {
          const section = item.section ?? "links";
          const Icon = iconMap[section];
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[0.65rem] font-semibold", active ? "text-[var(--brand-petrol)]" : "text-stone-500")}>
              <Icon className="size-[19px]" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
