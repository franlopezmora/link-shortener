"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; title?: string; message: string };
type Ctx = { toast: (message: string, title?: string) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToasterProvider>");
  return ctx.toast;
}

export default function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, title?: string) => {
    const id = crypto.randomUUID();
    const t: Toast = { id, message, title };
    setItems((prev) => [t, ...prev]);
    // auto-close
    setTimeout(() => remove(id), 3200);
  }, [remove]);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed z-50 top-4 right-4 flex flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="w-80 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-3 shadow-lg shadow-black/10 dark:shadow-black/20 text-sm"
          >
            {t.title && <div className="font-medium mb-1 text-slate-900 dark:text-white">{t.title}</div>}
            <div className="text-gray-700 dark:text-slate-300">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
