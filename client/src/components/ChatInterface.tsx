import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelSelector from "./ModelSelector";
import PromptInput from "./PromptInput";
import ChatBubble from "./ChatBubble";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { getMessages, sendStreamingChatMessage, createConversation } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { OpenAIModel, Message } from "@shared/schema";

interface ChatInterfaceProps {
  conversationId?: string;
  onConversationCreated?: (conversationId: string) => void;
}

export default function ChatInterface({ conversationId, onConversationCreated }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>('gpt-5');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages for the current conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => conversationId ? getMessages(conversationId) : Promise.resolve([]),
    enabled: !!conversationId,
    refetchOnWindowFocus: false,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSendPrompt = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;
    
    // Auto-create conversation if none exists
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      try {
        const newConversation = await createConversation({
          title: `Chat - ${new Date().toLocaleDateString()}`,
          model: selectedModel
        });
        currentConversationId = newConversation.id;
        // Notify parent component of the new conversation
        onConversationCreated?.(currentConversationId);
        console.log('Auto-created conversation:', currentConversationId);
      } catch (error) {
        console.error('Failed to create conversation:', error);
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    setStreamingContent("");

    try {
      await sendStreamingChatMessage({
        conversationId: currentConversationId,
        message: prompt,
        model: selectedModel,
        onChunk: (content) => {
          setStreamingContent(content);
        },
        onComplete: (fullContent) => {
          setStreamingContent("");
          setIsLoading(false);
          // Refetch messages and conversations to get the latest data
          queryClient.invalidateQueries({ queryKey: ["messages", currentConversationId] });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        },
        onError: (error) => {
          console.error("Chat error:", error);
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          setStreamingContent("");
        },
      });
    } catch (error) {
      console.error("Error sending prompt:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setStreamingContent("");
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
              // This will be handled by the parent component
              console.log('New chat requested');
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
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="md" text="Loading conversation..." />
          </div>
        ) : messages.length === 0 ? (
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
                  isLast={index === messages.length - 1 && !isLoading && !streamingContent}
                />
              ))}
              {(isLoading || streamingContent) && (
                <div className="flex gap-4 group flex-row mb-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="inline-block max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm bg-card border border-card-border text-card-foreground">
                      {streamingContent ? (
                        <div className="whitespace-pre-wrap break-words">
                          {streamingContent}
                          <span className="animate-pulse">▋</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          <span>Thinking...</span>
                        </div>
                      )}
                    </div>
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
            placeholder={!conversationId
              ? "Select a conversation to start chatting..."
              : messages.length === 0 
              ? "Start a conversation with your AI assistant..." 
              : "Continue the conversation..."
            }
disabled={false}
          />
        </div>
      </div>
    </div>
  );
}