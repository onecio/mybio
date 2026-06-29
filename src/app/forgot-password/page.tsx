import Link from "next/link";

import { forgotPasswordAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, TextInput } from "@/components/ui/field";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="recuperação"
      title="Recupere o acesso sem perder o ritmo."
      description="Fluxo preparado para redefinição de senha com UX clara, visual premium e estrutura pronta para integração real."
      footer={
        <p>
          Lembrou da senha?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Voltar para o login
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          acesso rápido
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Redefinir senha
        </h2>
        <p className="text-sm leading-7 text-stone-600">
          Informe seu e-mail para receber o link de recuperação do Supabase e concluir a troca
          de senha.
        </p>
      </div>

      <form action={forgotPasswordAction} className="grid gap-4">
        <StatusMessage error={params.error} success={params.success} />
        <Field label="E-mail">
          <TextInput type="email" name="email" placeholder="voce@exemplo.com" required />
        </Field>
        <SubmitButton label="Enviar instruções" pendingLabel="Enviando..." size="lg" className="mt-2" />
      </form>
    </AuthShell>
  );
}
