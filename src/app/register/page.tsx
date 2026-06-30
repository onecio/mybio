import Link from "next/link";

import { registerAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialLogin } from "@/components/auth/social-login";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, TextInput } from "@/components/ui/field";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

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
          Seu perfil base é criado no Supabase junto com a página pública inicial, pronto para
          personalização no dashboard.
        </p>
      </div>

      <form action={registerAction} className="grid gap-4">
        <StatusMessage error={params.error} success={params.success} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome">
            <TextInput type="text" name="name" placeholder="Seu nome" required />
          </Field>
          <Field label="Username">
            <TextInput type="text" name="username" placeholder="meu-perfil" required />
          </Field>
        </div>
        <Field label="E-mail">
          <TextInput type="email" name="email" placeholder="voce@exemplo.com" required />
        </Field>
        <Field label="Senha">
          <TextInput type="password" name="password" placeholder="Crie uma senha segura" required />
        </Field>
        <label className="flex items-start gap-3 rounded-[1.4rem] border border-stone-200/70 bg-stone-50/70 px-4 py-3 text-sm leading-6 text-stone-600">
          <input type="checkbox" name="acceptTerms" className="mt-1 size-4 rounded border-stone-300" />
          Aceito os termos e autorizo a criação da minha conta e da minha página inicial no
          MyBio via Supabase.
        </label>
        <SubmitButton label="Criar conta premium" pendingLabel="Criando conta..." size="lg" className="mt-2" />
      </form>

      <SocialLogin />
    </AuthShell>
  );
}
