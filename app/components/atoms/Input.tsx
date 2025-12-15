import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 border ${
          error ? 'border-red-500/50' : 'border-slate-600/50'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white bg-slate-800/50 backdrop-blur-sm placeholder:text-gray-500 transition-all ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
