import { z } from "zod";

export const linkSchema = z.object({
  title: z.string().min(2, "Dê um nome ao link."),
  url: z.string().url("Informe uma URL válida."),
  description: z.string().max(140).optional().default(""),
  icon: z.string().max(40).optional().default("link"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const socialSchema = z.object({
  platform: z.enum([
    "instagram",
    "tiktok",
    "youtube",
    "linkedin",
    "x",
    "spotify",
    "dribbble",
    "github",
  ]),
  handle: z.string().min(2, "Informe seu identificador."),
  url: z.string().url("Informe uma URL válida."),
});

export type LinkInput = z.infer<typeof linkSchema>;
export type SocialInput = z.infer<typeof socialSchema>;
