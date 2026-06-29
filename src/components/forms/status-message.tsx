import { CircleAlert, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatusMessageProps {
  error?: string;
  success?: string;
  className?: string;
}

export function StatusMessage({ error, success, className }: StatusMessageProps) {
  if (!error && !success) {
    return null;
  }

  const isError = Boolean(error);
  const message = error ?? success ?? "";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[1.4rem] border px-4 py-3 text-sm leading-6",
        isError
          ? "border-rose-200 bg-rose-50/80 text-rose-700"
          : "border-emerald-200 bg-emerald-50/80 text-emerald-700",
        className,
      )}
    >
      {isError ? <CircleAlert className="mt-0.5 size-4 shrink-0" /> : <CircleCheck className="mt-0.5 size-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
