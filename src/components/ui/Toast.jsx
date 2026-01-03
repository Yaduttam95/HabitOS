import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to finish before unmounting
      setTimeout(onClose, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
    error: 'bg-red-500/10 border-red-500/20 text-red-200',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-200'
  };

  return (
    <div 
      className={`
        fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        transition-all duration-300 ease-out transform
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}
        ${styles[type]}
        min-w-[300px]
      `}
    >
      <div className="shrink-0">
        {icons[type]}
      </div>
      <p className="font-medium text-[var(--text-base)] text-sm flex-1">{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-[var(--text-muted)]" />
      </button>
    </div>
  );
};
