"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import { Input, Button } from "@/components/common";
import { SearchIcon, PlusIcon, LinkIcon } from "@/components/icons";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

interface CommandModalProps {
  open: boolean;
  onClose: () => void;
  links: Array<{
    id: string;
    slug: string;
    url: string;
    visits?: number | null;
  }>;
  onCreateLink: () => void;
  onSearch: (query: string) => void;
}

export default function CommandModal({ 
  open, 
  onClose, 
  links, 
  onCreateLink, 
  onSearch 
}: CommandModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Comandos disponibles
  const commands: Command[] = [
    {
      id: "create-link",
      title: "Crear nuevo link",
      description: "Crear un nuevo enlace acortado",
      icon: <PlusIcon className="w-5 h-5" />,
      action: () => {
        onCreateLink();
        onClose();
      },
      keywords: ["crear", "nuevo", "link", "enlace", "add"]
    },
    {
      id: "search-links",
      title: "Buscar links",
      description: "Buscar en tus enlaces existentes",
      icon: <SearchIcon className="w-5 h-5" />,
      action: () => {
        onSearch(query);
        onClose();
      },
      keywords: ["buscar", "search", "encontrar", "filtrar"]
    }
  ];

  // Filtrar comandos y links basado en la query
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredLinks = links.filter(link =>
    link.slug.toLowerCase().includes(query.toLowerCase()) ||
    link.url.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5); // Limitar a 5 resultados

  const allResults = [...filteredCommands, ...filteredLinks.map(link => ({
    id: `link-${link.id}`,
    title: `/${link.slug}`,
    description: link.url,
    icon: <LinkIcon className="w-5 h-5" />,
    action: () => {
      // Copiar link al portapapeles
      const base = typeof window !== "undefined" ? window.location.origin : "";
      navigator.clipboard.writeText(`${base}/${link.slug}`);
      onClose();
    },
    keywords: []
  }))];

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? allResults.length - 1 : prev - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          allResults[selectedIndex].action();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, allResults, onClose]);

  // Resetear índice cuando cambia la query
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus en el input cuando se abre
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title="Comandos rápidos">
      <div className="space-y-4">
        <div className="relative">
          <Input
            ref={inputRef}
            value={query}
            onChange={setQuery}
            placeholder="Buscar comandos o links..."
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SearchIcon className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {allResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-600">No se encontraron resultados</p>
            </div>
          ) : (
            <div className="space-y-1">
              {allResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={result.action}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                    index === selectedIndex 
                      ? "bg-blue-50 border border-blue-200" 
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{result.title}</p>
                    <p className="text-sm text-slate-600 truncate">{result.description}</p>
                  </div>
                  {index === selectedIndex && (
                    <div className="flex-shrink-0">
                      <kbd className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">↵</kbd>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">↓</kbd>
              Navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">↵</kbd>
              Seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-xs">Esc</kbd>
              Cerrar
            </span>
          </div>
          <span>Ctrl + K para abrir</span>
        </div>
      </div>
    </Modal>
  );
}
