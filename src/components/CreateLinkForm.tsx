"use client";
import { useState } from "react";
import { useToast } from "./Toaster";
import { isValidSlug, isValidUrl } from "@/lib/validators";
import { useRouter } from "next/navigation";

export default function CreateLinkForm() {
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const slugErr = touchedSlug && !isValidSlug(slug) ? "3–100 chars, a–z, 0–9 y guiones" : "";
  const urlErr = touchedUrl && !isValidUrl(url) ? "Debe empezar con http:// o https://" : "";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setTouchedSlug(true);
    setTouchedUrl(true);
    if (!isValidSlug(slug) || !isValidUrl(url)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, url, expiresAt: expiresAt || null }),
      });

      if (res.ok) {
        setSlug("");
        setUrl("");
        setExpiresAt("");
        toast("Link creado", `/${slug}`);
        router.refresh();
      } else if (res.status === 409) {
        toast("Ese slug ya está en uso", "Conflicto");
      } else {
        toast(await res.text() || "Error al crear", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCreate} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL de destino
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouchedUrl(true)}
            placeholder="https://ejemplo.com"
            className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              urlErr ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-slate-400"
            }`}
          />
          {urlErr && <p className="text-sm text-red-600 mt-2">{urlErr}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Slug personalizado
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => setTouchedSlug(true)}
            placeholder="mi-slug-personalizado"
            className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              slugErr ? "border-red-300 bg-red-50" : "border-slate-300 hover:border-slate-400"
            }`}
          />
          {slugErr && <p className="text-sm text-red-600 mt-2">{slugErr}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fecha de expiración (opcional)
        </label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-400"
        />
        <p className="text-sm text-slate-500 mt-2">
          Deja vacío para que el link no expire nunca
        </p>
      </div>

      <div className="flex justify-end">
        <button
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Link
            </>
          )}
        </button>
      </div>
    </form>
  );
}
