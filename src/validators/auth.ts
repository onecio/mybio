import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Informe seu nome."),
  username: z
    .string()
    .min(3, "Seu username precisa ter no mínimo 3 caracteres.")
    .regex(/^[a-z0-9_-]+$/, "Use apenas letras minúsculas, números, hífen e underscore."),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Você precisa aceitar os termos.",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
