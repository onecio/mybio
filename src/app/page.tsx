import { ArrowRight, BarChart3, GripVertical, Palette, ShieldCheck } from "lucide-react";

import { FloatingHeader } from "@/components/marketing/floating-header";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";

const benefits = [
  { icon: GripVertical, title: "Organize", text: "Adicione, edite e reordene links em segundos." },
  { icon: Palette, title: "Personalize", text: "Escolha uma aparência clara e profissional." },
  { icon: BarChart3, title: "Entenda", text: "Acompanhe visualizações, cliques e taxa de clique." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f6f4] text-stone-950">
      <FloatingHeader />

      <section className="mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-28 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-32">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-petrol)]">Sua presença em um só link</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Tudo o que importa, em uma página simples.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
            Reúna links, redes e conteúdos. Personalize sua página, compartilhe o QR Code e acompanhe os resultados.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="gap-2">Criar meu MyBio <ArrowRight className="size-4" /></Button>
            <Button href="/login" variant="secondary" size="lg">Entrar</Button>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-stone-500">
            <ShieldCheck className="size-4 text-[var(--brand-petrol)]" /> Gratuito, seguro e otimizado para smartphones.
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2.8rem] border border-stone-200 bg-white p-5 shadow-[0_35px_100px_-55px_rgba(20,25,26,0.45)] sm:p-7">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--brand-petrol)] text-xl font-bold text-white">MB</div>
          <h2 className="mt-4 text-center text-2xl font-bold">Meu perfil</h2>
          <p className="mt-1 text-center text-sm text-stone-500">@meuperfil</p>
          <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-6 text-stone-600">Conteúdo, projetos e formas de contato.</p>
          <div className="mt-6 grid gap-3">
            {["Meu principal projeto", "Agende uma conversa", "Conteúdos gratuitos"].map((label) => (
              <div key={label} className="flex h-14 items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold">
                {label}<ArrowRight className="size-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3 md:px-8">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]"><Icon className="size-5" /></span>
              <h2 className="mt-4 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <BrandMark className="mx-auto w-fit" />
        <h2 className="mt-8 font-display text-4xl tracking-[-0.045em] sm:text-5xl">Sua página pode estar pronta hoje.</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">Crie a conta, adicione os links e compartilhe. Sem configuração complicada.</p>
        <Button href="/register" size="lg" className="mt-8 gap-2">Começar agora <ArrowRight className="size-4" /></Button>
      </section>
    </main>
  );
}
