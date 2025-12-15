import { Label } from '../atoms';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Textarea } from '../atoms/Textarea';
import { cloneElement, isValidElement } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FormField({ label, required, error, children, htmlFor }: FormFieldProps) {
  const childWithError = isValidElement(children) ? (() => {
    const childType = children.type;
    const isInput = childType === Input || (childType as any)?.displayName === 'Input';
    const isSelect = childType === Select || (childType as any)?.displayName === 'Select';
    const isTextarea = childType === Textarea || (childType as any)?.displayName === 'Textarea';
    const isNativeInput = childType === 'input';
    
    if (isInput || isSelect || isTextarea || isNativeInput) {
      return cloneElement(children as React.ReactElement<any>, { 
        error: !!error,
        ...(htmlFor && !(children as any).props.id ? { id: htmlFor } : {})
      });
    }
    return children;
  })() : children;

  return (
    <div className="w-full">
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      <div className="mt-1">{childWithError}</div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
