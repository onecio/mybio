import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/ui/field";

export default function LoginPage() {
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
          Use suas credenciais para voltar ao dashboard. A integração real com autenticação
          pode ser conectada depois com Supabase.
        </p>
      </div>

      <form className="grid gap-4">
        <Field label="E-mail">
          <TextInput type="email" placeholder="voce@exemplo.com" />
        </Field>
        <Field label="Senha">
          <TextInput type="password" placeholder="Digite sua senha" />
        </Field>
        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-stone-600">
            <input type="checkbox" className="size-4 rounded border-stone-300" />
            Manter conectado
          </label>
          <Link href="/forgot-password" className="font-semibold text-stone-950">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" size="lg" className="mt-2">
          Entrar no painel
        </Button>
      </form>
    </AuthShell>
  );
}
