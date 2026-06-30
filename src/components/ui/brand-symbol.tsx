import { cn } from "@/lib/utils";

interface BrandSymbolProps {
  className?: string;
}

export function BrandSymbol({ className }: BrandSymbolProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Símbolo MyBio"
      className={cn("size-6", className)}
    >
      <path
        d="M24 5.5c9.6 0 17.5 7.8 17.5 17.5S33.6 40.5 24 40.5 6.5 32.7 6.5 23 14.4 5.5 24 5.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
      />
      <path
        d="M15.2 25.1c5.7-9.7 14.1-12.8 20-8.7-2 9.1-8.5 15.3-18.5 16.2 1.2-4.5 4.5-8 9.9-10.6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
    </svg>
  );
}
