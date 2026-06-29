import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  username: z
    .string()
    .min(3, "Username muito curto.")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e underscore."),
  headline: z.string().min(12, "Crie uma headline mais descritiva.").max(120),
  bio: z.string().min(24, "Escreva uma bio com mais contexto.").max(280),
  location: z.string().max(80).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
