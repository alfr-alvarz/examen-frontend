interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className = '' }: AlertProps) {
  const variantStyles = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400 backdrop-blur-sm',
    error: 'bg-red-500/10 border-red-500/50 text-red-400 backdrop-blur-sm',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 backdrop-blur-sm',
    info: 'bg-blue-500/10 border-blue-500/50 text-blue-400 backdrop-blur-sm',
  };

  return (
    <div className={`p-4 border rounded-lg ${variantStyles[variant]} ${className} shadow-lg`}>
      {children}
    </div>
  );
}
