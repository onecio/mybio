import { z } from "zod";

import { linkIconOptions, socialPlatformOptions } from "@/lib/platform-icons";
import { isSafeHttpUrl } from "@/lib/security/url";

const linkIconValues = linkIconOptions.map((option) => option.value) as [string, ...string[]];
const socialPlatformValues = socialPlatformOptions.map((option) => option.value) as [
  string,
  ...string[],
];

const publicUrlSchema = z
  .string()
  .url("Informe uma URL válida.")
  .refine(isSafeHttpUrl, "Use apenas endereços HTTP ou HTTPS.");

export const linkSchema = z.object({
  title: z.string().min(2, "Dê um nome ao link."),
  url: publicUrlSchema,
  description: z.string().max(140).optional().default(""),
  icon: z.enum(linkIconValues).optional().default("link"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  thumbnailUrl: publicUrlSchema.or(z.literal("")).optional().default(""),
  scheduledAt: z.string().optional().default(""),
  expiresAt: z.string().optional().default(""),
});

export const socialSchema = z.object({
  platform: z.enum(socialPlatformValues),
  handle: z.string().min(2, "Informe seu identificador."),
  url: publicUrlSchema,
});

export type LinkInput = z.infer<typeof linkSchema>;
export type SocialInput = z.infer<typeof socialSchema>;
