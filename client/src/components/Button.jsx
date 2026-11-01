import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold tracking-wide rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-neutral-950 font-bold hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] focus:ring-amber-500 border border-amber-400/40',
    secondary:
      'bg-[#151722] text-amber-300 hover:bg-[#1c1e2d] border border-amber-500/30 hover:border-amber-400/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] focus:ring-amber-500',
    danger:
      'bg-gradient-to-r from-red-900/60 via-red-800/60 to-red-900/60 text-red-200 hover:from-red-800/80 hover:to-red-700/80 border border-red-500/40 hover:border-red-400 focus:ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    outline:
      'bg-transparent text-neutral-300 hover:text-white hover:bg-neutral-800/50 border border-neutral-700 hover:border-neutral-500 focus:ring-neutral-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
}
