import { useState } from "react";
import { Clock, Search, Trash2, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@shared/schema";

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationHistory({ 
  conversations, 
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation
}: ConversationHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = groupConversationsByDate(filteredConversations);

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-sm border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-card-foreground">History</h2>
          </div>
          <Button
            onClick={onNewConversation}
            size="sm"
            data-testid="button-new-conversation"
            className="rounded-lg"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-conversations"
            className="pl-10 bg-background/50 border-border focus:bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation to get started'}
            </p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([dateGroup, convs]) => (
            <div key={dateGroup} className="p-4">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                {dateGroup}
              </h3>
              <div className="space-y-2">
                {convs.map((conversation) => (
                  <Card 
                    key={conversation.id} 
                    className={`group cursor-pointer transition-all duration-200 border-border hover-elevate ${
                      conversation.id === activeConversationId ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => onSelectConversation(conversation)}
                    data-testid={`conversation-item-${conversation.id}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium truncate text-card-foreground">
                              {conversation.title}
                            </p>
                            {conversation.id === activeConversationId && (
                              <ChevronRight className="h-3 w-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {conversation.model.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {conversation.createdAt && formatRelativeTime(new Date(conversation.createdAt))}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          data-testid={`button-delete-conversation-${conversation.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 ml-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function groupConversationsByDate(conversations: Conversation[]): Record<string, Conversation[]> {
  const groups: Record<string, Conversation[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  conversations.forEach(conv => {
    if (!conv.createdAt) return;
    
    const convDate = new Date(conv.createdAt);
    const convDateOnly = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());
    
    let group: string;
    if (convDateOnly.getTime() === today.getTime()) {
      group = 'Today';
    } else if (convDateOnly.getTime() === yesterday.getTime()) {
      group = 'Yesterday';  
    } else if (convDate > weekAgo) {
      group = 'This Week';
    } else {
      group = convDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    if (!groups[group]) groups[group] = [];
    groups[group].push(conv);
  });

  // Sort conversations within each group by date (newest first)
  Object.keys(groups).forEach(group => {
    groups[group].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  });

  return groups;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return date.toLocaleDateString();
}