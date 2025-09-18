import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppSidebar from "@/components/AppSidebar";
import ChatInterface from "@/components/ChatInterface";
import SavedPrompts from "@/components/SavedPrompts";
import ConversationHistory from "@/components/ConversationHistory";
import ThemeToggle from "@/components/ThemeToggle";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import { getPrompts, createPrompt, updatePrompt, deletePrompt, getConversations, createConversation, deleteConversation } from "@/lib/api";
import type { Prompt, Conversation, InsertPrompt } from "@shared/schema";

export default function Home() {
  const [activeView, setActiveView] = useState<'chat' | 'prompts'>('chat');
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch prompts
  const { data: prompts = [], isLoading: promptsLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: getPrompts,
  });

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  // Create prompt mutation
  const createPromptMutation = useMutation({
    mutationFn: createPrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast({ title: "Success", description: "Prompt created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create prompt", variant: "destructive" });
    },
  });

  // Update prompt mutation
  const updatePromptMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPrompt> }) => updatePrompt(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast({ title: "Success", description: "Prompt updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update prompt", variant: "destructive" });
    },
  });

  // Delete prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: deletePrompt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      toast({ title: "Success", description: "Prompt deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete prompt", variant: "destructive" });
    },
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setActiveConversationId(newConversation.id);
      setActiveView("chat");
      toast({ title: "Success", description: "New conversation started" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create conversation", variant: "destructive" });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast({ title: "Success", description: "Conversation deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete conversation", variant: "destructive" });
    },
  });

  // Sidebar width configuration for Apple-inspired spacious feel
  const sidebarStyle = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const handleInjectPrompt = (content: string) => {
    console.log('Injecting prompt:', content.substring(0, 50) + '...');
    // TODO: Implement prompt injection into active chat input
  };

  const handleCreatePrompt = () => {
    // TODO: Open prompt creation modal
    const title = prompt("Enter prompt title:");
    const content = prompt("Enter prompt content:");
    if (title && content) {
      createPromptMutation.mutate({ title, content, description: "" });
    }
  };

  const handleEditPrompt = (promptToEdit: Prompt) => {
    // TODO: Open prompt editing modal
    const title = prompt("Edit prompt title:", promptToEdit.title);
    const content = prompt("Edit prompt content:", promptToEdit.content);
    const description = prompt("Edit prompt description:", promptToEdit.description || "");
    if (title && content) {
      updatePromptMutation.mutate({ id: promptToEdit.id, data: { title, content, description } });
    }
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      deletePromptMutation.mutate(id);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    setActiveView('chat');
  };

  const handleDeleteConversation = (id: string) => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversationMutation.mutate(id);
      if (activeConversationId === id) {
        setActiveConversationId('');
      }
    }
  };

  const handleNewConversation = () => {
    const title = `New Chat - ${new Date().toLocaleDateString()}`;
    createConversationMutation.mutate({ title, model: 'gpt-5' });
  };

  return (
    <ThemeProvider>
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar activeView={activeView} onViewChange={setActiveView} />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Secondary sidebar for history/prompts */}
            {activeView === 'chat' ? (
              <div className="w-80 border-r border-border">
                <ConversationHistory
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onNewConversation={handleNewConversation}
                />
              </div>
            ) : (
              <div className="w-80">
                <SavedPrompts
                  prompts={prompts}
                  onInjectPrompt={handleInjectPrompt}
                  onCreatePrompt={handleCreatePrompt}
                  onEditPrompt={handleEditPrompt}
                  onDeletePrompt={handleDeletePrompt}
                />
              </div>
            )}

            {/* Main content area */}
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-3">
                  <BuyMeCoffeeButton username="johnbartlett" size="default" variant="ghost" />
                  <ThemeToggle />
                </div>
              </header>
              
              <main className="flex-1 overflow-hidden">
                {activeView === 'chat' ? (
                  <ChatInterface 
                    conversationId={activeConversationId}
                    onConversationCreated={(id) => {
                      setActiveConversationId(id);
                      queryClient.invalidateQueries({ queryKey: ["conversations"] });
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-md px-4">
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Prompt Library
                      </h2>
                      <p className="text-muted-foreground">
                        Manage your saved prompts in the sidebar. Create, edit, and organize prompts for quick access during conversations.
                      </p>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}