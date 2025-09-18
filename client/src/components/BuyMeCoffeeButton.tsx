import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyMeCoffeeButtonProps {
  username?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export default function BuyMeCoffeeButton({ 
  username = "yourname", 
  size = 'default',
  variant = 'outline' 
}: BuyMeCoffeeButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      data-testid="button-buy-me-coffee"
      className="gap-2 transition-all duration-200"
      aria-label="Buy me a coffee"
      asChild
    >
      <a 
        href={`https://www.buymeacoffee.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Coffee className="h-4 w-4" />
        <span className="hidden sm:inline">Buy me a coffee</span>
      </a>
    </Button>
  );
}