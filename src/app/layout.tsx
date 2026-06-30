import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MyBio Premium",
    template: "%s | MyBio Premium",
  },
  description:
    "Crie uma presença digital elegante, rápida e mensurável com o MyBio.",
  applicationName: "MyBio",
  icons: {
    icon: "/mybio-mark.svg",
    shortcut: "/mybio-mark.svg",
    apple: "/mybio-mark.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MyBio",
    title: "MyBio — sua presença digital, em um só lugar",
    description: "Crie uma página pública refinada para seus links, conteúdos e comunidade.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${manrope.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
