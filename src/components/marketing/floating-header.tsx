import { ArrowRight } from "lucide-react";

import { BrandMark } from "@/components/ui/brand-mark";
import { Button } from "@/components/ui/button";

export function FloatingHeader() {
  return (
    <header className="sticky top-3 z-40 mx-auto flex w-full max-w-7xl justify-center px-4 md:top-5">
      <div className="flex w-full items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--brand-line)] bg-[color-mix(in_srgb,var(--brand-surface)_92%,transparent)] px-4 py-3 shadow-[0_22px_60px_-38px_rgba(20,25,26,0.42)] backdrop-blur-xl md:px-5">
        <BrandMark />
        <div className="flex items-center gap-1 sm:gap-2">
          <Button href="/login" variant="ghost">
            Entrar
          </Button>
          <Button href="/register" className="hidden gap-2 sm:inline-flex">
            Criar conta <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
