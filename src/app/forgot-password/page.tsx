import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";

export default function ForgotPasswordPage() {
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
          Informe seu e-mail e enviaremos um fluxo de recuperação assim que o backend estiver
          conectado.
        </p>
      </div>

      <form className="grid gap-4">
        <Field label="E-mail">
          <TextInput type="email" placeholder="voce@exemplo.com" />
        </Field>
        <Button type="submit" size="lg" className="mt-2">
          Enviar instruções
        </Button>
      </form>
    </AuthShell>
  );
}
