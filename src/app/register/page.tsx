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
      title="Criar conta"
      description="Publique seus links em poucos minutos."
      footer={
        <p>
          Já possui uma conta?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Entrar
          </Link>
        </p>
      }
    >
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
        <SubmitButton label="Criar conta" pendingLabel="Criando conta..." size="lg" className="mt-2 w-full" />
      </form>

      <SocialLogin />
    </AuthShell>
  );
}
