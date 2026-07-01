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
      title="Recuperar acesso"
      description="Enviaremos um link de redefinição para seu e-mail."
      footer={
        <p>
          Lembrou da senha?{" "}
          <Link href="/login" className="font-semibold text-stone-950">
            Voltar para o login
          </Link>
        </p>
      }
    >
      <form action={forgotPasswordAction} className="grid gap-4">
        <StatusMessage error={params.error} success={params.success} />
        <Field label="E-mail">
          <TextInput type="email" name="email" placeholder="voce@exemplo.com" required />
        </Field>
        <SubmitButton label="Enviar link" pendingLabel="Enviando..." size="lg" className="mt-2 w-full" />
      </form>
    </AuthShell>
  );
}
