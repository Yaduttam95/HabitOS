import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading, 
  disabled, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20',
    secondary: 'bg-[var(--bg-hover)] hover:opacity-90 text-[var(--text-base)] border border-[var(--border-base)]',
    ghost: 'hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-base)]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
