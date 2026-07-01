export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "x"
  | "spotify"
  | "dribbble"
  | "github";

export type DashboardSection =
  | "dashboard"
  | "profile"
  | "links"
  | "socials"
  | "themes"
  | "share"
  | "analytics"
  | "settings";

export interface NavItem {
  label: string;
  href: string;
  section?: DashboardSection;
  description?: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  clicks: number;
  featured?: boolean;
  active: boolean;
}

export interface SocialLink {
  platform: SocialPlatform;
  handle: string;
  url: string;
  followers: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  accent: string;
  surface: string;
  text: string;
  ring: string;
  selected?: boolean;
}

export interface Stat {
  label: string;
  value: string;
  detail?: string;
}

export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: "up" | "steady";
  detail: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  eyebrow: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ShowcasePage {
  title: string;
  category: string;
  accent: string;
  description: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
}

export interface UserProfile {
  name: string;
  username: string;
  headline: string;
  bio: string;
  avatar: string;
  location: string;
  verified: boolean;
  monthlyViews: string;
  conversionRate: string;
  links: LinkItem[];
  socials: SocialLink[];
  stats: Stat[];
}
