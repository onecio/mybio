/* eslint-disable @next/next/no-img-element */
"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, Trash2, UploadCloud } from "lucide-react";

import { TextInput } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: {
    message?: string;
  };
}

interface CloudinaryAvatarFieldProps {
  initialValue?: string | null;
  fallbackLabel?: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";
const isUploadEnabled = Boolean(cloudName && uploadPreset);
const uploadEndpoint = cloudName
  ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  : "";

function getInitialsFromLabel(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "MB";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function CloudinaryAvatarField({
  initialValue,
  fallbackLabel = "Meu MyBio",
}: CloudinaryAvatarFieldProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialValue ?? "");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const previewUrl = localPreviewUrl || avatarUrl;

  const initials = useMemo(() => {
    const urlValue = previewUrl.trim();

    if (!urlValue) {
      return getInitialsFromLabel(fallbackLabel);
    }

    try {
      const parsed = new URL(urlValue);
      const hostname = parsed.hostname.replace(/^www\./, "");

      return hostname.slice(0, 2).toUpperCase();
    } catch {
      return getInitialsFromLabel(fallbackLabel);
    }
  }, [fallbackLabel, previewUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Selecione um arquivo de imagem válido.");
      setStatusMessage("");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Use uma imagem de até 5 MB para manter o carregamento rápido.");
      setStatusMessage("");
      event.target.value = "";
      return;
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(nextPreviewUrl);
    setErrorMessage("");
    setStatusMessage("Pré-visualização pronta. Enviando imagem...");

    if (!isUploadEnabled) {
      setStatusMessage(
        "Pré-visualização disponível apenas nesta sessão. Publique o Cloudinary para habilitar o envio direto.",
      );
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as CloudinaryUploadResponse;
      const nextUrl = payload.secure_url?.trim();

      if (!response.ok || !nextUrl) {
        throw new Error(
          payload.error?.message ??
            "Não foi possível concluir o upload agora. Você ainda pode colar a URL manualmente.",
        );
      }

      setAvatarUrl(nextUrl);
      setLocalPreviewUrl(null);
      setStatusMessage("Avatar enviado com sucesso. A URL final já foi preenchida no formulário.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha no upload. Continue com uma URL manual para não interromper a edição.",
      );
      setStatusMessage("A pré-visualização local foi mantida para conferência.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-4 rounded-[1.7rem] border border-stone-200/70 bg-stone-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview do avatar"
              className="size-20 shrink-0 rounded-[1.6rem] object-cover shadow-[0_20px_50px_-32px_rgba(15,23,42,0.45)]"
            />
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-[linear-gradient(135deg,#f59e0b_0%,#bfdbfe_100%)] text-sm font-semibold text-stone-950 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.45)]">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-semibold tracking-[-0.02em] text-stone-900">Avatar do perfil</p>
            <p className="mt-1 text-sm leading-6 text-stone-500">
              {isUploadEnabled
                ? "Envie uma imagem direto para o Cloudinary ou ajuste a URL manualmente."
                : "Cloudinary ainda não está configurado neste ambiente. Você pode seguir normalmente com uma URL manual."}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <label
              className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold tracking-[-0.02em] transition-all",
                isUploadEnabled
                  ? "bg-[linear-gradient(135deg,var(--amber-500),#ffdca8)] text-stone-950 shadow-[0_20px_60px_-22px_rgba(245,158,11,0.7)] hover:-translate-y-0.5"
                  : "border border-stone-200/80 bg-white/70 text-stone-700",
              )}
            >
              {isUploading ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
              {isUploading ? "Enviando..." : "Selecionar imagem"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                if (localPreviewUrl) {
                  URL.revokeObjectURL(localPreviewUrl);
                }
                setLocalPreviewUrl(null);
                setAvatarUrl("");
                setErrorMessage("");
                setStatusMessage("Avatar removido. Salve o perfil para publicar a alteração.");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300"
            >
              <Trash2 className="size-4" />
              Remover
            </button>
          </div>
          <p className="text-xs text-stone-400">
            {isUploadEnabled
              ? "Use imagem quadrada e leve para melhor nitidez no perfil público."
              : "O upload direto depende do Cloudinary, mas você ainda pode colar uma URL manualmente."}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="grid gap-2 text-sm text-stone-700">
          <span className="font-semibold tracking-[-0.02em] text-stone-800">URL final do avatar</span>
          <TextInput
            name="avatarUrl"
            type="url"
            inputMode="url"
            value={avatarUrl}
          onChange={(event) => {
            setAvatarUrl(event.target.value);
            setLocalPreviewUrl(null);
            setErrorMessage("");
            setStatusMessage("");
          }}
            placeholder="https://..."
          />
          <span className="text-xs text-stone-500">
            O formulário sempre salva a URL deste campo, com ou sem Cloudinary.
          </span>
        </label>

        <button
          type="button"
          onClick={() => {
            if (localPreviewUrl) {
              URL.revokeObjectURL(localPreviewUrl);
            }
            setLocalPreviewUrl(null);
            setAvatarUrl(initialValue ?? "");
            setErrorMessage("");
            setStatusMessage("");
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 text-sm font-semibold tracking-[-0.02em] text-stone-900 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.3)] transition hover:bg-white"
        >
          <RefreshCw className="size-4" />
          Restaurar valor inicial
        </button>
      </div>

      {statusMessage ? (
        <div className="flex items-start gap-2 rounded-[1.3rem] border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm leading-6 text-emerald-700">
          <ImagePlus className="mt-0.5 size-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[1.3rem] border border-amber-200/70 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-800">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
