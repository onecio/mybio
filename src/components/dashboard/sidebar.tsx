/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BarChart3,
  Link2,
  Palette,
  Settings,
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
  analytics: BarChart3,
  settings: Settings,
} as const;

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
    <aside className="flex h-full flex-col gap-5 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)] backdrop-blur-xl md:p-5 lg:sticky lg:top-6">
      <BrandMark href="/" />

      <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,rgba(245,158,11,0.12)_0%,rgba(56,189,248,0.08)_50%,rgba(167,243,208,0.16)_100%)] p-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="size-12 rounded-[1.4rem] object-cover shadow-[0_18px_30px_-24px_rgba(15,23,42,0.24)]"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#f59e0b_0%,#bfdbfe_100%)] text-sm font-bold text-stone-950">
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

      <nav className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
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
                  ? "bg-stone-950 text-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.8)]"
                  : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-950",
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.6rem] border border-stone-200/70 bg-stone-50/80 p-4">
        <p className="text-sm font-semibold text-stone-900">Backend conectado ao Supabase</p>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Ajuste seus dados reais, publique os links e mantenha o Cloudinary apenas como
          opcional para mídia.
        </p>
      </div>
    </aside>
  );
}
