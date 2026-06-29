import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  username: z
    .string()
    .min(3, "Username muito curto.")
    .regex(/^[a-z0-9_-]+$/, "Use apenas letras minúsculas, números, hífen e underscore."),
  headline: z.string().min(3, "Crie um título claro para sua página.").max(120),
  bio: z.string().min(24, "Escreva uma bio com mais contexto.").max(280),
  location: z.string().max(80).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
