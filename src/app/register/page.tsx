import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="criar conta"
      title="Comece sua bio page com padrão premium."
      description="Cadastre-se, escolha sua estética inicial e publique uma presença forte desde o primeiro acesso."
      footer={
        <p>
          Já possui uma conta?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Entrar
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          onboarding elegante
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Crie sua conta MyBio
        </h2>
        <p className="text-sm leading-7 text-stone-600">
          A experiência já nasce pronta para integrar autenticação, armazenamento de mídia e
          personalização avançada no próximo passo.
        </p>
      </div>

      <form className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <TextInput type="text" placeholder="Seu nome" />
          </Field>
          <Field label="Username">
            <TextInput type="text" placeholder="meuperfil" />
          </Field>
        </div>
        <Field label="E-mail">
          <TextInput type="email" placeholder="voce@exemplo.com" />
        </Field>
        <Field label="Senha">
          <TextInput type="password" placeholder="Crie uma senha segura" />
        </Field>
        <label className="flex items-start gap-3 rounded-[1.4rem] border border-stone-200/70 bg-stone-50/70 px-4 py-3 text-sm leading-6 text-stone-600">
          <input type="checkbox" className="mt-1 size-4 rounded border-stone-300" />
          Aceito os termos e entendo que esta base já está pronta para futura autenticação via
          Supabase.
        </label>
        <Button type="submit" size="lg" className="mt-2">
          Criar conta premium
        </Button>
      </form>
    </AuthShell>
  );
}
