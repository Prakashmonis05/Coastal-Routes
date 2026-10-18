"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
}
