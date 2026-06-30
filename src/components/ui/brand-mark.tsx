import Link from "next/link";

import { BrandSymbol } from "@/components/ui/brand-symbol";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  className?: string;
}

export function BrandMark({ href = "/", className }: BrandMarkProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex size-11 items-center justify-center rounded-[1.15rem] bg-[var(--brand-petrol)] text-[var(--brand-ivory)] shadow-[0_14px_32px_-20px_rgba(10,61,62,0.75)]">
        <BrandSymbol />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-2xl leading-none tracking-[-0.04em] text-stone-950">
          MyBio
        </span>
        <span className="-mt-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-petrol)]">
          presença digital
        </span>
      </span>
    </span>
  );

  return <Link href={href}>{content}</Link>;
}
