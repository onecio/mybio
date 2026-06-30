import { ArrowRight, Menu } from "lucide-react";

import { marketingNav } from "@/lib/mock-data";
import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";

export function FloatingHeader() {
  return (
    <header className="sticky top-3 z-40 mx-auto flex w-full max-w-7xl justify-center px-4 md:top-5">
      <div className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_92%,transparent)] px-4 py-3 shadow-[0_22px_60px_-38px_rgba(20,25,26,0.42)] backdrop-blur-xl md:px-5">
        <BrandMark />
        <nav className="hidden items-center gap-2 lg:flex">
          {marketingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-[var(--brand-sage-soft)] hover:text-stone-950"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button href="/login" variant="ghost">
            Entrar
          </Button>
          <Button href="/register" className="gap-2">
            Criar conta <ArrowRight className="size-4" />
          </Button>
        </div>
        <button
          className="flex size-11 items-center justify-center rounded-xl border border-[var(--brand-line)] bg-white/80 text-[var(--brand-petrol)] md:hidden"
          type="button"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
