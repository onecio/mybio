"use client";

import { Check, Copy, Download, ExternalLink, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ShareKit({ publicUrl, title }: { publicUrl: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({ title, text: `Acesse meu MyBio: ${title}`, url: publicUrl }).catch(() => undefined);
      return;
    }

    await copyLink();
  }

  function downloadQrCode() {
    const svg = document.querySelector("[data-mybio-qr]");
    if (!(svg instanceof SVGElement)) return;

    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "mybio-qrcode.svg";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex min-h-80 items-center justify-center rounded-[2rem] bg-[var(--brand-ink)] p-8">
        <div className="rounded-[1.5rem] bg-white p-5 shadow-2xl">
          <QRCodeSVG
            data-mybio-qr
            value={publicUrl}
            size={220}
            level="H"
            bgColor="#ffffff"
            fgColor="#0a3d3e"
            marginSize={1}
            title={`QR Code para ${title}`}
          />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-copper)]">
          distribuição inteligente
        </p>
        <h2 className="mt-3 font-display text-4xl tracking-[-0.045em] text-[var(--brand-ink)]">
          Um link pronto para qualquer canal.
        </h2>
        <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
          Compartilhe diretamente pelo smartphone, copie o endereço ou baixe o QR Code vetorial para materiais impressos.
        </p>

        <div className="mt-6 rounded-[1.25rem] border border-[var(--brand-line)] bg-[var(--brand-sage-soft)]/60 px-4 py-3 font-mono text-sm text-[var(--brand-ink)]">
          {publicUrl}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={copyLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-petrol)] px-5 text-sm font-semibold text-white">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Link copiado" : "Copiar link"}
          </button>
          <button type="button" onClick={shareLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--brand-line)] bg-white px-5 text-sm font-semibold text-[var(--brand-ink)]">
            <Share2 className="size-4" /> Compartilhar
          </button>
          <button type="button" onClick={downloadQrCode} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--brand-line)] bg-white px-5 text-sm font-semibold text-[var(--brand-ink)]">
            <Download className="size-4" /> Baixar QR Code
          </button>
          <Button href={publicUrl} variant="secondary" className="gap-2">
            <ExternalLink className="size-4" /> Abrir página
          </Button>
        </div>
      </div>
    </div>
  );
}
