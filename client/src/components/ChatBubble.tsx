import { User, Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from "@shared/schema";

interface ChatBubbleProps {
  message: Message;
  isLast?: boolean;
}

export default function ChatBubble({ message, isLast = false }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      console.log('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleThumbsUp = () => {
    console.log('Thumbs up for message:', message.id);
  };

  const handleThumbsDown = () => {
    console.log('Thumbs down for message:', message.id);
  };

  return (
    <div className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'} ${isLast ? 'mb-6' : 'mb-4'}`}>
      <Avatar className={`w-8 h-8 ${isUser ? 'order-2' : 'order-1'}`}>
        <AvatarFallback className={`text-xs ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 space-y-2 ${isUser ? 'order-1' : 'order-2'}`}>
        <div 
          className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-card border border-card-border text-card-foreground'
          }`}
          data-testid={`message-${message.role}-${message.id}`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              data-testid={`button-copy-message-${message.id}`}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThumbsUp}
              data-testid={`button-thumbs-up-${message.id}`}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleThumbsDown}
              data-testid={`button-thumbs-down-${message.id}`}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {message.createdAt && new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
}