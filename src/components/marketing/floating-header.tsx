import { ArrowRight, Menu } from "lucide-react";

import { marketingNav } from "@/lib/mock-data";
import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";

export function FloatingHeader() {
  return (
    <header className="sticky top-6 z-40 mx-auto flex w-full max-w-7xl justify-center px-4">
      <div className="flex w-full items-center justify-between gap-4 rounded-full border border-white/80 bg-white/75 px-4 py-3 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl md:px-5">
        <BrandMark />
        <nav className="hidden items-center gap-2 lg:flex">
          {marketingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100/80 hover:text-stone-950"
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
          className="flex size-11 items-center justify-center rounded-full border border-stone-200 bg-white/80 text-stone-700 md:hidden"
          type="button"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  );
}
