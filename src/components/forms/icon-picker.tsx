"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getPlatformIconOption,
  linkIconOptions,
  type PlatformIconOption,
} from "@/lib/platform-icons";

interface IconPickerProps {
  name: string;
  defaultValue?: string | null;
  label?: string;
  description?: string;
}

function matchesQuery(option: PlatformIconOption, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  return [option.label, option.value, ...option.keywords].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

export function IconPicker({
  name,
  defaultValue,
  label = "Ícone",
  description = "Escolha o ícone que melhor representa o destino.",
}: IconPickerProps) {
  const initialValue = getPlatformIconOption(defaultValue).value;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(
    () => linkIconOptions.filter((option) => matchesQuery(option, query)),
    [query],
  );

  return (
    <div className="grid gap-3 rounded-[1.25rem] border border-[var(--brand-line)] bg-white p-4">
      <div className="grid gap-1">
        <p className="text-sm font-semibold text-[var(--brand-ink)]">{label}</p>
        <p className="text-xs leading-5 text-[var(--brand-muted)]">{description}</p>
      </div>

      <label className="flex h-11 items-center gap-2 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-surface)] px-3 text-sm text-[var(--brand-muted)]">
        <Search className="size-4" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar plataforma"
          className="h-full w-full bg-transparent outline-none placeholder:text-stone-400"
        />
      </label>

      <input type="hidden" name={name} value={selectedValue} />

      <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {filteredOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedValue(option.value)}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-[1rem] border px-3 py-3 text-left transition",
                isSelected
                  ? "border-[var(--brand-petrol)] bg-[var(--brand-petrol)]/6 text-[var(--brand-petrol-deep)]"
                  : "border-[var(--brand-line)] bg-[var(--brand-surface)] text-[var(--brand-ink)] hover:border-[var(--brand-petrol)]/35",
              )}
              aria-pressed={isSelected}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-base shadow-sm">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {filteredOptions.length === 0 ? (
        <p className="text-xs text-stone-500">Nenhum ícone corresponde à busca informada.</p>
      ) : null}
    </div>
  );
}
