"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/config";
import { getSafeInternalPath } from "@/lib/security/url";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/validators/auth";

const socialProviders = ["google", "github"] as const;

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha inválidos.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique também a caixa de spam.";
  }

  if (normalized.includes("email rate limit exceeded")) {
    return "O limite temporário de envio de e-mails foi atingido. Aguarde alguns minutos ou use o login social.";
  }

  if (normalized.includes("provider is not enabled") || normalized.includes("unsupported provider")) {
    return "Este provedor social ainda não está habilitado no Supabase.";
  }

  if (normalized.includes("user already registered")) {
    return "Já existe uma conta com este e-mail. Faça login para continuar.";
  }

  return message;
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function buildRedirect(pathname: string, params: Record<string, string | undefined>): never {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return redirect(query ? `${pathname}?${query}` : pathname);
}

export async function loginAction(formData: FormData) {
  const nextPath = getSafeInternalPath(getString(formData, "next"));
  const parsed = loginSchema.safeParse({
    email: getString(formData, "email"),
    password: getString(formData, "password"),
  });

  if (!parsed.success) {
    buildRedirect("/login", {
      error: parsed.error.issues[0]?.message ?? "Não foi possível validar o login.",
      next: nextPath,
    });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    buildRedirect("/login", {
      error: "Supabase não configurado. Revise as variáveis de ambiente.",
      next: nextPath,
    });
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    buildRedirect("/login", {
      error: getAuthErrorMessage(error.message),
      next: nextPath,
    });
  }

  redirect(nextPath);
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: getString(formData, "name"),
    username: getString(formData, "username").toLowerCase(),
    email: getString(formData, "email"),
    password: getString(formData, "password"),
    acceptTerms: getBoolean(formData, "acceptTerms"),
  });

  if (!parsed.success) {
    buildRedirect("/register", {
      error: parsed.error.issues[0]?.message ?? "Não foi possível validar o cadastro.",
    });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    buildRedirect("/register", {
      error: "Supabase não configurado. Revise as variáveis de ambiente.",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        user_name: parsed.data.username,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    buildRedirect("/register", { error: getAuthErrorMessage(error.message) });
  }

  if (!data.session) {
    buildRedirect("/login", {
      success: "Conta criada. Verifique seu e-mail para confirmar o acesso.",
    });
  }

  redirect("/dashboard");
}

export async function socialLoginAction(formData: FormData) {
  const provider = getString(formData, "provider");
  const nextPath = getSafeInternalPath(getString(formData, "next"));

  if (!socialProviders.includes(provider as (typeof socialProviders)[number])) {
    buildRedirect("/login", {
      error: "Provedor social inválido.",
      next: nextPath,
    });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    buildRedirect("/login", {
      error: "Supabase não configurado. Revise as variáveis de ambiente.",
      next: nextPath,
    });
  }

  const callbackUrl = new URL("/auth/callback", getSiteUrl());
  callbackUrl.searchParams.set("next", nextPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as (typeof socialProviders)[number],
    options: {
      redirectTo: callbackUrl.toString(),
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    buildRedirect("/login", {
      error: getAuthErrorMessage(error?.message ?? "Não foi possível iniciar o login social."),
      next: nextPath,
    });
  }

  redirect(data.url);
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: getString(formData, "email"),
  });

  if (!parsed.success) {
    buildRedirect("/forgot-password", {
      error: parsed.error.issues[0]?.message ?? "Informe um e-mail válido.",
    });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    buildRedirect("/forgot-password", {
      error: "Supabase não configurado. Revise as variáveis de ambiente.",
    });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/update-password`,
  });

  if (error) {
    buildRedirect("/forgot-password", { error: error.message });
  }

  buildRedirect("/forgot-password", {
    success: "Enviamos o link de recuperação. Verifique sua caixa de entrada.",
  });
}

export async function updatePasswordAction(formData: FormData) {
  const password = getString(formData, "password");
  const passwordConfirmation = getString(formData, "passwordConfirmation");

  if (password.length < 8) {
    buildRedirect("/update-password", {
      error: "A nova senha deve ter pelo menos 8 caracteres.",
    });
  }

  if (password !== passwordConfirmation) {
    buildRedirect("/update-password", {
      error: "A confirmação da senha não confere.",
    });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    buildRedirect("/update-password", {
      error: "Supabase não configurado. Revise as variáveis de ambiente.",
    });
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    buildRedirect("/update-password", { error: error.message });
  }

  buildRedirect("/login", {
    success: "Senha atualizada com sucesso. Faça login novamente.",
  });
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/login?success=Você saiu com segurança.");
}
