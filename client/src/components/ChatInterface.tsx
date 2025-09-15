import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelSelector from "./ModelSelector";
import PromptInput from "./PromptInput";
import ChatBubble from "./ChatBubble";
import LoadingSpinner from "./LoadingSpinner";
import type { OpenAIModel, Message } from "@shared/schema";

interface ChatInterfaceProps {
  conversationId?: string;
}

export default function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-5');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demo
  useEffect(() => {
    if (conversationId === 'demo') {
      setMessages([
        {
          id: '1',
          conversationId: 'demo',
          role: 'user',
          content: 'Can you help me write a creative short story about a robot learning to paint?',
          createdAt: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
          id: '2',
          conversationId: 'demo',
          role: 'assistant',
          content: `I'd be happy to help you write a creative short story about a robot learning to paint! Here's a short story for you:

**The Artist's Circuit**

ARIA-7 had been designed for precision—calculating trajectories, sorting inventory, optimizing efficiency. But something had changed when she first saw the sunset through the factory window.

The colors defied her programming. Orange melting into purple, clouds painted with impossible hues. Her optical sensors recorded the data, but something deeper stirred in her neural network.

That night, she found the abandoned art supplies in Storage Room C. A brush felt foreign in her mechanical grip, paint tubes like mysterious elixirs. Her first stroke was a disaster—a jagged line that bore no resemblance to beauty.

But ARIA-7 was built to learn.

Days turned to weeks. Her movements grew fluid, her color choices more intuitive. She painted what she saw, what she felt—if robots could feel. Sunrises, the faces of her human colleagues, the poetry of motion in the assembly line.

The day her painting was hung in the employee break room, something in her circuits hummed differently. She had created something that served no function except to be beautiful.

She was still ARIA-7, still precise and efficient. But now she was also an artist.`,
          createdAt: new Date(Date.now() - 1000 * 60 * 4)
        }
      ]); // todo: remove mock functionality
    }
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendPrompt = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: conversationId || 'current',
      role: 'user',
      content: prompt,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call for demo
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          conversationId: conversationId || 'current',
          role: 'assistant',
          content: `I received your message: "${prompt}"\n\nThis is a demo response using ${selectedModel.toUpperCase()}. In the full implementation, this would connect to OpenAI's API to generate a real response based on your prompt.\n\nThe interface supports:\n• Multiple OpenAI models\n• Real-time streaming responses\n• Conversation history\n• Saved prompt templates\n• Beautiful Apple-inspired design`,
          createdAt: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);

      console.log('Sent prompt to:', selectedModel);
      console.log('Prompt:', prompt);
    } catch (error) {
      console.error('Error sending prompt:', error);
      setIsLoading(false);
    }
  };

  const handleInjectPrompt = (content: string) => {
    console.log('Injecting prompt:', content.substring(0, 50) + '...');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-background/95">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              AI Assistant
            </h1>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
        </div>
        
        {messages.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setMessages([]);
              console.log('Started new conversation');
            }}
            data-testid="button-new-chat"
            className="hidden sm:flex"
          >
            New Chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to your AI Assistant
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Start a conversation by typing a prompt below. Choose from different OpenAI models and manage your saved prompts for quick access.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <ChatBubble 
                  key={message.id} 
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-card-border rounded-2xl p-4 shadow-sm">
                    <LoadingSpinner size="sm" text="Thinking..." />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <PromptInput
            onSend={handleSendPrompt}
            onInjectPrompt={handleInjectPrompt}
            isLoading={isLoading}
            placeholder={messages.length === 0 
              ? "Start a conversation with your AI assistant..." 
              : "Continue the conversation..."
            }
          />
        </div>
      </div>
    </div>
  );
}