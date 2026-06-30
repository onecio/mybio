/* eslint-disable @next/next/no-img-element */
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Music2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfileViewTracker } from "@/components/analytics/profile-view-tracker";
import { Button } from "@/components/ui/button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getPublicProfileByUsername } from "@/lib/queries/mybio";

const socialIconMap = {
  instagram: Camera,
  linkedin: BriefcaseBusiness,
  tiktok: Music2,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    return { title: "Perfil não encontrado", robots: { index: false, follow: false } };
  }

  const title = profile.title;
  const description = profile.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/${profile.username}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/${profile.username}`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl, alt: title }] : undefined,
    },
    twitter: {
      card: profile.avatarUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const themeStyle = {
    backgroundColor: profile.themeConfig.backgroundColor,
    color: profile.themeConfig.textColor,
  };

  return (
    <main className="page-shell min-h-screen px-4 py-6 md:px-6 md:py-8" style={themeStyle}>
      <ProfileViewTracker username={profile.username} />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-display text-3xl tracking-[-0.05em] text-stone-950">
            MyBio
          </Link>
          <Button href="/register" variant="secondary" className="w-full sm:w-auto">
            Criar meu MyBio
          </Button>
        </div>

        <SurfaceCard className="rounded-[2.6rem] p-5 sm:p-6 md:p-8">
          <div className="flex flex-col items-center text-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.title}
                className="size-24 rounded-[2rem] object-cover shadow-[0_20px_60px_-30px_rgba(245,158,11,0.8)]"
              />
            ) : (
              <div className="flex size-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,#f59e0b_0%,#bfdbfe_58%,#c4b5fd_100%)] text-2xl font-bold text-stone-950 shadow-[0_20px_60px_-30px_rgba(245,158,11,0.8)]">
                {profile.initials}
              </div>
            )}
            <div className="mt-5 flex items-center gap-2">
              <h1 className="font-display text-3xl leading-none tracking-[-0.05em] text-stone-950 sm:text-4xl md:text-5xl">
                {profile.title}
              </h1>
              <BadgeCheck className="size-5 text-emerald-500" />
            </div>
            <p className="mt-2 break-all text-base text-stone-500 sm:text-lg">@{profile.username}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 md:text-lg">
              {profile.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {profile.socials.map((social) => {
                const Icon = socialIconMap[social.platform as keyof typeof socialIconMap] ?? Sparkles;

                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-[0_14px_34px_-26px_rgba(15,23,42,0.3)] sm:w-auto"
                  >
                    <Icon className="size-4" />
                    {social.handle}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
              href={`/api/links/${link.id}/click`}
              className={`group overflow-hidden rounded-[1.6rem] border bg-[var(--brand-surface)] p-4 shadow-[0_22px_70px_-44px_rgba(20,25,26,0.36)] transition hover:-translate-y-1 sm:p-5 ${
                link.featured
                  ? "border-[var(--brand-copper)] ring-1 ring-[var(--brand-copper)]/20"
                  : "border-[var(--brand-line)]"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  {link.thumbnailUrl ? (
                    <img
                      src={link.thumbnailUrl}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-[1.1rem] object-cover sm:size-20"
                    />
                  ) : null}
                  <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-stone-950">
                      {link.title}
                    </h2>
                    {link.featured ? (
                      <span className="rounded-full bg-[#f1dfd3] px-3 py-1 text-xs font-semibold text-[#7e3f25]">
                        destaque
                      </span>
                    ) : null}
                  </div>
                    {link.description ? (
                      <p className="mt-2 text-sm leading-6 text-stone-600">{link.description}</p>
                    ) : null}
                    <p className="mt-1 truncate text-xs text-stone-500">{link.hostname}</p>
                  </div>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-petrol)] text-white transition group-hover:bg-[var(--brand-copper)]">
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
