"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import Modal from "@/components/modals/Modal";
import { Button, Input } from "@/components/common";
import CreateTagModal from "./CreateTagModal";
import DeleteTagModal from "./DeleteTagModal";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagsManagerModalProps {
  open: boolean;
  onClose: () => void;
  tags: Tag[];
}

export default function TagsManagerModal({ open, onClose, tags }: TagsManagerModalProps) {
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<{ id: string; name: string } | null>(null);
  const toast = useToast();
  const router = useRouter();

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag.id);
    setEditName(tag.name);
  };

  const handleSaveEdit = async (tagId: string) => {
    if (!editName.trim()) {
      toast("El nombre de la etiqueta es obligatorio", "Validación");
      return;
    }

    setLoading(tagId);
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (res.ok) {
        toast("Etiqueta actualizada", editName);
        router.refresh();
        setEditingTag(null);
        setEditName("");
      } else if (res.status === 409) {
        toast("Esa etiqueta ya existe", "Conflicto");
      } else {
        toast(await res.text() || "Error al actualizar etiqueta", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = (tagId: string, tagName: string) => {
    setTagToDelete({ id: tagId, name: tagName });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;

    setLoading(tagToDelete.id);
    try {
      const res = await fetch(`/api/tags/${tagToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Etiqueta eliminada", tagToDelete.name);
        router.refresh();
        setShowDeleteModal(false);
        setTagToDelete(null);
      } else {
        toast(await res.text() || "Error al eliminar etiqueta", "Error");
      }
    } catch (e: unknown) {
      const error = e as Error;
      toast(error.message ?? "Error inesperado", "Error");
    } finally {
      setLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName("");
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Gestionar Etiquetas">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-slate-600">
              Organiza tus links con etiquetas personalizadas
            </p>
          </div>

          {/* Lista de etiquetas */}
          <div className="space-y-3">
            {tags.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No tienes etiquetas</h3>
                <p className="text-slate-600 mb-4">Crea tu primera etiqueta para organizar tus links</p>
                <Button
                  onClick={() => setShowCreateTagModal(true)}
                  variant="primary"
                >
                  Nueva Etiqueta
                </Button>
              </div>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  {/* Color y nombre */}
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color || "#6366f1" }}
                    />
                    {editingTag === tag.id ? (
                      <Input
                        value={editName}
                        onChange={setEditName}
                        className="flex-1"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-slate-900">{tag.name}</span>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2">
                    {editingTag === tag.id ? (
                      <>
                        <Button
                          onClick={() => handleSaveEdit(tag.id)}
                          disabled={loading === tag.id}
                          loading={loading === tag.id}
                          variant="primary"
                          size="sm"
                        >
                          Guardar
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="secondary"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleEdit(tag)}
                          variant="secondary"
                          size="sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button
                          onClick={() => handleDelete(tag.id, tag.name)}
                          disabled={loading === tag.id}
                          loading={loading === tag.id}
                          variant="danger"
                          size="sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con información y botón */}
          {tags.length > 0 && (
            <div className="flex items-center justify-between py-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                {tags.length} etiqueta{tags.length !== 1 ? 's' : ''} creada{tags.length !== 1 ? 's' : ''}
              </p>
              <Button
                onClick={() => setShowCreateTagModal(true)}
                variant="primary"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nueva Etiqueta
                </div>
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Create Tag Modal */}
      <CreateTagModal
        open={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
      />

      {/* Delete Tag Modal */}
      <DeleteTagModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTagToDelete(null);
        }}
        tagName={tagToDelete?.name || ""}
        onConfirm={confirmDelete}
        loading={loading === tagToDelete?.id}
      />
    </>
  );
}
