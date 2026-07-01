/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BarChart3,
  ExternalLink,
  Link2,
  Palette,
  Settings,
  Share2,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/ui/brand-mark";
import { dashboardNav } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap = {
  dashboard: Sparkles,
  profile: UserRound,
  links: Link2,
  socials: Users,
  themes: Palette,
  share: Share2,
  analytics: BarChart3,
  settings: Settings,
} as const;

const mobileNav = [
  { label: "Início", href: "/dashboard", section: "dashboard" },
  { label: "Perfil", href: "/dashboard/profile", section: "profile" },
  { label: "Links", href: "/dashboard/links", section: "links" },
  { label: "Visual", href: "/dashboard/themes", section: "themes" },
  { label: "Insights", href: "/dashboard/insights", section: "analytics" },
] as const;

interface DashboardSidebarProps {
  name: string;
  username: string;
  headline: string;
  initials: string;
  avatarUrl?: string | null;
  publicUrl?: string | null;
  isPublished: boolean;
}

export function DashboardSidebar({
  name,
  username,
  headline,
  initials,
  avatarUrl,
  publicUrl,
  isPublished,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-3 z-30 flex items-center justify-between gap-3 rounded-[1.35rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_94%,transparent)] px-3 py-2.5 shadow-[0_18px_50px_-34px_rgba(20,25,26,0.42)] backdrop-blur-xl lg:hidden">
        <BrandMark href="/" className="scale-90 origin-left" />
        <div className="flex items-center gap-2">
          {publicUrl ? (
            <Link
              href={publicUrl}
              aria-label="Abrir página pública"
              className="grid size-10 place-items-center rounded-xl border border-[var(--brand-line)] bg-white text-[var(--brand-petrol)]"
            >
              <ExternalLink className="size-4" />
            </Link>
          ) : null}
          <Link
            href="/dashboard/share"
            aria-label="Compartilhar página"
            className="grid size-10 place-items-center rounded-xl border border-[var(--brand-line)] bg-white text-[var(--brand-petrol)]"
          >
            <Share2 className="size-4" />
          </Link>
          <Link
            href="/dashboard/settings"
            aria-label="Configurações"
            className="grid size-10 place-items-center rounded-xl bg-[var(--brand-ink)] text-white"
          >
            <Settings className="size-4" />
          </Link>
        </div>
      </header>

      <aside className="hidden h-full flex-col gap-5 rounded-[1.7rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_92%,transparent)] p-5 shadow-[0_24px_80px_-46px_rgba(20,25,26,0.34)] backdrop-blur-xl lg:sticky lg:top-6 lg:flex">
        <BrandMark href="/" />

        <div className="rounded-[1.45rem] border border-[var(--brand-line)] bg-[var(--brand-sage-soft)]/70 p-4">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="size-12 rounded-[1.4rem] object-cover shadow-[0_18px_30px_-24px_rgba(15,23,42,0.24)]"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-[1.2rem] bg-[var(--brand-petrol)] text-sm font-bold text-white">
                {initials}
              </div>
            )}
            <div>
              <p className="font-semibold text-stone-950">{name}</p>
              <p className="text-sm text-stone-500">@{username}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">{headline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                isPublished ? "bg-emerald-50 text-emerald-700" : "bg-stone-200 text-stone-700",
              )}
            >
              {isPublished ? "Publicado" : "Rascunho"}
            </span>
            {publicUrl ? (
              <Link href={publicUrl} className="text-xs font-semibold text-stone-700 underline-offset-4 hover:underline">
                Ver página pública
              </Link>
            ) : null}
          </div>
        </div>

        <nav className="grid gap-2 lg:grid-cols-1">
          {dashboardNav.map((item) => {
            const section = item.section ?? "dashboard";
            const Icon = iconMap[section];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[1.3rem] px-4 py-3 text-sm font-medium transition",
                  pathname === item.href
                    ? "bg-[var(--brand-petrol)] text-white shadow-[0_18px_40px_-28px_rgba(10,61,62,0.7)]"
                    : "text-stone-600 hover:bg-[var(--brand-sage-soft)] hover:text-stone-950",
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.4rem] border border-[var(--brand-line)] bg-[var(--brand-surface)] p-4">
          <p className="text-sm font-semibold text-stone-900">Operação protegida</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Sessão validada pelo Supabase e dados isolados por políticas de acesso.
          </p>
        </div>
      </aside>

      <nav
        aria-label="Navegação principal do painel"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-[1.4rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_96%,transparent)] p-1.5 shadow-[0_22px_70px_-28px_rgba(20,25,26,0.48)] backdrop-blur-xl lg:hidden"
      >
        {mobileNav.map((item) => {
          const Icon = iconMap[item.section];
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-[1rem] px-1 py-2 text-[0.66rem] font-semibold transition",
                active
                  ? "bg-[var(--brand-petrol)] text-white"
                  : "text-[var(--brand-muted)] hover:bg-[var(--brand-sage-soft)]",
              )}
            >
              <Icon className="size-[18px]" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
