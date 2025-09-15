import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
      className="relative transition-all duration-300 hover-elevate"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${
        theme === 'dark' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      }`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${
        theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}