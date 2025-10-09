"use client";
import { useState, useMemo } from "react";
import LinkRow from "@/components/ui/LinkRow";
import CreateLinkModal from "@/components/modals/CreateLinkModal";
import TagsManager from "@/components/ui/TagsManager";
import SearchLinks from "@/components/ui/SearchLinks";
import CommandModal from "@/components/modals/CommandModal";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { Card, Button } from "@/components/common";
import { LinkIcon, EyeIcon, ClockIcon, PlusIcon } from "@/components/icons";

interface Link {
  id: string;
  slug: string;
  url: string;
  visits?: number | null;
  expiresAt?: Date | null;
  description?: string | null;
  linkTags: {
    tag: {
      id: string;
      name: string;
      color?: string | null;
    };
  }[];
}

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface DashboardClientProps {
  links: Link[];
  tags: Tag[];
  totalLinks: number;
  totalVisits: number;
  activeLinks: number;
}

export default function DashboardClient({ 
  links, 
  tags,
  totalLinks, 
  totalVisits, 
  activeLinks 
}: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommandModal, setShowCommandModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtrar links basado en la búsqueda
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    
    const query = searchQuery.toLowerCase();
    return links.filter(link => 
      link.slug.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  }, [links, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateLink = () => {
    setShowCreateModal(true);
  };

  // Hook para Ctrl + K
  useKeyboardShortcut("k", () => {
    setShowCommandModal(true);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tus links</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestiona tus enlaces acortados</p>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 h-full">
          <div className="flex items-center h-full">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Links</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalLinks}/10</p>
              <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    totalLinks >= 10 ? 'bg-red-500' : 
                    totalLinks >= 8 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(totalLinks / 10) * 100}%` }}
                ></div>
              </div>
              {totalLinks >= 10 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Límite alcanzado</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-6 h-full">
          <div className="flex items-center h-full">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <EyeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Visitas</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalVisits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 h-full">
          <div className="flex items-center h-full">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Links Activos</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeLinks}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Link Section */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Crear nuevo link</h2>
          <div className="flex items-center gap-3">
            <TagsManager tags={tags} />
            {totalLinks < 10 && (
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
              >
                <div className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Crear Link
                </div>
              </Button>
            )}
          </div>
        </div>
        
        {totalLinks >= 10 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Límite de links alcanzado</h3>
            <p className="text-slate-600 dark:text-slate-400">Has alcanzado el máximo de 10 links. Elimina algunos para crear nuevos.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <PlusIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Crea tu primer link</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Haz clic en el botón "Crear Link" para empezar</p>
          </div>
        )}
      </Card>

      {/* Links List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Mis links
          </h2>
          {links.length > 0 && (
            <div className="w-80">
              <SearchLinks onSearch={handleSearch} />
            </div>
          )}
        </div>

        {links.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No tienes links aún</h3>
            <p className="text-slate-600 dark:text-slate-400">Crea tu primer link acortado usando el formulario de arriba</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No se encontraron links</h3>
            <p className="text-slate-600 dark:text-slate-400">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLinks.map((l) => (
              <LinkRow 
                key={l.id} 
                id={l.id} 
                slug={l.slug} 
                url={l.url} 
                visits={l.visits} 
                expiresAt={l.expiresAt}
                description={l.description}
                tags={l.linkTags.map(lt => lt.tag)}
              />
            ))}
          </div>
        )}

        {/* Mostrar contador de resultados */}
        {searchQuery && filteredLinks.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Mostrando {filteredLinks.length} de {links.length} links
            </p>
          </div>
        )}
      </Card>

      {/* Command Modal */}
      <CommandModal
        open={showCommandModal}
        onClose={() => setShowCommandModal(false)}
        links={links}
        onCreateLink={handleCreateLink}
        onSearch={handleSearch}
      />

      {/* Create Link Modal */}
      <CreateLinkModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        tags={tags}
      />
    </div>
  );
}
