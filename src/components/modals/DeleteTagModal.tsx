"use client";
import { useEffect } from "react";
import Modal from "@/components/modals/Modal";
import { Button } from "@/components/common";

interface DeleteTagModalProps {
  open: boolean;
  onClose: () => void;
  tagName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteTagModal({ 
  open, 
  onClose, 
  tagName, 
  onConfirm, 
  loading = false 
}: DeleteTagModalProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Quitar el focus después del clic para evitar el borde azul persistente
    e.currentTarget.blur();
    onConfirm();
  };

  // Funcionalidad Enter para eliminar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Enter' && !loading) {
        e.preventDefault();
        onConfirm();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, loading, onConfirm]);

  return (
    <Modal open={open} onClose={onClose} title={`Eliminar "${tagName}" etiqueta`}>
      <div className="space-y-6">
        <div>
          <p className="text-slate-600">
            Eliminar la etiqueta no eliminará los links asociados a ella.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <button
            onClick={handleClick}
            disabled={loading}
            className="w-34 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-700 flex items-center justify-center"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Eliminar Etiqueta"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
