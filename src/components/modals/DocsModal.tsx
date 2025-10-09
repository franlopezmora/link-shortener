"use client";
import { useRef, useEffect } from "react";

interface DocsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DocsModal({ open, onClose }: DocsModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      // Calcular el ancho de la barra de scroll
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      // Aplicar padding para compensar la barra de scroll
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar el padding y overflow
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  // Cerrar al clickear afuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 modal-backdrop flex items-center justify-center z-50 p-4">
      <div 
        ref={ref}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Documentación</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              title="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-8">
          {/* Introducción */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">¿Qué es Link Shortener?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Link Shortener es una herramienta que te permite crear enlaces cortos y personalizados 
              para tus URLs largas. Perfecto para compartir en redes sociales, emails o cualquier lugar 
              donde necesites un enlace más limpio y profesional.
            </p>
          </section>

          {/* Características */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Características principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Slugs personalizados</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Crea enlaces con nombres que recuerdes fácilmente</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Expiración automática</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Configura cuándo quieres que expire tu enlace</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Estadísticas en tiempo real</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ve cuántas veces se ha visitado tu enlace</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Códigos QR</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Genera códigos QR para tus enlaces</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo usar */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Cómo usar</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Inicia sesión</h4>
                  <p className="text-slate-600 dark:text-slate-400">Conecta con Google o GitHub para acceder a tu cuenta</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Crea tu enlace</h4>
                  <p className="text-slate-600 dark:text-slate-400">Ingresa la URL que quieres acortar y opcionalmente un slug personalizado</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">Comparte</h4>
                  <p className="text-slate-600 dark:text-slate-400">Usa tu nuevo enlace corto y sigue las estadísticas</p>
                </div>
              </div>
            </div>
          </section>

          {/* Reglas de slugs */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Reglas para slugs</h3>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Entre 3 y 100 caracteres</li>
                <li>• Solo letras minúsculas (a-z), números (0-9) y guiones (-)</li>
                <li>• No puede empezar o terminar con guión</li>
                <li>• No puede contener espacios ni caracteres especiales</li>
                <li>• Ejemplos válidos: mi-link, producto123</li>
              </ul>
            </div>
          </section>
        </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 rounded-b-2xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
