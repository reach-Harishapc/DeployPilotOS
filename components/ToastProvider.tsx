"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { X, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export type ToastType = "info" | "success" | "error" | "warning";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => {
          let bgColor = "bg-zinc-900 border-zinc-800";
          let iconColor = "text-cyan-400";
          let Icon = Info;

          if (toast.type === "success") {
            bgColor = "bg-emerald-500/10 border-emerald-500/20";
            iconColor = "text-emerald-400";
            Icon = CheckCircle2;
          } else if (toast.type === "error") {
            bgColor = "bg-red-500/10 border-red-500/20";
            iconColor = "text-red-400";
            Icon = AlertTriangle;
          } else if (toast.type === "warning") {
            bgColor = "bg-yellow-500/10 border-yellow-500/20";
            iconColor = "text-yellow-400";
            Icon = AlertTriangle;
          }

          return (
            <div 
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg shadow-black/50 animate-fade-in ${bgColor} w-80`}
            >
              <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white leading-snug">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-zinc-400 mt-1 leading-normal">{toast.message}</p>
                )}
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
