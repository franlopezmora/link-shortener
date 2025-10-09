"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import { isValidSlug, isValidUrl } from "@/lib/validation/validators";
import Modal from "@/components/modals/Modal";
import QRModal from "@/components/modals/QRModal";
import { formatDateSpanish } from "@/lib/utils/dateUtils";
import { Card, IconButton, Button, Input } from "@/components/common";
import { LinkIcon, EyeIcon, ClockIcon, CopyIcon, QRIcon, EditIcon, DeleteIcon, WarningIcon } from "@/components/icons";

type Props = { 
  id: string; 
  slug: string; 
  url: string; 
  visits?: number | null; 
  expiresAt?: Date | null;
  description?: string | null;
  tags?: {
    id: string;
    name: string;
    color?: string | null;
  }[];
};

export default function LinkRow({ id, slug, url, visits = 0, expiresAt, description, tags = [] }: Props) {
  const [editing, setEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState("");
  const [formSlug, setFormSlug] = useState(slug);
  const [formUrl, setFormUrl] = useState(url);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : false;

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      toast("Link eliminado", "Listo");
      setShowDelete(false);
      setDeleteConfirmSlug("");
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
      const body: { slug?: string; url?: string } = {};
      if (formSlug !== slug) body.slug = formSlug;
      if (formUrl !== url) body.url = formUrl;

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
    <Card className="p-6" hover>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LinkIcon className="w-5 h-5 text-blue-600" />
              </div>
                     <div className="flex-1">
                       <h3 className="font-semibold text-slate-900 dark:text-white text-lg">/{slug}</h3>
                       <p className="text-slate-600 dark:text-slate-400 text-sm break-all">{url}</p>
                     </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span>{visits ?? 0} visitas</span>
              </div>
              {expiresAt && (
                <div className={`flex items-center gap-1 ${isExpired ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  <ClockIcon className="w-4 h-4" />
                  <span>{isExpired ? 'Expirado' : `Expira: ${formatDateSpanish(new Date(expiresAt))}`}</span>
                </div>
              )}
            </div>
            
            {/* Descripción */}
            {description && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <p className="line-clamp-2">{description}</p>
              </div>
            )}
            
            {/* Etiquetas */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color || "#6366f1" }}
                    />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            onClick={handleCopy}
            title="Copiar link"
            variant="secondary"
          >
            <CopyIcon />
          </IconButton>
          
          <IconButton
            onClick={() => setShowQR(true)}
            title="Ver código QR"
            variant="ghost"
            className="!bg-purple-100 hover:!bg-purple-200 !text-purple-700 focus:!ring-purple-500"
          >
            <QRIcon />
          </IconButton>
          
          <IconButton
            onClick={() => setEditing(true)}
            title="Editar link"
            variant="primary"
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            onClick={() => setShowDelete(true)}
            disabled={loading}
            loading={loading}
            title="Eliminar link"
            variant="danger"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      <Modal open={editing} onClose={() => {
        setEditing(false);
        setFormSlug(slug);
        setFormUrl(url);
      }}>
        <div className="space-y-4">
          <Input
            label="Slug"
            value={formSlug}
            onChange={setFormSlug}
            placeholder="mi-slug"
            error={!isValidSlug(formSlug) ? "3–100 chars, a–z, 0–9 y guiones" : undefined}
          />
          
          <Input
            label="URL"
            value={formUrl}
            onChange={setFormUrl}
            placeholder="https://tu-url.com"
            type="url"
            error={!isValidUrl(formUrl) ? "Debe empezar con http:// o https://" : undefined}
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => {
                setEditing(false);
                setFormSlug(slug);
                setFormUrl(url);
              }}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !isValidSlug(formSlug) || !isValidUrl(formUrl)}
              loading={loading}
              variant="primary"
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </Modal>

      <QRModal 
        open={showQR} 
        onClose={() => setShowQR(false)} 
        slug={slug}
        title={`Código QR para /${slug}`}
      />

      <Modal 
        open={showDelete} 
        onClose={() => {
          setShowDelete(false);
          setDeleteConfirmSlug("");
        }}
        title={`Eliminar /${slug}`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <WarningIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Esta acción no se puede deshacer</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-2">
              Para confirmar la eliminación, escribí el nombre del link:
            </p>
            <p className="font-mono text-sm text-red-900 bg-red-100 px-2 py-1 rounded">
              /{slug}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Escribí <span className="font-bold">{slug}</span> para confirmar:
            </label>
            <input
              type="text"
              value={deleteConfirmSlug}
              onChange={(e) => setDeleteConfirmSlug(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => {
                setShowDelete(false);
                setDeleteConfirmSlug("");
              }}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading || deleteConfirmSlug !== slug}
              loading={loading}
              variant="danger"
            >
              {loading ? "Eliminando..." : "Eliminar link"}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
