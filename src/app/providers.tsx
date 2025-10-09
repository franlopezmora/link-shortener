"use client";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "@/components/ui/Toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToasterProvider>{children}</ToasterProvider>
    </SessionProvider>
  );
}
