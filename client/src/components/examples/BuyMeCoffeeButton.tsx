import { ThemeProvider } from '../ThemeProvider';
import BuyMeCoffeeButton from '../BuyMeCoffeeButton';

export default function BuyMeCoffeeButtonExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Buy Me a Coffee Buttons</h3>
          
          <div className="flex items-center gap-4 flex-wrap">
            <BuyMeCoffeeButton username="yourname" size="sm" variant="outline" />
            <BuyMeCoffeeButton username="yourname" size="default" variant="default" />
            <BuyMeCoffeeButton username="yourname" size="lg" variant="ghost" />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Replace "yourname" with your actual Buy Me a Coffee username
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}