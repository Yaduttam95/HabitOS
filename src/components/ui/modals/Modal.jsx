import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, title, children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Render portal logic here if preferred, but simple conditional rendering works for this app structure
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-base)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-base)]">
          <h2 className="text-xl font-bold text-[var(--text-base)]">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-base)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
