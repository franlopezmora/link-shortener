"use client";
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
          <Button
            onClick={onConfirm}
            variant="danger"
            loading={loading}
            disabled={loading}
          >
            Eliminar Etiqueta
          </Button>
        </div>
      </div>
    </Modal>
  );
}
