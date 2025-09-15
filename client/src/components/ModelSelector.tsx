import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OPENAI_MODELS, type OpenAIModel } from "@shared/schema";

interface ModelSelectorProps {
  selectedModel: OpenAIModel;
  onModelChange: (model: OpenAIModel) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center justify-between min-w-[160px] bg-card hover-elevate"
          data-testid="button-model-selector"
        >
          <span className="font-medium">
            {OPENAI_MODELS[selectedModel]}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] backdrop-blur-xl border-border">
        {Object.entries(OPENAI_MODELS).map(([value, label]) => (
          <DropdownMenuItem 
            key={value}
            onClick={() => onModelChange(value as OpenAIModel)}
            className={`cursor-pointer transition-all duration-200 ${
              value === selectedModel ? 'bg-primary text-primary-foreground' : 'hover-elevate'
            }`}
            data-testid={`model-option-${value}`}
          >
            <span className="font-medium">{label}</span>
            {value === selectedModel && (
              <div className="ml-auto h-2 w-2 rounded-full bg-current" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}