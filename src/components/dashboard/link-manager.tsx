"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Copy, ExternalLink, GripVertical, Pencil, Star } from "lucide-react";

import {
  deleteLinkAction,
  reorderLinksAction,
  toggleLinkAction,
  updateLinkAction,
} from "@/actions/dashboard";
import { IconPicker } from "@/components/forms/icon-picker";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import type { DashboardLink } from "@/lib/queries/mybio";
import { renderPlatformIcon } from "@/lib/platform-icons";

interface LinkManagerProps {
  initialLinks: DashboardLink[];
}

const inputClassName =
  "h-11 w-full rounded-xl border border-[var(--brand-line)] bg-white px-3 text-sm text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-petrol)] focus:ring-2 focus:ring-[var(--brand-petrol)]/15";

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function SortableLink({ link }: { link: DashboardLink }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });
  const [copied, setCopied] = useState(false);

  async function copyLinkUrl() {
    await navigator.clipboard.writeText(link.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-[1.35rem] border bg-[var(--brand-surface)] p-4 transition-shadow ${
        isDragging
          ? "z-20 border-[var(--brand-petrol)] shadow-[0_24px_70px_-34px_rgba(10,61,62,0.62)]"
          : "border-[var(--brand-line)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={`Reordenar ${link.title}`}
          className="mt-1 grid size-10 shrink-0 touch-none place-items-center rounded-xl border border-[var(--brand-line)] bg-white text-[var(--brand-muted)] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl border border-[var(--brand-line)] bg-white text-[var(--brand-petrol-deep)]">
              {renderPlatformIcon(link.icon, "size-4")}
            </span>
            <h2 className="truncate text-base font-semibold text-[var(--brand-ink)] sm:text-lg">
              {link.title}
            </h2>
            {link.is_featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f1dfd3] px-2.5 py-1 text-[0.68rem] font-semibold text-[#7e3f25]">
                <Star className="size-3" /> Destaque
              </span>
            ) : null}
            <span
              className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                link.is_active
                  ? "bg-[var(--brand-sage-soft)] text-[var(--brand-petrol-deep)]"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              {link.is_active ? "Ativo" : "Pausado"}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-[var(--brand-muted)]">{link.hostname}</p>
          <p className="mt-2 text-xs text-stone-500">{link.clicks.toLocaleString("pt-BR")} cliques</p>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--brand-line)] pt-3">
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={copyLinkUrl}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-[var(--brand-line)] bg-white px-4 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-petrol)]"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "URL copiada" : "Copiar URL"}
          </button>
          <Button href={link.url} variant="secondary" className="gap-2">
            Abrir <ExternalLink className="size-4" />
          </Button>
          <form action={toggleLinkAction}>
            <input type="hidden" name="linkId" value={link.id} />
            <input type="hidden" name="nextValue" value={String(!link.is_active)} />
            <SubmitButton
              label={link.is_active ? "Pausar" : "Ativar"}
              pendingLabel="Atualizando..."
              variant="secondary"
            />
          </form>
        </div>

        <details className="group mt-3">
          <summary className="inline-flex h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-[1rem] border border-[var(--brand-line)] bg-white px-5 text-sm font-semibold text-[var(--brand-ink)] transition hover:border-[var(--brand-petrol)]">
            <Pencil className="size-4" /> Edição rápida
          </summary>
          <form
            action={updateLinkAction}
            className="mt-3 grid gap-4 rounded-[1.25rem] border border-[var(--brand-line)] bg-[#f4f2ec] p-4 sm:grid-cols-2"
          >
            <input type="hidden" name="linkId" value={link.id} />
            <label className="grid gap-1.5 text-sm font-medium">
              Título
              <input className={inputClassName} name="title" defaultValue={link.title} required />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              URL
              <input className={inputClassName} name="url" type="url" defaultValue={link.url} required />
            </label>
            <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="active" defaultChecked={link.is_active} className="size-4 accent-[var(--brand-petrol)]" />
                Link ativo
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="featured" defaultChecked={link.is_featured} className="size-4 accent-[var(--brand-petrol)]" />
                Destacar
              </label>
            </div>

            <details className="sm:col-span-2">
              <summary className="cursor-pointer text-sm font-semibold text-stone-500">
                Ajustes avançados
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                  Descrição
                  <input className={inputClassName} name="description" defaultValue={link.description} maxLength={140} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Thumbnail
                  <input className={inputClassName} name="thumbnailUrl" type="url" defaultValue={link.thumbnail_url ?? ""} />
                </label>
                <div className="sm:col-span-2">
                  <IconPicker name="icon" defaultValue={link.icon ?? "link"} />
                </div>
                <label className="grid gap-1.5 text-sm font-medium">
                  Publicar em
                  <input className={inputClassName} name="scheduledAt" type="datetime-local" defaultValue={toLocalDateTime(link.scheduled_at)} />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Expirar em
                  <input className={inputClassName} name="expiresAt" type="datetime-local" defaultValue={toLocalDateTime(link.expires_at)} />
                </label>
              </div>
            </details>

            <div className="sm:col-span-2">
              <SubmitButton label="Salvar alterações" pendingLabel="Salvando..." />
            </div>
          </form>

          <form action={deleteLinkAction} className="mt-3">
            <input type="hidden" name="linkId" value={link.id} />
            <SubmitButton label="Remover link" pendingLabel="Removendo..." variant="ghost" />
          </form>
        </details>
      </div>
    </article>
  );
}

export function LinkManager({ initialLinks }: LinkManagerProps) {
  const [links, setLinks] = useState(initialLinks);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextLinks = arrayMove(links, oldIndex, newIndex);
    setLinks(nextLinks);
    setMessage(null);
    startTransition(async () => {
      const result = await reorderLinksAction(nextLinks.map((link) => link.id));
      setMessage(result.ok ? "Nova ordem salva." : result.error ?? "Falha ao reordenar.");
      if (!result.ok) setLinks(links);
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--brand-muted)]">
          Arraste pelo controle lateral ou use o teclado para reorganizar.
        </p>
        <span className="text-xs font-semibold text-[var(--brand-petrol)]">
          {isPending ? "Salvando..." : message}
        </span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-3">
            {links.map((link) => <SortableLink key={link.id} link={link} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
