"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import QRModal from "./QRModal";

function initialsOf(name?: string, email?: string) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase() ?? "").join("");
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

export default function UserMenu() {
  const { data: session, status } = useSession(); // "loading" | "authenticated" | "unauthenticated"
  const [open, setOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [imageError, setImageError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al clickear afuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 transition-colors duration-200 text-sm font-medium"
        >
          Google
        </button>
        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 transition-colors duration-200 text-sm font-medium"
        >
          GitHub
        </button>
      </div>
    );
  }

  const user = session!.user!;
  const fallback = initialsOf(user.name ?? "", user.email ?? "");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 hover:bg-slate-50 rounded-lg p-1 transition-colors duration-200"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.image && !imageError ? (
          <Image
            src={user.image}
            alt={user.name ?? "Avatar"}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full grid place-items-center bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-700">
            {fallback}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium text-slate-700">{user.name ?? user.email}</span>
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50"
        >
          <div className="px-3 py-2">
            <div className="text-sm font-medium truncate text-slate-900">{user.name ?? "Usuario"}</div>
            <div className="text-xs text-slate-500 truncate">{user.email}</div>
          </div>
          <div className="my-2 h-px bg-slate-100" />
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 transition-colors duration-200"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
              </svg>
              Dashboard
            </div>
          </Link>
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 transition-colors duration-200"
            role="menuitem"
            onClick={async () => {
              const origin = window.location.origin;
              await navigator.clipboard.writeText(origin);
              setOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar dominio
            </div>
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-700 transition-colors duration-200"
            role="menuitem"
            onClick={() => {
              setShowQR(true);
              setOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Ejemplo QR
            </div>
          </button>
          <div className="my-2 h-px bg-slate-100" />
          <button
            onClick={() => { setOpen(false); signOut({ callbackUrl: "/login" }); }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-colors duration-200"
            role="menuitem"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </div>
          </button>
        </div>
      )}
      
      <QRModal 
        open={showQR} 
        onClose={() => setShowQR(false)} 
        slug="demo"
        title="Ejemplo de código QR"
      />
    </div>
  );
}
