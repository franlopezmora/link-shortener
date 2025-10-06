import "./globals.css";
import Providers from "./providers";
import Header from "./_components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Shortener",
  description: "Acorta tus enlaces de forma rápida y segura",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
