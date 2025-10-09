"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/Modal";
import { Button, Input } from "@/components/common";

interface EditTagModalProps {
  open: boolean;
  onClose: () => void;
  tagId: string;
  tagName: string;
  onSuccess?: () => void;
}

export default function EditTagModal({ 
  open, 
  onClose, 
  tagId, 
  tagName, 
  onSuccess 
}: EditTagModalProps) {
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Inicializar el nombre cuando se abre el modal
  useEffect(() => {
    if (open) {
      setEditName(tagName);
    }
  }, [open, tagName]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      toast("El nombre de la etiqueta es obligatorio", "Validación");
      return;
    }

    if (editName.trim().length > 15) {
      toast("El nombre de la etiqueta no puede tener más de 15 caracteres", "Validación");
      return;
    }

    if (editName.trim() === tagName) {
      toast("No hay cambios para guardar", "Información");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (res.ok) {
        toast("Etiqueta actualizada", editName);
        router.refresh();
        onClose();
        onSuccess?.(); // Llamar callback de éxito si existe
      } else if (res.status === 409) {
        toast("Esa etiqueta ya existe", "Conflicto");
      } else {
        toast(await res.text() || "Error al actualizar etiqueta", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditName(tagName); // Resetear al valor original
    onClose();
  };

  // Funcionalidad Enter para editar etiqueta
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && !loading && editName.trim() && editName.trim().length <= 15 && editName.trim() !== tagName) {
        e.preventDefault();
        handleSave(e as any);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, editName, tagName, handleSave]);

  return (
    <Modal open={open} onClose={handleClose} title={`Editar "${tagName}" etiqueta`}>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Modifica el nombre de la etiqueta. Los links asociados no se verán afectados.
          </p>
          
          <Input
            label="Nombre de la etiqueta:"
            value={editName}
            onChange={setEditName}
            placeholder="ej: trabajo, personal (máx. 15 caracteres)"
            maxLength={15}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || !editName.trim() || editName.trim().length > 15 || editName.trim() === tagName}
            loading={loading}
            variant="primary"
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
