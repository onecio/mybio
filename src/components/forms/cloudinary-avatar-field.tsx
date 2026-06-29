/* eslint-disable @next/next/no-img-element */
"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, RefreshCw, UploadCloud } from "lucide-react";

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
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";
const isUploadEnabled = Boolean(cloudName && uploadPreset);
const uploadEndpoint = cloudName
  ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  : "";

export function CloudinaryAvatarField({ initialValue }: CloudinaryAvatarFieldProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const initials = useMemo(() => {
    const urlValue = avatarUrl.trim();

    if (!urlValue) {
      return "MB";
    }

    try {
      const parsed = new URL(urlValue);
      const hostname = parsed.hostname.replace(/^www\./, "");

      return hostname.slice(0, 2).toUpperCase();
    } catch {
      return "AV";
    }
  }, [avatarUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !isUploadEnabled) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setStatusMessage("Enviando imagem para o Cloudinary...");

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
      setStatusMessage("Avatar enviado com sucesso. A URL final já foi preenchida no formulário.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha no upload. Continue com uma URL manual para não interromper a edição.",
      );
      setStatusMessage("");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-4 rounded-[1.7rem] border border-stone-200/70 bg-stone-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
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
          <label
            className={cn(
              "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold tracking-[-0.02em] transition-all",
              isUploadEnabled
                ? "bg-[linear-gradient(135deg,var(--amber-500),#ffdca8)] text-stone-950 shadow-[0_20px_60px_-22px_rgba(245,158,11,0.7)] hover:-translate-y-0.5"
                : "cursor-not-allowed border border-stone-200/80 bg-white/70 text-stone-400",
            )}
          >
            {isUploading ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {isUploading ? "Enviando..." : "Enviar imagem"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={!isUploadEnabled || isUploading}
            />
          </label>
          <p className="text-xs text-stone-400">
            {isUploadEnabled
              ? "Use arquivos leves para manter a edição mais rápida."
              : "Quando cloud name e upload preset forem publicados, o envio direto será liberado."}
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
