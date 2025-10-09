"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UserMenu from "@/components/ui/UserMenu";
import DocsModal from "@/components/modals/DocsModal";
import APIModal from "@/components/modals/APIModal";
import { useUserTheme } from "@/hooks/useUserTheme";

export default function Header() {
  const { data: session } = useSession();
  // session is used for conditional rendering in the component
  const [showDocs, setShowDocs] = useState(false);
  const [showAPI, setShowAPI] = useState(false);
  const { isDark, toggleTheme, isLoading } = useUserTheme();

  return (
    <>
      <header className="w-full border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="font-bold text-xl text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            Link Shortener
          </Link>
          
          <div className="flex items-center gap-1">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setShowDocs(true)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-2 h-10 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Docs
              </button>
              
              <button
                onClick={() => setShowAPI(true)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-2 h-10 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                disabled={isLoading}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg px-3 py-2 h-10 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
                title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
              >
                {isLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-600 border-t-transparent"></div>
                ) : isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
            
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Modals */}
      <DocsModal open={showDocs} onClose={() => setShowDocs(false)} />
      <APIModal open={showAPI} onClose={() => setShowAPI(false)} />
    </>
  );
}
