import Link from "next/link";

import { updatePasswordAction } from "@/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { StatusMessage } from "@/components/forms/status-message";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field, TextInput } from "@/components/ui/field";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="nova senha"
      title="Defina uma nova senha com segurança."
      description="Se você veio do e-mail de recuperação, finalize aqui a troca de senha para voltar ao painel."
      footer={
        <p>
          Precisa voltar?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Ir para o login
          </Link>
        </p>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          recuperação ativa
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">
          Atualize sua senha
        </h2>
        <p className="text-sm leading-7 text-stone-600">
          Use uma senha forte com pelo menos 8 caracteres para concluir o processo.
        </p>
      </div>

      <form action={updatePasswordAction} className="grid gap-4">
        <StatusMessage error={params.error} success={params.success} />
        <Field label="Nova senha">
          <TextInput type="password" name="password" placeholder="Digite a nova senha" required />
        </Field>
        <Field label="Confirmar senha">
          <TextInput
            type="password"
            name="passwordConfirmation"
            placeholder="Repita a nova senha"
            required
          />
        </Field>
        <SubmitButton label="Atualizar senha" pendingLabel="Atualizando..." size="lg" className="mt-2" />
      </form>
    </AuthShell>
  );
}
