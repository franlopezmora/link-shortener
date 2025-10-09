"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/common";

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface MultiTagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagSelect: (tagIds: string[]) => void;
  onCreateTag: () => void;
  onCreateTagWithName?: (name: string) => void;
}

export default function MultiTagSelector({ 
  tags, 
  selectedTagIds, 
  onTagSelect, 
  onCreateTag,
  onCreateTagWithName
}: MultiTagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      // Remover etiqueta
      onTagSelect(selectedTagIds.filter(id => id !== tagId));
    } else {
      // Agregar etiqueta
      onTagSelect([...selectedTagIds, tagId]);
    }
  };

  const handleClearAll = () => {
    onTagSelect([]);
  };

  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      
      // Verificar si ya existe una etiqueta con ese nombre
      const existingTag = tags.find(tag => 
        tag.name.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      
      if (existingTag) {
        // Si existe, seleccionarla
        handleTagToggle(existingTag.id);
        setSearchQuery("");
        setIsOpen(false);
      } else if (onCreateTagWithName) {
        // Si no existe y tenemos la función, crear la etiqueta
        onCreateTagWithName(searchQuery.trim());
        setSearchQuery("");
        setIsOpen(false);
      } else {
        // Fallback al modal de crear etiqueta
        onCreateTag();
        setIsOpen(false);
        setSearchQuery("");
      }
    }
  };

  return (
    <div className="relative mt-4" ref={dropdownRef}>
      {/* Campo de entrada principal */}
      <div className="relative">
               <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={handleKeyDown}
                 onFocus={() => setIsOpen(true)}
                 placeholder="Seleccionar una etiqueta (Enter para crear nueva)"
                 className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
               />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto p-4">
          {filteredTags.length === 0 ? (
            <div className="p-4 text-center">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No hay etiquetas disponibles</p>
              <button
                onClick={() => {
                  onCreateTag();
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200"
              >
                Crear nueva etiqueta
              </button>
            </div>
          ) : (
            <>
                     {filteredTags.map((tag) => (
                       <button
                         key={tag.id}
                         onClick={() => handleTagToggle(tag.id)}
                         className={`w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                           selectedTagIds.includes(tag.id)
                             ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                             : "text-slate-700 dark:text-slate-300"
                         }`}
                       >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color || "#6366f1" }}
                  />
                  <span className="flex-1">{tag.name}</span>
                  {selectedTagIds.includes(tag.id) && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
              
                     <div className="border-t border-slate-200 dark:border-slate-700">
                       <button
                         onClick={() => {
                           onCreateTag();
                           setIsOpen(false);
                           setSearchQuery("");
                         }}
                         className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
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
      )}

      {/* Etiquetas seleccionadas */}
      {selectedTags.length > 0 && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-lg"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color || "#6366f1" }}
                />
                {tag.name}
                <button
                  onClick={() => handleTagToggle(tag.id)}
                  className="p-0.5 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
