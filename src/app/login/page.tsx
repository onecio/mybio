import Link from "next/link";

import { loginAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
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
      title="Entre no seu painel premium."
      description="Acesse sua página MyBio, acompanhe seus links e refine sua presença digital com uma interface elegante."
      footer={
        <p>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-stone-950">
            Criar agora
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          login seguro
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Bem-vindo de volta
        </h2>
        <p className="text-sm leading-7 text-stone-600">
          Faça login com Supabase para acessar seu dashboard, editar sua página pública e
          acompanhar cliques reais.
        </p>
      </div>

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
          <p className="text-stone-500">Sessão segura com cookies SSR do Supabase.</p>
          <Link href="/forgot-password" className="font-semibold text-stone-950">
            Esqueci minha senha
          </Link>
        </div>
        <SubmitButton label="Entrar no painel" pendingLabel="Entrando..." size="lg" className="mt-2" />
      </form>
    </AuthShell>
  );
}
