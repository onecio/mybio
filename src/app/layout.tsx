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
  title: {
    default: "MyBio Premium",
    template: "%s | MyBio Premium",
  },
  description:
    "Base premium do MyBio com landing page elegante, dashboard sofisticado e estrutura pronta para evoluir com autenticação e mídia.",
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
