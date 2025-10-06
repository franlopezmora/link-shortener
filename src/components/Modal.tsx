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

  return (
    <dialog
      ref={ref}
      className="rounded-xl p-0 backdrop:bg-black/40"
      onClose={onClose}
    >
      <div className="p-4 min-w-[28rem]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-sm px-2 py-1 border rounded">Cerrar</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
