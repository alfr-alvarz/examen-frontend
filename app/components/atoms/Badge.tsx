interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'md', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-700/50 text-gray-300 border border-slate-600/50',
    success: 'bg-green-500/10 text-green-400 border border-green-500/50',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/50',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/50',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
