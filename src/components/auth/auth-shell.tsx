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
    <main className="min-h-screen bg-[#f6f6f4] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-center"><BrandMark /></div>
        <div className="mt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-stone-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
        </div>

        <SurfaceCard className="mt-7 w-full rounded-2xl p-5 sm:p-6">
          <div className="grid gap-6">
            {children}
            <div className="border-t border-stone-200 pt-5 text-center text-sm text-stone-600">
              {footer}
            </div>
          </div>
        </SurfaceCard>
        <div className="mt-5 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}
