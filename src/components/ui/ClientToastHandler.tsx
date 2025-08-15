"use client";

import { useEffect } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  type?: ToastType;
  message: string;
  options?: ToastOptions;
}

interface ToastMessageProps {
  toasts: ToastItem[];
}

export const ToastMessage = ({ toasts }: ToastMessageProps) => {
  useEffect(() => {
    toasts.forEach(({ type = "info", message, options }) => {
      toast[type](message, options);
    });
  }, [toasts]);

  return <ToastContainer />;
};
