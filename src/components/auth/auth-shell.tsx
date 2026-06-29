import type { ReactNode } from "react";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { BrandMark } from "@/components/ui/brand-mark";
import { SurfaceCard } from "@/components/ui/surface-card";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 md:px-8 md:py-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(167,243,208,0.2),_transparent_28%),linear-gradient(180deg,#fffdf8_0%,#fff7ed_100%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl space-y-6 px-1 pt-4 md:px-2 md:pt-6">
          <BrandMark />
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              {eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-none tracking-[-0.05em] text-stone-950 sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="max-w-lg text-base leading-7 text-stone-600 md:text-lg md:leading-8">
              {description}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-stone-700 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.35)] transition hover:bg-white"
          >
            <ArrowLeft className="size-4" />
            Voltar para a landing
          </Link>
        </section>

        <SurfaceCard className="w-full max-w-xl rounded-[2.3rem] p-5 md:p-8">
          <div className="grid gap-6">
            {children}
            <div className="rounded-[1.5rem] border border-stone-200/70 bg-stone-50/80 px-4 py-3 text-sm text-stone-600">
              {footer}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}
