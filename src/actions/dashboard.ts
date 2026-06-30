"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { linkSchema, socialSchema } from "@/validators/link";
import { profileSchema } from "@/validators/profile";
import { themeSelectionSchema } from "@/validators/theme";

type ProfilePageRecord = Pick<
  Database["public"]["Tables"]["profile_pages"]["Row"],
  "id" | "username" | "is_published" | "theme_id"
>;
type LinkPositionRecord = Pick<Database["public"]["Tables"]["profile_links"]["Row"], "position">;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getOptionalIsoDate(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
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

async function getAuthenticatedResources() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?error=Supabase não configurado.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Sua sessão expirou. Faça login novamente.");
  }

  const { data: profilePage, error } = await supabase
    .from("profile_pages")
    .select("id, username, is_published, theme_id")
    .eq("user_id", user.id)
    .single();

  const typedProfilePage = profilePage as ProfilePageRecord | null;

  if (error || !typedProfilePage) {
    redirect("/dashboard?error=Não foi possível carregar o perfil principal.");
  }

  return { supabase, user, profilePage: typedProfilePage };
}

function revalidateDashboardRoutes(username?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/links");
  revalidatePath("/dashboard/socials");
  revalidatePath("/dashboard/themes");
  revalidatePath("/dashboard/analytics");
  revalidatePath("/dashboard/settings");

  if (username) {
    revalidatePath(`/${username}`);
  }
}

export async function saveProfileAction(formData: FormData) {
  const avatarUrl = getString(formData, "avatarUrl");
  const publishProfile = getBoolean(formData, "isPublished");
  const parsed = profileSchema.safeParse({
    name: getString(formData, "name"),
    username: getString(formData, "username").toLowerCase(),
    headline: getString(formData, "headline"),
    bio: getString(formData, "bio"),
    location: getString(formData, "location"),
  });

  if (!parsed.success) {
    buildRedirect("/dashboard/profile", {
      error: parsed.error.issues[0]?.message ?? "Não foi possível validar o perfil.",
    });
  }

  const { supabase, user, profilePage } = await getAuthenticatedResources();

  const { error: profileError } = await supabase
    .from("profiles")
    .update(
      {
        name: parsed.data.name,
        avatar_url: avatarUrl || null,
      } as never,
    )
    .eq("id", user.id);

  if (profileError) {
    buildRedirect("/dashboard/profile", { error: profileError.message });
  }

  const { error: pageError } = await supabase
    .from("profile_pages")
    .update(
      {
        username: parsed.data.username,
        title: parsed.data.headline,
        description: parsed.data.bio,
        avatar_url: avatarUrl || null,
        is_published: publishProfile,
      } as never,
    )
    .eq("id", profilePage.id);

  if (pageError) {
    buildRedirect("/dashboard/profile", { error: pageError.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  revalidateDashboardRoutes(parsed.data.username);

  buildRedirect("/dashboard/profile", {
    success: "Perfil salvo com sucesso.",
  });
}

export async function createLinkAction(formData: FormData) {
  const parsed = linkSchema.safeParse({
    title: getString(formData, "title"),
    url: getString(formData, "url"),
    description: getString(formData, "description"),
    icon: getString(formData, "icon") || "link",
    featured: getBoolean(formData, "featured"),
    active: true,
    thumbnailUrl: getString(formData, "thumbnailUrl"),
    scheduledAt: getString(formData, "scheduledAt"),
    expiresAt: getString(formData, "expiresAt"),
  });

  if (!parsed.success) {
    buildRedirect("/dashboard/links", {
      error: parsed.error.issues[0]?.message ?? "Não foi possível validar o link.",
    });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();

  const { data: lastLink } = await supabase
    .from("profile_links")
    .select("position")
    .eq("profile_id", profilePage.id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const typedLastLink = lastLink as LinkPositionRecord | null;

  const { error } = await supabase.from("profile_links").insert(
    {
      profile_id: profilePage.id,
      title: parsed.data.title,
      url: parsed.data.url,
      description: parsed.data.description,
      icon: parsed.data.icon || "link",
      thumbnail_url: parsed.data.thumbnailUrl || null,
      position: (typedLastLink?.position ?? -1) + 1,
      is_active: true,
      is_featured: parsed.data.featured,
      scheduled_at: getOptionalIsoDate(formData, "scheduledAt"),
      expires_at: getOptionalIsoDate(formData, "expiresAt"),
    } as never,
  );

  if (error) {
    buildRedirect("/dashboard/links", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/links", { success: "Novo link criado." });
}

export async function updateLinkAction(formData: FormData) {
  const linkId = getString(formData, "linkId");
  const parsed = linkSchema.safeParse({
    title: getString(formData, "title"),
    url: getString(formData, "url"),
    description: getString(formData, "description"),
    icon: getString(formData, "icon") || "link",
    featured: getBoolean(formData, "featured"),
    active: getBoolean(formData, "active"),
    thumbnailUrl: getString(formData, "thumbnailUrl"),
    scheduledAt: getString(formData, "scheduledAt"),
    expiresAt: getString(formData, "expiresAt"),
  });

  if (!linkId || !parsed.success) {
    buildRedirect("/dashboard/links", {
      error: parsed.success
        ? "Link inválido."
        : parsed.error.issues[0]?.message ?? "Não foi possível validar o link.",
    });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase
    .from("profile_links")
    .update({
      title: parsed.data.title,
      url: parsed.data.url,
      description: parsed.data.description,
      icon: parsed.data.icon || "link",
      thumbnail_url: parsed.data.thumbnailUrl || null,
      is_active: parsed.data.active,
      is_featured: parsed.data.featured,
      scheduled_at: getOptionalIsoDate(formData, "scheduledAt"),
      expires_at: getOptionalIsoDate(formData, "expiresAt"),
    } as never)
    .eq("id", linkId);

  if (error) {
    buildRedirect("/dashboard/links", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/links", { success: "Link atualizado." });
}

export async function reorderLinksAction(orderedIds: string[]) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0 || orderedIds.length > 200) {
    return { ok: false, error: "Ordem de links inválida." };
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase.rpc("reorder_profile_links", {
    ordered_ids: orderedIds,
  } as never);

  if (error) {
    return { ok: false, error: "Não foi possível salvar a nova ordem." };
  }

  revalidateDashboardRoutes(profilePage.username);
  return { ok: true };
}

export async function toggleLinkAction(formData: FormData) {
  const linkId = getString(formData, "linkId");
  const nextValue = getString(formData, "nextValue") === "true";

  if (!linkId) {
    buildRedirect("/dashboard/links", { error: "Link inválido." });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();

  const { error } = await supabase
    .from("profile_links")
    .update({ is_active: nextValue } as never)
    .eq("id", linkId);

  if (error) {
    buildRedirect("/dashboard/links", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/links", {
    success: nextValue ? "Link ativado." : "Link pausado.",
  });
}

export async function deleteLinkAction(formData: FormData) {
  const linkId = getString(formData, "linkId");

  if (!linkId) {
    buildRedirect("/dashboard/links", { error: "Link inválido." });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase.from("profile_links").delete().eq("id", linkId);

  if (error) {
    buildRedirect("/dashboard/links", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/links", { success: "Link removido." });
}

export async function createSocialAction(formData: FormData) {
  const parsed = socialSchema.safeParse({
    platform: getString(formData, "platform").toLowerCase(),
    handle: getString(formData, "handle") || "perfil",
    url: getString(formData, "url"),
  });

  if (!parsed.success) {
    buildRedirect("/dashboard/socials", {
      error: parsed.error.issues[0]?.message ?? "Não foi possível validar a rede social.",
    });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase.from("profile_socials").upsert(
    {
      profile_id: profilePage.id,
      platform: parsed.data.platform,
      url: parsed.data.url,
    } as never,
    {
      onConflict: "profile_id,platform",
    },
  );

  if (error) {
    buildRedirect("/dashboard/socials", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/socials", { success: "Rede social salva." });
}

export async function deleteSocialAction(formData: FormData) {
  const socialId = getString(formData, "socialId");

  if (!socialId) {
    buildRedirect("/dashboard/socials", { error: "Rede social inválida." });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase.from("profile_socials").delete().eq("id", socialId);

  if (error) {
    buildRedirect("/dashboard/socials", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/socials", { success: "Rede social removida." });
}

export async function selectThemeAction(formData: FormData) {
  const parsed = themeSelectionSchema.safeParse({
    presetId: getString(formData, "presetId"),
    accentHex: getString(formData, "accentHex") || "#f59e0b",
  });

  if (!parsed.success) {
    buildRedirect("/dashboard/themes", {
      error: parsed.error.issues[0]?.message ?? "Selecione um tema válido.",
    });
  }

  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase
    .from("profile_pages")
    .update({ theme_id: parsed.data.presetId } as never)
    .eq("id", profilePage.id);

  if (error) {
    buildRedirect("/dashboard/themes", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/themes", { success: "Tema aplicado com sucesso." });
}

export async function saveSettingsAction(formData: FormData) {
  const isPublished = getBoolean(formData, "isPublished");
  const { supabase, profilePage } = await getAuthenticatedResources();
  const { error } = await supabase
    .from("profile_pages")
    .update({ is_published: isPublished } as never)
    .eq("id", profilePage.id);

  if (error) {
    buildRedirect("/dashboard/settings", { error: error.message });
  }

  revalidateDashboardRoutes(profilePage.username);
  buildRedirect("/dashboard/settings", {
    success: isPublished
      ? "Página pública publicada."
      : "Página pública salva como não publicada.",
  });
}
