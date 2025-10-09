"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useUserTheme() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema del usuario desde la base de datos
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/user/theme")
        .then(res => res.json())
        .then(data => {
          if (data.theme) {
            setTheme(data.theme);
            applyTheme(data.theme);
          }
        })
        .catch(error => {
          console.error("Error al cargar tema del usuario:", error);
          // Fallback a localStorage si hay error
          const savedTheme = localStorage.getItem('theme') as "light" | "dark" | null;
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const fallbackTheme = savedTheme || (prefersDark ? "dark" : "light");
          setTheme(fallbackTheme);
          applyTheme(fallbackTheme);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (status === "unauthenticated") {
      // Usuario no autenticado, usar localStorage
      const savedTheme = localStorage.getItem('theme') as "light" | "dark" | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const fallbackTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(fallbackTheme);
      applyTheme(fallbackTheme);
      setIsLoading(false);
    }
  }, [status, session]);

  const applyTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);

    // Guardar en localStorage como fallback
    localStorage.setItem('theme', newTheme);

    // Si el usuario está autenticado, guardar en la base de datos
    if (status === "authenticated" && session?.user?.email) {
      try {
        await fetch("/api/user/theme", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error("Error al guardar tema del usuario:", error);
      }
    }
  };

  return {
    theme,
    toggleTheme,
    isLoading,
    isDark: theme === "dark"
  };
}
