"use client";
import { useRef, useEffect } from "react";

interface APIModalProps {
  open: boolean;
  onClose: () => void;
}

export default function APIModal({ open, onClose }: APIModalProps) {
  const ref = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        ref={ref}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Documentation</h2>
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
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">API REST</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              La API de Link Shortener te permite crear, gestionar y obtener estadísticas de tus enlaces 
              programáticamente. Todas las respuestas están en formato JSON.
            </p>
          </section>

          {/* Autenticación */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Autenticación</h3>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Para usar la API necesitas estar autenticado. Usa las mismas credenciales que usas en la web.
              </p>
              <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                <div># Incluir cookies de sesión en las requests</div>
                <div>curl -X POST &quot;https://link-shortener-flm.vercel.app/api/links&quot;</div>
                <div className="ml-4">-H &quot;Content-Type: application/json&quot;</div>
                <div className="ml-4">-H &quot;Cookie: next-auth.session-token=...&quot;</div>
                <div className="ml-4">-d &apos;{`{"slug": "mi-link", "url": "https://example.com"}`}&apos;</div>
              </div>
            </div>
          </section>

          {/* Endpoints */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Endpoints</h3>
            
            {/* Crear Link */}
            <div className="space-y-6">
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-bold rounded">POST</span>
                  <code className="text-slate-900 dark:text-slate-200 font-mono">/api/links</code>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Crear un nuevo enlace acortado</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Request Body:</h4>
                    <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                      <div>{`{`}</div>
                      <div className="ml-4">&quot;slug&quot;: &quot;mi-link&quot;, <span className="text-slate-400">{`// opcional`}</span></div>
                      <div className="ml-4">&quot;url&quot;: &quot;https://example.com&quot;, <span className="text-slate-400">{`// requerido`}</span></div>
                      <div className="ml-4">&quot;expiresAt&quot;: &quot;2024-12-31T23:59:59&quot; <span className="text-slate-400">{`// opcional`}</span></div>
                      <div>{`}`}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Response (201):</h4>
                    <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                      <div>{`{`}</div>
                      <div className="ml-4">&quot;id&quot;: &quot;clx123...&quot;,</div>
                      <div className="ml-4">&quot;slug&quot;: &quot;mi-link&quot;,</div>
                      <div className="ml-4">&quot;url&quot;: &quot;https://example.com&quot;,</div>
                      <div className="ml-4">&quot;visits&quot;: 0,</div>
                      <div className="ml-4">&quot;expiresAt&quot;: &quot;2024-12-31T23:59:59.000Z&quot;,</div>
                      <div className="ml-4">&quot;createdAt&quot;: &quot;2024-01-15T10:30:00.000Z&quot;</div>
                      <div>{`}`}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Obtener Links */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold rounded">GET</span>
                  <code className="text-slate-900 dark:text-slate-200 font-mono">/api/links</code>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Obtener todos tus enlaces</p>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Response (200):</h4>
                  <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                    <div>[</div>
                    <div className="ml-4">{`{`}</div>
                    <div className="ml-8">&quot;id&quot;: &quot;clx123...&quot;,</div>
                    <div className="ml-8">&quot;slug&quot;: &quot;mi-link&quot;,</div>
                    <div className="ml-8">&quot;url&quot;: &quot;https://example.com&quot;,</div>
                    <div className="ml-8">&quot;visits&quot;: 42,</div>
                    <div className="ml-8">&quot;expiresAt&quot;: null,</div>
                    <div className="ml-8">&quot;createdAt&quot;: &quot;2024-01-15T10:30:00.000Z&quot;</div>
                    <div className="ml-4">{`}`}</div>
                    <div>]</div>
                  </div>
                </div>
              </div>

              {/* Actualizar Link */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-bold rounded">PUT</span>
                  <code className="text-slate-900 dark:text-slate-200 font-mono">/api/links/[id]</code>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Actualizar un enlace existente</p>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Request Body:</h4>
                  <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                    <div>{`{`}</div>
                    <div className="ml-4">&quot;slug&quot;: &quot;nuevo-slug&quot;, <span className="text-slate-400">{`// opcional`}</span></div>
                    <div className="ml-4">&quot;url&quot;: &quot;https://nuevo-ejemplo.com&quot;, <span className="text-slate-400">{`// opcional`}</span></div>
                    <div className="ml-4">&quot;expiresAt&quot;: &quot;2024-12-31T23:59:59&quot; <span className="text-slate-400">{`// opcional`}</span></div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>

              {/* Eliminar Link */}
              <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">DELETE</span>
                  <code className="text-slate-900 dark:text-slate-200 font-mono">/api/links/[id]</code>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">Eliminar un enlace</p>
                
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Response (200):</h4>
                  <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                    <div>{`{`}</div>
                    <div className="ml-4">&quot;message&quot;: &quot;Link eliminado exitosamente&quot;</div>
                    <div>{`}`}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Códigos QR */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Códigos QR</h3>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-slate-600 dark:text-slate-400 mb-3">
                Genera códigos QR para cualquier enlace usando el endpoint público:
              </p>
              <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                <div>GET /api/qr/[slug].svg</div>
                <div className="text-slate-400 mt-2"># Ejemplo:</div>
                <div>https://link-shortener-flm.vercel.app/api/qr/mi-link.svg</div>
              </div>
            </div>
          </section>

          {/* Códigos de Error */}
          <section>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Códigos de Error</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">400</span>
                <span className="text-slate-600 dark:text-slate-400">Bad Request - Datos inválidos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">401</span>
                <span className="text-slate-600 dark:text-slate-400">Unauthorized - No autenticado</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">403</span>
                <span className="text-slate-600 dark:text-slate-400">Forbidden - Sin permisos</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">409</span>
                <span className="text-slate-600 dark:text-slate-400">Conflict - Slug ya existe</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-bold rounded">500</span>
                <span className="text-slate-600 dark:text-slate-400">Internal Server Error</span>
              </div>
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
