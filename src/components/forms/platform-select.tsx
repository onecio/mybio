"use client";

import { useMemo, useState } from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getPlatformIconOption,
  socialPlatformOptions,
  type PlatformIconOption,
} from "@/lib/platform-icons";

interface PlatformSelectProps {
  name: string;
  defaultValue?: string | null;
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

export function PlatformSelect({ name, defaultValue }: PlatformSelectProps) {
  const initialValue = getPlatformIconOption(defaultValue ?? socialPlatformOptions[0]?.value).value;
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(
    () => socialPlatformOptions.filter((option) => matchesQuery(option, query)),
    [query],
  );

  return (
    <div className="grid gap-3 rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
      <label className="flex h-11 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-500">
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

      <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto">
        {filteredOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedValue(option.value)}
              aria-pressed={isSelected}
              className={cn(
                "flex min-h-14 items-center gap-3 rounded-[1rem] border px-3 py-3 text-left transition",
                isSelected
                  ? "border-[var(--brand-petrol)] bg-white text-[var(--brand-petrol-deep)]"
                  : "border-stone-200 bg-white text-stone-700 hover:border-[var(--brand-petrol)]/35",
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-stone-50 text-base">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
