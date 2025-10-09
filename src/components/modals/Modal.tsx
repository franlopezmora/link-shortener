"use client";
import { ReactNode, useEffect, useRef } from "react";

export default function Modal({
  open,
  onClose,
  children,
  title = "Editar",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Manejar click fuera del modal
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

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-0 backdrop:bg-black/40 border border-slate-200 dark:border-slate-700"
      onClose={onClose}
    >
             <div className="p-4 min-w-[34rem] max-w-[50rem] min-h-[10rem] max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-xl scrollbar-thin">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200" title="Cerrar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
