"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/config";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/validators/auth";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getSafeNextPath(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/dashboard";
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
  const nextPath = getSafeNextPath(getString(formData, "next"));
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
      error: error.message,
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
    buildRedirect("/register", { error: error.message });
  }

  if (!data.session) {
    buildRedirect("/login", {
      success: "Conta criada. Verifique seu e-mail para confirmar o acesso.",
    });
  }

  redirect("/dashboard");
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
