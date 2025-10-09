"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  slug: string;
  title?: string;
}

export default function QRModal({ open, onClose, slug, title = "Código QR" }: QRModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [realUrl, setRealUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dialog = ref.current!;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Manejar clic fuera del modal
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      
      if (!isInDialog) {
        onClose();
      }
    };

    if (open) {
      dialog.addEventListener('click', handleClick);
    }

    return () => {
      dialog.removeEventListener('click', handleClick);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && slug) {
      setLoading(true);
      const qrApiUrl = `/api/qr/${encodeURIComponent(slug)}.svg`;
      // Usar la misma lógica que el servidor: protocol + host
      const protocol = window.location.protocol;
      const host = window.location.host;
      const linkUrl = slug === "demo" ? `${protocol}//${host}` : `${protocol}//${host}/${slug}`;
      setQrUrl(qrApiUrl);
      setRealUrl(linkUrl);
      // Simular un pequeño delay para mostrar el loading
      setTimeout(() => setLoading(false), 100);
    } else if (!open) {
      setQrUrl("");
      setRealUrl("");
    }
  }, [open, slug]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-${slug}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(realUrl);
      // Aquí podrías agregar un toast de confirmación
    } catch (err) {
      console.error('Error al copiar URL:', err);
    }
  };

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-0 backdrop:bg-black/40 border border-slate-200 dark:border-slate-700"
      onClose={onClose}
    >
      <div className="p-6 min-w-[32rem] max-w-[40rem] bg-white dark:bg-slate-800 rounded-xl overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600">
              {loading || !qrUrl ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <Image 
                  src={qrUrl} 
                  alt={`Código QR para ${slug}`}
                  width={256}
                  height={256}
                  className="w-64 h-64"
                />
              )}
            </div>
          </div>

          {/* URL Display */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              URL del enlace:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={realUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm font-mono text-slate-600 dark:text-slate-200"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                title="Copiar URL"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar QR
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 rounded-lg transition-colors duration-200 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
