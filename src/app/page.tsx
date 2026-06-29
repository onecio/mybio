import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CloudUpload,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { FloatingHeader } from "@/components/marketing/floating-header";
import { PhoneMockup } from "@/components/marketing/phone-mockup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import {
  benefits,
  featureItems,
  mockProfile,
  processSteps,
  showcasePages,
  socialProof,
  testimonials,
} from "@/lib/mock-data";

const featureIconMap = {
  sparkles: Sparkles,
  "bar-chart-3": BarChart3,
  smartphone: Smartphone,
  "shield-check": ShieldCheck,
  "cloud-upload": CloudUpload,
  "badge-check": BadgeCheck,
} as const;

export default function Home() {
  return (
    <div className="pb-10">
      <FloatingHeader />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-18 px-4 pt-6 md:gap-24 md:px-6 md:pt-10">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(167,243,208,0.16),_transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,248,238,0.9)_100%)] px-5 py-6 shadow-[0_30px_120px_-50px_rgba(15,23,42,0.25)] md:rounded-[2.8rem] md:px-10 md:py-10">
          <div className="absolute right-10 top-10 hidden size-44 rounded-full bg-violet-200/45 blur-3xl lg:block" />
          <div className="absolute bottom-10 left-10 hidden size-44 rounded-full bg-emerald-200/50 blur-3xl lg:block" />

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative z-10 grid gap-8">
              <div className="grid gap-5">
                <Badge className="w-fit">premium bio experience</Badge>
                <div className="grid gap-5">
                  <h1 className="max-w-4xl font-display text-[3.15rem] leading-[0.92] tracking-[-0.06em] text-stone-950 sm:text-[4.2rem] md:text-7xl xl:text-[6.8rem]">
                    A alternativa premium ao Linktree para quem quer presença forte.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-stone-600 md:text-xl md:leading-8">
                    O MyBio une design sofisticado, estrutura moderna e foco em conversão
                    para creators, experts e marcas que não aceitam uma bio page comum.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/register" size="lg" className="gap-2">
                  Criar página premium <ArrowRight className="size-4" />
                </Button>
                <Button href="/dashboard" size="lg" variant="secondary">
                  Explorar dashboard
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {socialProof.map((item) => (
                  <SurfaceCard key={item} className="rounded-[1.6rem] p-4">
                    <p className="text-sm leading-6 text-stone-700">{item}</p>
                  </SurfaceCard>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <PhoneMockup profile={mockProfile} />
            </div>
          </div>
        </section>

        <section id="beneficios" className="grid gap-8">
          <SectionHeading
            eyebrow="benefícios"
            title="Visual refinado, estrutura estratégica e percepção de valor instantânea."
            description="Cada bloco foi desenhado para parecer produto premium desde o primeiro scroll, sem sacrificar clareza nem organização."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {benefits.map((item) => (
              <SurfaceCard key={item.title} className="rounded-[2rem] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
                  {item.eyebrow}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-stone-600">{item.description}</p>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section
          id="como-funciona"
          className="grid gap-8 rounded-[2.2rem] border border-white/70 bg-white/75 p-5 shadow-[0_25px_80px_-42px_rgba(15,23,42,0.22)] md:gap-10 md:rounded-[2.6rem] md:p-8"
        >
          <SectionHeading
            eyebrow="como funciona"
            title="Uma jornada simples com acabamento premium do início ao fim."
            description="Do cadastro ao acompanhamento de resultados, a base entrega clareza operacional e um visual de alto nível."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-[2rem] border border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,238,0.84)_100%)] p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">
                  {item.step}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="showcase" className="grid gap-8">
          <SectionHeading
            eyebrow="showcase de páginas"
            title="Modelos com linguagem visual própria para diferentes posicionamentos."
            description="A mesma base suporta creators, especialistas e marcas com abordagens estéticas distintas, mantendo a assinatura premium."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {showcasePages.map((page) => (
              <SurfaceCard key={page.title} className="overflow-hidden rounded-[2.2rem] p-0">
                <div className={`h-36 bg-gradient-to-br ${page.accent}`} />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                    {page.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                    {page.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{page.description}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section id="recursos" className="grid gap-8">
          <SectionHeading
            eyebrow="recursos"
            title="Tudo o que você precisa para lançar uma bio page com cara de produto premium."
            description="Além da landing, a base já nasce com autenticação, dashboard, temas, analytics e estrutura para mídia e backend."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((item) => {
              const Icon = featureIconMap[item.icon as keyof typeof featureIconMap] ?? Sparkles;

              return (
                <SurfaceCard key={item.title} className="rounded-[1.9rem] p-6">
                  <div className="flex size-12 items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,rgba(245,158,11,0.16)_0%,rgba(56,189,248,0.14)_100%)] text-stone-900">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-stone-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
                </SurfaceCard>
              );
            })}
          </div>
        </section>

        <section id="depoimentos" className="grid gap-8">
          <SectionHeading
            eyebrow="depoimentos"
            title="Quem usa sente a diferença entre um link comum e uma experiência premium."
            description="O impacto visual acelera confiança, melhora percepção e ajuda a converter melhor desde o primeiro clique."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <SurfaceCard key={item.name} className="rounded-[2rem] p-6">
                <p className="text-base leading-8 text-stone-700">“{item.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#f59e0b_0%,#c4b5fd_100%)] text-sm font-bold text-stone-950">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-950">{item.name}</p>
                    <p className="text-sm text-stone-500">{item.role}</p>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(245,158,11,0.95)_0%,rgba(245,158,11,0.78)_18%,rgba(56,189,248,0.78)_58%,rgba(139,92,246,0.72)_100%)] p-6 text-white shadow-[0_40px_120px_-45px_rgba(245,158,11,0.6)] md:rounded-[2.8rem] md:p-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.24),_transparent_58%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                pronto para lançar
              </p>
              <h2 className="max-w-3xl font-display text-4xl leading-none tracking-[-0.05em] text-white md:text-6xl">
                Substitua o visual genérico por uma presença memorável.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/85">
                Comece com a base pronta do MyBio, personalize sua estética e evolua para
                uma bio page com padrão de produto premium.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button
                href="/register"
                size="lg"
                className="bg-white text-stone-950 shadow-[0_24px_50px_-30px_rgba(255,255,255,0.9)] hover:bg-white"
              >
                Criar conta agora
              </Button>
              <Button
                href="/lunaferraz"
                size="lg"
                variant="secondary"
                className="border-white/40 bg-white/12 text-white hover:bg-white/18"
              >
                Ver página pública
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-6 text-sm text-stone-500 md:flex-row md:items-center md:justify-between md:px-6">
        <p>MyBio Premium Base — pensado para creators, experts e marcas digitais.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/login" className="hover:text-stone-950">
            Login
          </Link>
          <Link href="/register" className="hover:text-stone-950">
            Criar conta
          </Link>
          <Link href="/dashboard" className="hover:text-stone-950">
            Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
