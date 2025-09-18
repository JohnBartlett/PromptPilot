import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onSend: (prompt: string) => void;
  onInjectPrompt?: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function PromptInput({ 
  onSend, 
  onInjectPrompt, 
  isLoading = false,
  placeholder = "Type your prompt here...",
  disabled = false
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim() && !isLoading) {
      onSend(prompt.trim());
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInject = (injectedPrompt: string) => {
    setPrompt(prev => prev + (prev ? "\\n\\n" : "") + injectedPrompt);
    onInjectPrompt?.(injectedPrompt);
  };

  return (
    <div className="relative rounded-xl bg-card border border-card-border shadow-sm">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading || disabled}
        data-testid="textarea-prompt-input"
        className="min-h-[120px] resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 p-4 pr-16"
      />
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <div className="text-xs text-muted-foreground hidden sm:block">
          ⌘ + Enter to send
        </div>
        <Button
          onClick={handleSend}
          disabled={!prompt.trim() || isLoading || disabled}
          size="icon"
          data-testid="button-send-prompt"
          className="rounded-lg shadow-sm transition-all duration-200"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}