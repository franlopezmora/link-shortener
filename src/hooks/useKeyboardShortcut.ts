"use client";
import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  dependencies: unknown[] = []
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, ...dependencies]);
}
