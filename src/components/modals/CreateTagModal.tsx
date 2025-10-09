"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/Modal";
import { Button, Input } from "@/components/common";

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateTagModal({ open, onClose, onSuccess }: CreateTagModalProps) {
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagName.trim()) {
      toast("El nombre de la etiqueta es obligatorio", "Validación");
      return;
    }

    if (tagName.trim().length > 15) {
      toast("El nombre de la etiqueta no puede tener más de 15 caracteres", "Validación");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName.trim() }),
      });

      if (res.ok) {
        setTagName("");
        toast("Etiqueta creada", tagName);
        router.refresh();
        onClose();
        onSuccess?.(); // Llamar callback de éxito si existe
      } else if (res.status === 409) {
        toast("Esa etiqueta ya existe", "Conflicto");
      } else {
        toast(await res.text() || "Error al crear etiqueta", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTagName("");
    onClose();
  };

  // Funcionalidad Enter para crear etiqueta
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && !loading && tagName.trim() && tagName.trim().length <= 15) {
        e.preventDefault();
        handleCreate(e as any);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, tagName, handleCreate]);

  return (
    <Modal open={open} onClose={handleClose} title="Crear nueva etiqueta">
      <form onSubmit={handleCreate} className="space-y-3">
        <div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Crea una nueva etiqueta para organizar tus links.
          </p>
          
          <Input
            label="Nombre de la etiqueta:"
            value={tagName}
            onChange={setTagName}
            placeholder="ej: trabajo, personal (máx. 15 caracteres)"
            maxLength={15}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !tagName.trim() || tagName.trim().length > 15}
            loading={loading}
            variant="primary"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Crear Etiqueta
            </div>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
