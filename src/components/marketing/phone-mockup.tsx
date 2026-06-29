import { BadgeCheck, MapPin, PlayCircle } from "lucide-react";

import type { UserProfile } from "@/types";
import { SurfaceCard } from "@/components/ui/surface-card";

interface PhoneMockupProps {
  profile: UserProfile;
  compact?: boolean;
}

export function PhoneMockup({ profile, compact = false }: PhoneMockupProps) {
  const visibleLinks = compact ? profile.links.slice(0, 3) : profile.links.slice(0, 4);

  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="absolute inset-x-10 top-4 h-24 rounded-full bg-amber-200/80 blur-3xl" />
      <div className="absolute inset-x-16 bottom-0 h-24 rounded-full bg-sky-200/80 blur-3xl" />
      <div className="relative rounded-[3.2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,250,242,0.86)_100%)] p-3 shadow-[0_35px_100px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="rounded-[2.6rem] border border-stone-200/80 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(180deg,#fffef9_0%,#fff7ed_100%)] p-4">
          <div className="mx-auto mb-4 h-1.5 w-24 rounded-full bg-stone-200" />
          <SurfaceCard className="gap-4 rounded-[2rem] bg-white/85 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <div className="flex size-12 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#f59e0b_0%,#bfdbfe_100%)] text-sm font-bold text-stone-950">
                    {profile.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-950">{profile.name}</p>
                    <p className="text-sm text-stone-500">@{profile.username}</p>
                  </div>
                </div>
                <p className="max-w-[220px] text-sm leading-6 text-stone-600">{profile.headline}</p>
              </div>
              {profile.verified ? (
                <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                  <BadgeCheck className="size-4" />
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-stone-500">
              <MapPin className="size-3.5" />
              {profile.location}
            </div>

            <div className="grid gap-3">
              {visibleLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-[1.5rem] border border-white bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(255,249,237,0.94)_100%)] px-4 py-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-900">{link.title}</p>
                      <p className="text-xs text-stone-500">{link.description}</p>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-full bg-stone-950 text-white">
                      <PlayCircle className="size-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {profile.stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.3rem] border border-white/70 bg-white/70 px-3 py-3"
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-stone-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
