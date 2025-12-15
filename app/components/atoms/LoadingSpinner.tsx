interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeStyles[size]} border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin`}
        style={{
          borderTopColor: '#3b82f6',
          borderRightColor: '#8b5cf6',
          borderBottomColor: '#06b6d4',
        }}
      />
    </div>
  );
}
