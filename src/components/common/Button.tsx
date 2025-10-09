interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  className = "",
  type = "button"
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-700",
    secondary: "bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:disabled:bg-slate-800 dark:text-slate-200",
    danger: "bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-700",
    ghost: "bg-transparent hover:bg-slate-100 disabled:bg-transparent text-slate-700 focus:ring-slate-500 dark:hover:bg-slate-700 dark:text-slate-200"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Quitar el focus después del clic para evitar el borde azul persistente
    e.currentTarget.blur();
    if (onClick) onClick();
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && (
        <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
