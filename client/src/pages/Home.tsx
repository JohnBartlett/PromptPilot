import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import AppSidebar from "@/components/AppSidebar";
import ChatInterface from "@/components/ChatInterface";
import SavedPrompts from "@/components/SavedPrompts";
import ConversationHistory from "@/components/ConversationHistory";
import ThemeToggle from "@/components/ThemeToggle";
import type { Prompt, Conversation } from "@shared/schema";

// Mock data for demonstration
const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Creative Writing Assistant',
    description: 'Help with creative storytelling and character development',
    content: 'You are a creative writing assistant. Help me develop compelling characters and engaging storylines. Focus on creating vivid descriptions and emotional depth.',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2', 
    title: 'Code Review Expert',
    description: 'Technical code analysis and improvement suggestions',
    content: 'Review this code for best practices, performance optimizations, and potential bugs. Provide specific suggestions for improvement with examples.',
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Meeting Summarizer', 
    description: 'Extract key points and action items from meeting notes',
    content: 'Summarize the key points, decisions made, and action items from this meeting. Format the output with clear sections and assign owners to action items.',
    createdAt: new Date('2024-01-13')
  }
]; // todo: remove mock functionality

const mockConversations: Conversation[] = [
  {
    id: 'demo',
    title: 'Creative Writing Session',
    model: 'gpt-5',
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    title: 'Code Review Discussion',  
    model: 'gpt-4o',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    title: 'Marketing Strategy Ideas',
    model: 'gpt-4o-mini',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // Yesterday
  }
]; // todo: remove mock functionality

export default function Home() {
  const [activeView, setActiveView] = useState<'chat' | 'prompts'>('chat');
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('demo');

  // Sidebar width configuration for Apple-inspired spacious feel
  const sidebarStyle = {
    "--sidebar-width": "20rem",       // 320px for better content
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const handleInjectPrompt = (content: string) => {
    console.log('Injecting prompt:', content.substring(0, 50) + '...');
    // In real implementation, this would inject into the active chat input
  };

  const handleCreatePrompt = () => {
    console.log('Creating new prompt');
    // In real implementation, open prompt creation modal
  };

  const handleEditPrompt = (prompt: Prompt) => {
    console.log('Editing prompt:', prompt.title);
    // In real implementation, open prompt editing modal
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    console.log('Deleted prompt:', id);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    setActiveView('chat');
    console.log('Selected conversation:', conversation.title);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId('');
    }
    console.log('Deleted conversation:', id);
  };

  const handleNewConversation = () => {
    const newId = Date.now().toString();
    setActiveConversationId(newId);
    setActiveView('chat');
    console.log('Started new conversation:', newId);
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
                <ThemeToggle />
              </header>
              
              <main className="flex-1 overflow-hidden">
                {activeView === 'chat' ? (
                  <ChatInterface conversationId={activeConversationId} />
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