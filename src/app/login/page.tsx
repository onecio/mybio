import Link from "next/link";

import { loginAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SocialLogin } from "@/components/auth/social-login";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, TextInput } from "@/components/ui/field";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="acesso"
      title="Entrar no MyBio"
      description="Gerencie seus links e sua página pública."
      footer={
        <p>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-stone-950">
            Criar agora
          </Link>
        </p>
      }
    >
      <form action={loginAction} className="grid gap-4">
        <StatusMessage error={params.error} success={params.success} />
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <Field label="E-mail">
          <TextInput type="email" name="email" placeholder="voce@exemplo.com" required />
        </Field>
        <Field label="Senha">
          <TextInput type="password" name="password" placeholder="Digite sua senha" required />
        </Field>
        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span />
          <Link href="/forgot-password" className="font-semibold text-stone-950">
            Esqueci minha senha
          </Link>
        </div>
        <SubmitButton label="Entrar" pendingLabel="Entrando..." size="lg" className="mt-2 w-full" />
      </form>

      <SocialLogin nextPath={params.next} />
    </AuthShell>
  );
}
