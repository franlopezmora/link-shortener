"use client";
import { useState } from "react";
import { Button } from "@/components/common";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selectedTagId?: string;
  onTagSelect: (tagId: string | undefined) => void;
  onCreateTag: () => void;
}

export default function TagSelector({ 
  tags, 
  selectedTagId, 
  onTagSelect, 
  onCreateTag 
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTag = tags.find(tag => tag.id === selectedTagId);

  const handleTagClick = (tagId: string) => {
    if (selectedTagId === tagId) {
      onTagSelect(undefined); // Deseleccionar si ya está seleccionado
    } else {
      onTagSelect(tagId);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onTagSelect(undefined);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="w-full justify-start"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{selectedTag ? selectedTag.name : "Seleccionar etiqueta"}</span>
        </div>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {tags.length === 0 ? (
              <div className="text-center py-4">
                <div className="p-2 bg-slate-100 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 mb-3">No tienes etiquetas creadas</p>
                <Button
                  onClick={() => {
                    onCreateTag();
                    setIsOpen(false);
                  }}
                  variant="primary"
                  size="sm"
                >
                  Crear primera etiqueta
                </Button>
              </div>
            ) : (
              <>
                {selectedTagId && (
                  <button
                    onClick={handleClear}
                    className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                  >
                    Sin etiqueta
                  </button>
                )}
                
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                      selectedTagId === tag.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color || "#6366f1" }}
                    />
                    <span>{tag.name}</span>
                    {selectedTagId === tag.id && (
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
                
                <div className="border-t border-slate-200 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onCreateTag();
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Crear nueva etiqueta
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
