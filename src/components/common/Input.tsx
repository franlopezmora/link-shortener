import { forwardRef } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  type?: "text" | "email" | "password" | "url";
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  maxLength?: number;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder,
  label,
  error,
  type = "text",
  disabled = false,
  className = "",
  autoFocus = false,
  maxLength,
  onFocus,
  onBlur
}, ref) => {
  const inputClasses = `w-full px-3 py-2 h-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
    error ? "border-red-300 bg-red-50 dark:border-red-500 dark:bg-red-900/20" : "border-slate-300 dark:border-slate-600"
  } ${disabled ? "bg-slate-50 dark:bg-slate-800 cursor-not-allowed" : ""} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        className={inputClasses}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
