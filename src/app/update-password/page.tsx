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
      title="Nova senha"
      description="Use pelo menos 8 caracteres."
      footer={
        <p>
          Precisa voltar?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Ir para o login
          </Link>
        </p>
      }
    >
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
        <SubmitButton label="Salvar nova senha" pendingLabel="Atualizando..." size="lg" className="mt-2 w-full" />
      </form>
    </AuthShell>
  );
}
