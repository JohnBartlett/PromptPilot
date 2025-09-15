import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import ModelSelector from '../ModelSelector';
import type { OpenAIModel } from '@shared/schema';

export default function ModelSelectorExample() {
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-5');

  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground">Select OpenAI Model</h3>
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={(model) => {
              setSelectedModel(model);
              console.log('Model changed to:', model);
            }} 
          />
          <p className="text-sm text-muted-foreground">
            Selected: {selectedModel}
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}