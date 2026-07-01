"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function PublicShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const data = { title, text: `Conheça ${title} no MyBio`, url: window.location.href };

    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Compartilhar perfil"
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--brand-line)] bg-white/80 px-4 text-sm font-semibold text-[var(--brand-ink)] shadow-sm transition hover:-translate-y-0.5"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}
