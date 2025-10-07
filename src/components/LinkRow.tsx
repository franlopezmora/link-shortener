"use client";
import { useState } from "react";
import { useToast } from "./Toaster";
import { useRouter } from "next/navigation";
import { isValidSlug, isValidUrl } from "@/lib/validators";
import Modal from "./Modal";
import QRModal from "./QRModal";

type Props = { id: string; slug: string; url: string; visits?: number | null; expiresAt?: Date | null };

export default function LinkRow({ id, slug, url, visits = 0, expiresAt }: Props) {
  const [editing, setEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [formSlug, setFormSlug] = useState(slug);
  const [formUrl, setFormUrl] = useState(url);
  const [formExpires, setFormExpires] = useState<string>(expiresAt ? new Date(expiresAt).toISOString().slice(0,16) : "");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  async function handleDelete() {
    if (!confirm("¿Eliminar link?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      toast("Link eliminado", "Listo");
      router.refresh();
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error eliminando el link", "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (formSlug !== slug && !isValidSlug(formSlug)) return toast("Slug inválido", "Validación");
    if (formUrl !== url && !isValidUrl(formUrl)) return toast("URL inválida", "Validación");

    setLoading(true);
    try {
      const body: { slug?: string; url?: string; expiresAt?: string | null } = {};
      if (formSlug !== slug) body.slug = formSlug;
      if (formUrl !== url) body.url = formUrl;
      if (formExpires !== (expiresAt ? new Date(expiresAt).toISOString().slice(0,16) : "")) {
        body.expiresAt = formExpires || null;
      }

      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast("Cambios guardados", "Listo");
        setEditing(false);
        router.refresh();
      } else if (res.status === 409) {
        toast("Ese slug ya está en uso", "Conflicto");
      } else if (res.status === 400) {
        toast(await res.text() || "Datos inválidos", "Validación");
      } else if (res.status === 403) {
        toast("No tenés permisos para editar este link", "Prohibido");
      } else {
        toast("Error guardando cambios", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const text = `${base}/${slug}`;
    await navigator.clipboard.writeText(text);
    toast("Copiado al portapapeles", text);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {!editing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">/{slug}</h3>
                  <p className="text-slate-600 text-sm break-all">{url}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{visits ?? 0} visitas</span>
                </div>
                {expiresAt && (
                  <div className={`flex items-center gap-1 ${isExpired ? 'text-red-500' : 'text-slate-500'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{isExpired ? 'Expirado' : `Expira: ${new Date(expiresAt).toLocaleDateString()}`}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy} 
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copiar
          </button>
          
          <button
            onClick={() => setShowQR(true)}
            className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            title="Ver QR"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR
          </button>
          
          <button 
            onClick={() => setEditing(true)} 
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {loading ? "..." : "Borrar"}
          </button>
        </div>
      </div>

      <Modal open={editing} onClose={() => {
        setEditing(false);
        setFormSlug(slug);
        setFormUrl(url);
        setFormExpires(expiresAt ? new Date(expiresAt).toISOString().slice(0,16) : "");
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
            <input
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="mi-slug"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isValidSlug(formSlug) ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
            />
            {!isValidSlug(formSlug) && (
              <p className="text-sm text-red-600 mt-1">3–100 chars, a–z, 0–9 y guiones</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">URL</label>
            <input
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://tu-url.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isValidUrl(formUrl) ? "border-red-300 bg-red-50" : "border-slate-300"
              }`}
            />
            {!isValidUrl(formUrl) && (
              <p className="text-sm text-red-600 mt-1">Debe empezar con http:// o https://</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha de expiración</label>
            <input
              type="datetime-local"
              value={formExpires}
              onChange={(e)=>setFormExpires(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setEditing(false);
                setFormSlug(slug);
                setFormUrl(url);
                setFormExpires(expiresAt ? new Date(expiresAt).toISOString().slice(0,16) : "");
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !isValidSlug(formSlug) || !isValidUrl(formUrl)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <QRModal 
        open={showQR} 
        onClose={() => setShowQR(false)} 
        slug={slug}
        title={`Código QR para /${slug}`}
      />
    </div>
  );
}
