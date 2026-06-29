import { z } from "zod";

export const themeSelectionSchema = z.object({
  presetId: z.string().min(1, "Selecione um tema."),
  accentHex: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Use uma cor hexadecimal válida."),
});

export type ThemeSelectionInput = z.infer<typeof themeSelectionSchema>;
