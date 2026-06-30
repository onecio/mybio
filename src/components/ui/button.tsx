import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-petrol)] text-white shadow-[0_18px_42px_-22px_rgba(10,61,62,0.7)] hover:-translate-y-0.5 hover:bg-[var(--brand-petrol-deep)]",
  secondary:
    "border border-[var(--brand-line)] bg-[var(--brand-surface)] text-[var(--brand-ink)] shadow-[0_16px_40px_-28px_rgba(20,25,26,0.28)] hover:border-[var(--brand-petrol)]",
  ghost:
    "text-[var(--brand-muted)] hover:bg-[var(--brand-sage-soft)] hover:text-[var(--brand-ink)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-[1rem] font-semibold tracking-[-0.02em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-petrol)] disabled:pointer-events-none disabled:opacity-60",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
