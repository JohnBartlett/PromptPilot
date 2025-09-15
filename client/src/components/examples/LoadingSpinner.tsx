import { ThemeProvider } from '../ThemeProvider';
import LoadingSpinner from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Loading Spinners</h3>
          
          <div className="flex items-center gap-8">
            <div className="text-center">
              <LoadingSpinner size="sm" />
              <p className="mt-2 text-sm text-muted-foreground">Small</p>
            </div>
            
            <div className="text-center">
              <LoadingSpinner size="md" text="Processing..." />
              <p className="mt-2 text-sm text-muted-foreground">Medium with text</p>
            </div>
            
            <div className="text-center">
              <LoadingSpinner size="lg" text="Generating response..." />
              <p className="mt-2 text-sm text-muted-foreground">Large with text</p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}