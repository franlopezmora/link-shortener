"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import { isValidSlug, isValidUrl } from "@/lib/validation/validators";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/Modal";
import { Button, Input } from "@/components/common";
import { CloseIcon, PlusIcon } from "@/components/icons";
import MultiTagSelector from "@/components/ui/MultiTagSelector";
import CreateTagModal from "./CreateTagModal";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface CreateLinkModalProps {
  open: boolean;
  onClose: () => void;
  tags?: Tag[];
}

export default function CreateLinkModal({ open, onClose, tags = [] }: CreateLinkModalProps) {
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("https://");
  const [description, setDescription] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [touchedUrl, setTouchedUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const slugErr = touchedSlug && !isValidSlug(slug) ? "3–100 chars, a–z, 0–9 y guiones" : "";
  const urlErr = touchedUrl && !isValidUrl(url) ? "Debe empezar con http:// o https://" : "";

  // Generar slug aleatorio
  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSlug(result);
    setTouchedSlug(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar primero sin marcar como touched
    const slugValid = isValidSlug(slug);
    const urlValid = isValidUrl(url);
    
    // Solo marcar como touched si hay errores
    if (!slugValid) setTouchedSlug(true);
    if (!urlValid) setTouchedUrl(true);
    
    // Si hay errores, no continuar
    if (!slugValid || !urlValid) return;

    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          slug, 
          url, 
          description: description.trim() || undefined,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined
        }),
      });

      if (res.ok) {
        // Resetear formulario
        setSlug("");
        setUrl("https://");
        setDescription("");
        setSelectedTagIds([]);
        setTouchedSlug(false);
        setTouchedUrl(false);
        toast("Link creado", `/${slug}`);
        router.refresh();
        onClose();
      } else if (res.status === 409) {
        toast("Ese slug ya está en uso", "Conflicto");
      } else if (res.status === 403) {
        toast("Límite alcanzado", "Máximo 10 links por usuario");
      } else {
        toast(await res.text() || "Error al crear", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Resetear formulario al cerrar
    setSlug("");
    setUrl("https://");
    setDescription("");
    setSelectedTagIds([]);
    setTouchedSlug(false);
    setTouchedUrl(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Crear nuevo link">
      <form onSubmit={handleCreate} className="space-y-6">
        {/* Destination URL */}
        <div>
          <Input
            label="URL de destino:"
            value={url}
            onChange={setUrl}
            placeholder="https://"
            error={urlErr}
            type="url"
          />
        </div>

        {/* Short link */}
        <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   Link corto:
                 </label>
          <div className="flex gap-2">
            <Input
              value={slug}
              onChange={setSlug}
              placeholder="hfbn68"
              error={slugErr}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={generateRandomSlug}
              variant="secondary"
              className="px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Aleatorio
              </div>
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Descripción (opcional):
          </label>
                 <textarea
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   placeholder="Ingresa una descripción"
                   rows={3}
                   className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                 />
        </div>

        {/* Etiquetas */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
            Etiquetas (opcional):
          </label>
          <MultiTagSelector
            tags={tags}
            selectedTagIds={selectedTagIds}
            onTagSelect={setSelectedTagIds}
            onCreateTag={() => setShowCreateTagModal(true)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-8 mt-8">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            variant="primary"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Crear
            </div>
          </Button>
        </div>
      </form>

      {/* Create Tag Modal */}
      <CreateTagModal
        open={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
      />
    </Modal>
  );
}
