import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from '../AppSidebar';

export default function AppSidebarExample() {
  const [activeView, setActiveView] = useState<'chat' | 'prompts'>('chat');

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <ThemeProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full bg-background">
          <AppSidebar activeView={activeView} onViewChange={setActiveView} />
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="text-sm text-muted-foreground">
                Current view: <span className="font-medium capitalize">{activeView}</span>
              </div>
            </header>
            <main className="flex-1 p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {activeView === 'chat' ? 'Chat Interface' : 'Prompt Library'}
                </h2>
                <p className="text-muted-foreground">
                  {activeView === 'chat' 
                    ? 'Start a conversation with your AI assistant using the beautiful chat interface.'
                    : 'Manage and organize your saved prompts for quick access and reuse.'
                  }
                </p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}