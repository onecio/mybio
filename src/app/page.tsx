import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  GripVertical,
  Palette,
  ShieldCheck,
} from "lucide-react";

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
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <BrandMark href="/" />
        <div className="flex items-center gap-3">
          <Button href="/login" variant="ghost" className="hidden sm:inline-flex">Entrar</Button>
          <Button href="/register" className="gap-2">Criar conta <ArrowRight className="size-4" /></Button>
        </div>
      </header>

      <section className="mx-auto grid min-h-[72vh] w-full max-w-7xl items-center gap-10 px-5 pb-14 pt-8 md:px-8 lg:grid-cols-[1fr_390px] lg:pt-12">
        <div className="grid gap-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-petrol)]">
              Bio page clara, rápida e prática
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Menos ruído. Mais clique.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
              Organize links, redes, contato e ofertas em uma página pública objetiva, bonita e fácil de atualizar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="gap-2">
              Criar meu MyBio <ArrowRight className="size-4" />
            </Button>
            <Button href="/login" variant="secondary" size="lg">
              Entrar no painel
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Edite links em segundos",
              "Compartilhe URL e QR Code",
              "Acompanhe cliques e visitas",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-stone-200 bg-white px-4 py-4 text-sm font-medium text-stone-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-500">
            <ShieldCheck className="size-4 text-[var(--brand-petrol)]" /> Gratuito, seguro e otimizado para smartphones.
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2.5rem] border border-stone-200 bg-white p-5 shadow-[0_35px_100px_-55px_rgba(20,25,26,0.45)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-[1.4rem] bg-[var(--brand-petrol)] text-sm font-bold text-white">MB</div>
              <div>
                <p className="font-semibold text-stone-950">Meu perfil</p>
                <p className="text-sm text-stone-500">@meuperfil</p>
              </div>
            </div>
            <span className="rounded-full bg-[var(--brand-sage-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-petrol)]">
              Publicado
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Conteúdo, projetos e contato em um único lugar.
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "Projeto principal",
              "Agende uma conversa",
              "Baixar material gratuito",
            ].map((label) => (
              <div key={label} className="flex h-14 items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm font-semibold">
                {label}
                <ExternalLink className="size-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3 md:px-8">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand-sage-soft)] text-[var(--brand-petrol)]"><Icon className="size-5" /></span>
              <h2 className="mt-4 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center md:px-8">
        <BrandMark className="mx-auto w-fit" />
        <h2 className="mt-8 font-display text-4xl tracking-[-0.045em] sm:text-5xl">Publique hoje.</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">
          Crie a conta, ajuste seus links e compartilhe.
        </p>
        <Button href="/register" size="lg" className="mt-8 gap-2">
          Começar agora <ArrowRight className="size-4" />
        </Button>
      </section>
    </main>
  );
}
