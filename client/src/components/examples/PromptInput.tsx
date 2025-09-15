import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import PromptInput from '../PromptInput';

export default function PromptInputExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (prompt: string) => {
    console.log('Prompt sent:', prompt);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-2xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Prompt Input</h3>
          <PromptInput 
            onSend={handleSend}
            isLoading={isLoading}
            placeholder="Write a creative story about a robot learning to paint..."
            onInjectPrompt={(prompt) => console.log('Injected:', prompt)}
          />
          <p className="text-sm text-muted-foreground">
            Use ⌘ + Enter to send your prompt
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}