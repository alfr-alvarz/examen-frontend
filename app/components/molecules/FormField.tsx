import { Label } from '../atoms';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function FormField({ label, required, error, children, htmlFor }: FormFieldProps) {
  return (
    <div className="w-full">
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
