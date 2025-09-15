interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" data-testid="loading-spinner">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary/20 border-t-primary transition-all duration-300`} />
      {text && (
        <p className={`${textSizeClasses[size]} text-muted-foreground font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}