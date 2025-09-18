import { MessageSquare, BookOpen, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeView: 'chat' | 'prompts';
  onViewChange: (view: 'chat' | 'prompts') => void;
}

export default function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const menuItems = [
    {
      id: 'chat' as const,
      title: 'Chat',
      icon: MessageSquare,
      description: 'Have conversations with AI'
    },
    {
      id: 'prompts' as const,  
      title: 'Saved Prompts',
      icon: BookOpen,
      description: 'Manage your prompt library'
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-sidebar-foreground">
              Prompt Manager
            </h1>
            <p className="text-xs text-muted-foreground">
              OpenAI Assistant
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeView === item.id}
                    data-testid={`sidebar-nav-${item.id}`}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onViewChange(item.id)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}