import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Acorta tus enlaces de forma rápida y segura",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    other: [
      { url: "/favicon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white antialiased">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
