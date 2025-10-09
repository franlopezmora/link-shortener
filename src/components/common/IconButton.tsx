interface IconButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  title?: string;
  children: React.ReactNode;
}

export default function IconButton({
  onClick,
  disabled = false,
  loading = false,
  variant = "secondary",
  size = "md",
  className = "",
  title,
  children
}: IconButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 text-blue-700 focus:ring-blue-500",
    secondary: "bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 focus:ring-slate-500",
    danger: "bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-700 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-100 disabled:bg-transparent text-slate-700 focus:ring-slate-500"
  };
  
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };
  
  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Quitar el focus después del clic para evitar el borde azul persistente
    e.currentTarget.blur();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={classes}
      title={title}
    >
      {loading ? (
        <svg className={`${iconSizeClasses[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <div className={iconSizeClasses[size]}>
          {children}
        </div>
      )}
    </button>
  );
}
