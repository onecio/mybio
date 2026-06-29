import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Music2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { mockProfile } from "@/lib/mock-data";

const socialIconMap = {
  instagram: Camera,
  linkedin: BriefcaseBusiness,
  tiktok: Music2,
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = {
    ...mockProfile,
    username,
  };

  return (
    <main className="page-shell min-h-screen px-4 py-8 md:px-6">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-[-0.05em] text-stone-950">
            MyBio
          </Link>
          <Button href="/register" variant="secondary">
            Criar meu MyBio
          </Button>
        </div>

        <SurfaceCard className="rounded-[2.6rem] p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,#f59e0b_0%,#bfdbfe_58%,#c4b5fd_100%)] text-2xl font-bold text-stone-950 shadow-[0_20px_60px_-30px_rgba(245,158,11,0.8)]">
              {profile.avatar}
            </div>
            <div className="mt-5 flex items-center gap-2">
              <h1 className="font-display text-5xl leading-none tracking-[-0.05em] text-stone-950">
                {profile.name}
              </h1>
              {profile.verified ? <BadgeCheck className="size-5 text-emerald-500" /> : null}
            </div>
            <p className="mt-2 text-lg text-stone-500">@{profile.username}</p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{profile.bio}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {profile.socials.map((social) => {
                const Icon = socialIconMap[social.platform as keyof typeof socialIconMap] ?? Sparkles;

                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.3)]"
                  >
                    <Icon className="size-4" />
                    {social.handle}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.6rem] border border-stone-200/70 bg-stone-50/80 px-4 py-4 text-center"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-stone-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-stone-500">{stat.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <div className="grid gap-4">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="group rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(255,248,238,0.9)_100%)] p-5 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.26)] transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                      {link.title}
                    </h2>
                    {link.featured ? (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        destaque
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{link.description}</p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-full bg-stone-950 text-white transition group-hover:bg-amber-500 group-hover:text-stone-950">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
