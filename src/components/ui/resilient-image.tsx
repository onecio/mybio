"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export function ResilientImage({
  src,
  alt,
  className,
  loading = "lazy",
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    // External creator assets can come from arbitrary HTTP origins.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={cn(className)}
      onError={() => setFailed(true)}
    />
  );
}
