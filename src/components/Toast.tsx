import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:w-80 z-50 bg-[#090e17] border border-[#00d2ff] text-[#00d2ff] px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(0,210,255,0.4)] font-mono text-xs flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300">
      <ShieldCheck className="w-4 h-4 text-[#0597ff] shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
};
