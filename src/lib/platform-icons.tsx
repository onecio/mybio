import type { ReactNode } from "react";

import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaSoundcloud,
  FaSpotify,
  FaStore,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons/lib";
import { SiMedium, SiSubstack } from "react-icons/si";
import { BriefcaseBusiness, Link2 } from "lucide-react";

export interface PlatformIconOption {
  value: string;
  label: string;
  keywords: string[];
  icon: IconType;
}

export const linkIconOptions: PlatformIconOption[] = [
  { value: "link", label: "Link", keywords: ["url", "site", "generic"], icon: FaGlobe },
  { value: "instagram", label: "Instagram", keywords: ["reels", "social"], icon: FaInstagram },
  { value: "tiktok", label: "TikTok", keywords: ["video", "social"], icon: FaTiktok },
  { value: "youtube", label: "YouTube", keywords: ["video", "canal"], icon: FaYoutube },
  { value: "x", label: "X", keywords: ["twitter", "social"], icon: FaXTwitter },
  { value: "linkedin", label: "LinkedIn", keywords: ["curriculo", "profissional"], icon: FaLinkedin },
  { value: "facebook", label: "Facebook", keywords: ["social", "meta"], icon: FaFacebook },
  { value: "whatsapp", label: "WhatsApp", keywords: ["contato", "mensagem"], icon: FaWhatsapp },
  { value: "telegram", label: "Telegram", keywords: ["mensagem", "canal"], icon: FaTelegram },
  { value: "github", label: "GitHub", keywords: ["codigo", "repositorio"], icon: FaGithub },
  { value: "behance", label: "Behance", keywords: ["portfolio", "design"], icon: FaBehance },
  { value: "dribbble", label: "Dribbble", keywords: ["portfolio", "design"], icon: FaDribbble },
  { value: "twitch", label: "Twitch", keywords: ["stream", "live"], icon: FaTwitch },
  { value: "discord", label: "Discord", keywords: ["comunidade", "chat"], icon: FaDiscord },
  { value: "spotify", label: "Spotify", keywords: ["musica", "playlist"], icon: FaSpotify },
  { value: "soundcloud", label: "SoundCloud", keywords: ["audio", "musica"], icon: FaSoundcloud },
  { value: "medium", label: "Medium", keywords: ["blog", "artigo"], icon: SiMedium },
  { value: "substack", label: "Substack", keywords: ["newsletter", "artigo"], icon: SiSubstack },
  { value: "pinterest", label: "Pinterest", keywords: ["board", "design"], icon: FaPinterest },
  { value: "threads", label: "Threads", keywords: ["social", "meta"], icon: FaThreads },
  { value: "email", label: "E-mail", keywords: ["contato", "mail"], icon: FaEnvelope },
  { value: "website", label: "Site pessoal", keywords: ["portfolio", "home"], icon: FaGlobe },
  { value: "store", label: "Loja virtual", keywords: ["ecommerce", "venda"], icon: FaStore },
  { value: "portfolio", label: "Portfólio", keywords: ["cases", "projetos"], icon: BriefcaseBusiness },
];

export const socialPlatformOptions = linkIconOptions.filter((option) =>
  [
    "instagram",
    "tiktok",
    "youtube",
    "x",
    "linkedin",
    "facebook",
    "whatsapp",
    "telegram",
    "github",
    "behance",
    "dribbble",
    "twitch",
    "discord",
    "spotify",
    "medium",
    "substack",
    "pinterest",
    "threads",
    "email",
    "website",
    "store",
    "portfolio",
  ].includes(option.value),
);

export function getPlatformIconOption(value: string | null | undefined) {
  if (!value) {
    return linkIconOptions[0];
  }

  return (
    linkIconOptions.find((option) => option.value === value.toLowerCase()) ?? linkIconOptions[0]
  );
}

export function renderPlatformIcon(
  value: string | null | undefined,
  className = "size-4",
): ReactNode {
  const Icon = getPlatformIconOption(value).icon;

  return <Icon className={className} aria-hidden="true" />;
}

export function normalizePlatformValue(value: string | null | undefined) {
  return getPlatformIconOption(value).value;
}

export function getPlatformKeywords(value: string | null | undefined) {
  return getPlatformIconOption(value).keywords;
}

export const defaultLinkIcon = Link2;
