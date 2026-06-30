import { cache } from "react";

import type { User } from "@supabase/supabase-js";

import type { LinkItem, SocialLink, ThemePreset, UserProfile } from "@/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl, getSupabaseConfig } from "@/lib/supabase/config";
import { isCloudinaryUploadEnabled } from "@/lib/cloudinary";
import type { Database, Json } from "@/types/supabase";

type ThemeRow = Database["public"]["Tables"]["themes"]["Row"];
type LinkRow = Database["public"]["Tables"]["profile_links"]["Row"];
type SocialRow = Database["public"]["Tables"]["profile_socials"]["Row"];
type ProfileStateRow = Pick<Database["public"]["Tables"]["profile_pages"]["Row"], "is_published">;
type ProfileRow = Database["public"]["Views"]["dashboard_profile_view"]["Row"] &
  Pick<Database["public"]["Tables"]["profile_pages"]["Row"], "is_published">;
type AnalyticsRow = Database["public"]["Views"]["analytics_summary_view"]["Row"];
type ClickRow = Pick<Database["public"]["Tables"]["link_clicks"]["Row"], "link_id" | "clicked_at">;

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily?: string;
  borderRadius?: string;
  buttonStyle?: string;
}

export interface DashboardLink extends LinkRow {
  clicks: number;
  hostname: string;
}

export interface DashboardSocial extends SocialRow {
  handle: string;
}

export interface DailyClickPoint {
  date: string;
  label: string;
  value: number;
}

export interface DashboardData {
  user: User;
  profile: ProfileRow | null;
  links: DashboardLink[];
  socials: DashboardSocial[];
  analytics: AnalyticsRow | null;
  themes: ThemeRow[];
  dailyClicks: DailyClickPoint[];
  topLinks: DashboardLink[];
  publicUrl: string | null;
  isCloudinaryUploadEnabled: boolean;
  isSupabaseConfigured: boolean;
}

export interface PublicProfileLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string | null;
  thumbnailUrl: string | null;
  position: number;
  featured: boolean;
  hostname: string;
}

export interface PublicProfileSocial {
  id: string;
  platform: string;
  url: string;
  handle: string;
}

export interface PublicProfileData {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  avatarUrl: string | null;
  initials: string;
  themeName: string;
  themeConfig: ThemeConfig;
  links: PublicProfileLink[];
  socials: PublicProfileSocial[];
  stats: Array<{ label: string; value: string; detail?: string }>;
}

function isRecord(value: Json | null | undefined): value is Record<string, Json | undefined> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toSafeArray(value: Json | null | undefined) {
  return Array.isArray(value) ? value : [];
}

function getThemeConfig(config: Json | null | undefined): ThemeConfig {
  if (!isRecord(config)) {
    return {
      primaryColor: "#f59e0b",
      backgroundColor: "#fffaf1",
      surfaceColor: "#ffffff",
      textColor: "#1c1917",
      fontFamily: "Manrope",
      borderRadius: "24px",
      buttonStyle: "pill",
    };
  }

  return {
    primaryColor: typeof config.primaryColor === "string" ? config.primaryColor : "#f59e0b",
    backgroundColor:
      typeof config.backgroundColor === "string" ? config.backgroundColor : "#fffaf1",
    surfaceColor: typeof config.surfaceColor === "string" ? config.surfaceColor : "#ffffff",
    textColor: typeof config.textColor === "string" ? config.textColor : "#1c1917",
    fontFamily: typeof config.fontFamily === "string" ? config.fontFamily : "Manrope",
    borderRadius: typeof config.borderRadius === "string" ? config.borderRadius : "24px",
    buttonStyle: typeof config.buttonStyle === "string" ? config.buttonStyle : "pill",
  };
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getSocialHandle(platform: string, url: string) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    const lastSegment = segments.at(-1);

    if (lastSegment) {
      return platform === "linkedin" ? lastSegment : `@${lastSegment.replace(/^@/, "")}`;
    }
  } catch {
    return url;
  }

  return url;
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "MB";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function buildDailyClicks(clicks: ClickRow[], days = 14) {
  const buckets = new Map<string, number>();
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);
    const key = date.toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  clicks.forEach((click) => {
    const key = click.clicked_at.slice(0, 10);

    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  });

  return [...buckets.entries()].map(([date, value]) => ({
    date,
    label: formatter.format(new Date(`${date}T00:00:00`)),
    value,
  }));
}

function parseDashboardPayload(payload: Json | null | undefined) {
  if (!isRecord(payload)) {
    return {
      profile: null as ProfileRow | null,
      links: [] as LinkRow[],
      socials: [] as SocialRow[],
      analytics: null as AnalyticsRow | null,
    };
  }

  return {
    profile: (isRecord(payload.profile) ? payload.profile : null) as ProfileRow | null,
    links: toSafeArray(payload.links).filter(isRecord) as unknown as LinkRow[],
    socials: toSafeArray(payload.socials).filter(isRecord) as unknown as SocialRow[],
    analytics: (isRecord(payload.analytics) ? payload.analytics : null) as AnalyticsRow | null,
  };
}

function parsePublicProfilePayload(payload: Json | null | undefined): PublicProfileData | null {
  if (!isRecord(payload)) {
    return null;
  }

  const themeRecord = isRecord(payload.theme) ? payload.theme : {};
  const themeConfig = getThemeConfig(isRecord(themeRecord) ? themeRecord.config : null);
  const title = typeof payload.title === "string" && payload.title.length > 0 ? payload.title : "Meu MyBio";
  const description =
    typeof payload.description === "string" && payload.description.length > 0
      ? payload.description
      : "Perfil público criado com MyBio.";
  const username =
    typeof payload.username === "string" && payload.username.length > 0 ? payload.username : "mybio";

  const links = toSafeArray(payload.links)
    .filter(isRecord)
    .map((item) => ({
      id: String(item.id ?? crypto.randomUUID()),
      title: String(item.title ?? "Link"),
      url: String(item.url ?? "#"),
      description: typeof item.description === "string" ? item.description : "",
      icon: typeof item.icon === "string" ? item.icon : null,
      thumbnailUrl: typeof item.thumbnail_url === "string" ? item.thumbnail_url : null,
      position: Number(item.position ?? 0),
      featured: Boolean(item.is_featured),
      hostname: getHostname(String(item.url ?? "#")),
    }))
    .sort((first, second) => first.position - second.position);

  const socials = toSafeArray(payload.socials)
    .filter(isRecord)
    .map((item) => {
      const platform = String(item.platform ?? "social");
      const url = String(item.url ?? "#");

      return {
        id: String(item.id ?? crypto.randomUUID()),
        platform,
        url,
        handle: getSocialHandle(platform, url),
      };
    });

  return {
    id: String(payload.id ?? ""),
    userId: String(payload.user_id ?? ""),
    username,
    title,
    description,
    avatarUrl: typeof payload.avatar_url === "string" ? payload.avatar_url : null,
    initials: getInitials(title),
    themeName:
      typeof themeRecord.name === "string" && themeRecord.name.length > 0
        ? themeRecord.name
        : "Amber Professional",
    themeConfig,
    links,
    socials,
    stats: [
      { label: "Links ativos", value: String(links.length), detail: "Prontos para conversão" },
      { label: "Redes conectadas", value: String(socials.length), detail: "Distribuição social" },
      { label: "Tema", value: typeof themeRecord.name === "string" ? themeRecord.name : "Padrão" },
    ],
  };
}

export const getAuthContext = cache(async () => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabase: null,
      user: null,
      isSupabaseConfigured: false,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    user,
    isSupabaseConfigured: getSupabaseConfig().isConfigured,
  };
});

export const getDashboardData = cache(async (): Promise<DashboardData | null> => {
  const { supabase, user, isSupabaseConfigured } = await getAuthContext();

  if (!supabase || !user) {
    return null;
  }

  const [{ data: dashboardPayload }, { data: themes }, { data: profilePageState }] = await Promise.all([
    supabase.rpc("get_dashboard"),
    supabase
      .from("themes")
      .select("id, name, description, preview_image, config, is_public, created_at, updated_at")
      .eq("is_public", true)
      .order("name"),
    supabase.from("profile_pages").select("is_published").eq("user_id", user.id).maybeSingle(),
  ]);

  const { profile, links, socials, analytics } = parseDashboardPayload(dashboardPayload);
  const typedProfilePageState = profilePageState as ProfileStateRow | null;
  const hydratedProfile = profile
    ? {
        ...profile,
        is_published: typedProfilePageState?.is_published ?? false,
      }
    : null;

  const linkIds = links.map((link) => link.id);
  const { data: clicks } =
    linkIds.length > 0
      ? await supabase
          .from("link_clicks")
          .select("link_id, clicked_at")
          .in("link_id", linkIds)
          .order("clicked_at", { ascending: false })
      : { data: [] as ClickRow[] };

  const clickCountMap = new Map<string, number>();

  (clicks ?? []).forEach((click: ClickRow) => {
    clickCountMap.set(click.link_id, (clickCountMap.get(click.link_id) ?? 0) + 1);
  });

  const dashboardLinks = links
    .map((link) => ({
      ...link,
      clicks: clickCountMap.get(link.id) ?? 0,
      hostname: getHostname(link.url),
    }))
    .sort((first, second) => first.position - second.position);

  const dashboardSocials = socials.map((social) => ({
    ...social,
    handle: getSocialHandle(social.platform, social.url),
  }));

  return {
    user,
    profile: hydratedProfile,
    links: dashboardLinks,
    socials: dashboardSocials,
    analytics,
    themes: (themes ?? []) as ThemeRow[],
    dailyClicks: buildDailyClicks((clicks ?? []) as ClickRow[]),
    topLinks: [...dashboardLinks].sort((first, second) => second.clicks - first.clicks).slice(0, 5),
    publicUrl:
      profile?.username && getSiteUrl() ? `${getSiteUrl()}/${profile.username}` : null,
    isCloudinaryUploadEnabled: isCloudinaryUploadEnabled(),
    isSupabaseConfigured,
  };
});

export const getPublicProfileByUsername = cache(async (username: string) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data } = await supabase.rpc("get_profile_by_username", { username } as never);

  return parsePublicProfilePayload(data);
});

export function toPreviewProfile(data: DashboardData): UserProfile {
  const profileName =
    data.profile?.title?.trim() ||
    (typeof data.user.user_metadata?.name === "string" ? data.user.user_metadata.name : "") ||
    data.user.email?.split("@")[0] ||
    "Meu MyBio";
  const avatarUrl =
    data.profile?.avatar_url ||
    (typeof data.user.user_metadata?.avatar_url === "string" ? data.user.user_metadata.avatar_url : null);

  return {
    name: profileName,
    username: data.profile?.username ?? "meu-mybio",
    headline: data.profile?.title ?? profileName,
    bio:
      data.profile?.description ??
      "Organize seus melhores links, redes e ofertas em uma página pública elegante.",
    avatar: avatarUrl ? "IMG" : getInitials(profileName),
    location: data.isCloudinaryUploadEnabled
      ? "Upload direto via Cloudinary ativo"
      : "Avatar por URL manual",
    verified: Boolean(data.profile?.is_published),
    monthlyViews: data.analytics?.views_last_30_days?.toLocaleString("pt-BR") ?? "0",
    conversionRate: `${data.links.length} links`,
    links: data.links.map<LinkItem>((link) => ({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.hostname,
      icon: link.icon ?? "link",
      clicks: link.clicks,
      featured: link.position === 0,
      active: link.is_active,
    })),
    socials: data.socials.map<SocialLink>((social) => ({
      platform: social.platform as SocialLink["platform"],
      handle: social.handle,
      url: social.url,
      followers: social.platform,
    })),
    stats: [
      {
        label: "Visitas 30 dias",
        value: String(data.analytics?.views_last_30_days ?? 0),
        detail: "Audiência recente",
      },
      {
        label: "Links ativos",
        value: String(data.links.filter((link) => link.is_active).length),
        detail: "Itens publicados",
      },
      {
        label: "Redes conectadas",
        value: String(data.socials.length),
        detail: "Distribuição de audiência",
      },
    ],
  };
}

export function toThemePreset(theme: ThemeRow, selected = false): ThemePreset {
  const config = getThemeConfig(theme.config);

  return {
    id: theme.id,
    name: theme.name,
    description: theme.description ?? "Tema configurado no Supabase.",
    accent: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.backgroundColor} 100%)`,
    surface: config.surfaceColor,
    text: config.textColor,
    ring: `${config.primaryColor}33`,
    selected,
  };
}
