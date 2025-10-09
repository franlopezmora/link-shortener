"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toaster";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/common";
import CreateTagModal from "@/components/modals/CreateTagModal";
import DeleteTagModal from "@/components/modals/DeleteTagModal";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagsManagerProps {
  tags: Tag[];
}

export default function TagsManager({ tags }: TagsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<{ id: string; name: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const editingTagRef = useRef<string | null>(null);
  const showDeleteModalRef = useRef<boolean>(false);
  const showCreateTagModalRef = useRef<boolean>(false);
  const toast = useToast();
  const router = useRouter();

  // Mantener refs actualizados
  editingTagRef.current = editingTag;
  showDeleteModalRef.current = showDeleteModal;
  showCreateTagModalRef.current = showCreateTagModal;

  // Cerrar dropdown al hacer click fuera, pero no cuando se está editando/eliminando/creando
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // No cerrar si hay alguna operación en curso
      if (editingTagRef.current || showDeleteModalRef.current || showCreateTagModalRef.current) {
        console.log('Operación en curso, no cerrar dropdown');
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Cerrando dropdown por click fuera');
        setIsOpen(false);
      }
    }

    if (isOpen) {
      console.log('Agregando listener de click fuera');
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      console.log('Removiendo listener de click fuera');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Solo depende de isOpen

  const handleEdit = (tag: Tag) => {
    console.log('Iniciando edición de etiqueta:', tag.name);
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
        setIsOpen(false); // Cerrar dropdown después de editar exitosamente
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
    console.log('Iniciando eliminación de etiqueta:', tagName);
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
        setIsOpen(false); // Cerrar dropdown después de eliminar exitosamente
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
      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="secondary"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Etiquetas
          </div>
        </Button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-40">
            <div className="p-4">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Gestionar Etiquetas</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Organiza tus links con etiquetas personalizadas
                </p>
              </div>

              {/* Lista de etiquetas */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {tags.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">No tienes etiquetas</p>
                    <Button
                      onClick={() => {
                        console.log('Abriendo modal de crear etiqueta desde estado vacío');
                        setShowCreateTagModal(true);
                      }}
                      variant="primary"
                      size="sm"
                    >
                      Nueva Etiqueta
                    </Button>
                  </div>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      {/* Color y nombre */}
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: tag.color || "#6366f1" }}
                        />
                        {editingTag === tag.id ? (
                          <Input
                            value={editName}
                            onChange={setEditName}
                            className="flex-1 text-sm"
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-slate-200 text-sm">{tag.name}</span>
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-1">
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

              {/* Footer con botón */}
              {tags.length > 0 && (
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tags.length} etiqueta{tags.length !== 1 ? 's' : ''} creada{tags.length !== 1 ? 's' : ''}
                  </p>
                  <Button
                    onClick={() => {
                      console.log('Abriendo modal de crear etiqueta desde footer');
                      setShowCreateTagModal(true);
                    }}
                    variant="primary"
                    size="sm"
                  >
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Nueva Etiqueta
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Tag Modal */}
      <CreateTagModal
        open={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
        onSuccess={() => setIsOpen(false)} // Cerrar dropdown después de crear exitosamente
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