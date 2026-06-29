import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-4", align === "center" && "mx-auto max-w-3xl text-center")}>
      <div>
        <Badge>{eyebrow}</Badge>
      </div>
      <div className="grid gap-3">
        <h2 className="font-display text-4xl leading-none tracking-[-0.045em] text-stone-950 md:text-5xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-stone-600 md:text-lg">{description}</p>
      </div>
    </div>
  );
}
