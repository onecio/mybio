import { Gem } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  className?: string;
}

export function BrandMark({ href = "/", className }: BrandMarkProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex size-11 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#f59e0b_0%,#a7f3d0_55%,#bfdbfe_100%)] text-stone-950 shadow-[0_12px_30px_-18px_rgba(245,158,11,0.8)]">
        <Gem className="size-5" />
      </span>
      <span className="flex flex-col">
        <span className="font-display text-2xl leading-none tracking-[-0.04em] text-stone-950">
          MyBio
        </span>
        <span className="-mt-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-stone-500">
          premium links
        </span>
      </span>
    </span>
  );

  return <Link href={href}>{content}</Link>;
}
