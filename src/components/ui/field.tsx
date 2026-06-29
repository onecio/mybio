import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-stone-700">
      <span className="font-semibold tracking-[-0.02em] text-stone-800">{label}</span>
      {children}
      {hint ? <span className="text-xs text-stone-500">{hint}</span> : null}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 rounded-[1.1rem] border border-white/70 bg-white/80 px-4 text-sm text-stone-900 outline-none transition focus:border-amber-300 focus:bg-white focus:ring-4 focus:ring-amber-100",
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] rounded-[1.35rem] border border-white/70 bg-white/80 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-300 focus:bg-white focus:ring-4 focus:ring-amber-100",
        className,
      )}
      {...props}
    />
  );
}
