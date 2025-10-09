interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  const baseClasses = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl";
  const hoverClasses = hover ? "hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow duration-200" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
