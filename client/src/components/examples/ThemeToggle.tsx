import { ThemeProvider } from '../ThemeProvider';
import ThemeToggle from '../ThemeToggle';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="flex items-center gap-4">
          <span className="text-foreground">Toggle Theme:</span>
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}