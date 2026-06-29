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
    "bg-[linear-gradient(135deg,var(--amber-500),#ffdca8)] text-stone-950 shadow-[0_20px_60px_-22px_rgba(245,158,11,0.7)] hover:-translate-y-0.5",
  secondary:
    "border border-white/70 bg-white/80 text-stone-900 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.3)] hover:bg-white",
  ghost:
    "text-stone-700 hover:bg-white/70",
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
    "inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.02em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-60",
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
