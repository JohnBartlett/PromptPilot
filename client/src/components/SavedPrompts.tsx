import { useState } from "react";
import { Plus, BookOpen, Copy, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Prompt } from "@shared/schema";

interface SavedPromptsProps {
  prompts: Prompt[];
  onInjectPrompt: (content: string) => void;
  onCreatePrompt: () => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
}

export default function SavedPrompts({ 
  prompts, 
  onInjectPrompt, 
  onCreatePrompt,
  onEditPrompt,
  onDeletePrompt 
}: SavedPromptsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInject = (content: string) => {
    onInjectPrompt(content);
    console.log('Injected prompt:', content.substring(0, 50) + '...');
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Prompt copied to clipboard');
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-card-foreground">Saved Prompts</h2>
          </div>
          <Button
            onClick={onCreatePrompt}
            size="sm"
            data-testid="button-create-prompt"
            className="rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-prompts"
            className="pl-10 bg-background/50 border-border focus:bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">
              {searchQuery ? 'No prompts found' : 'No saved prompts yet'}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Create your first prompt to get started'}
            </p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="group hover-elevate transition-all duration-200 border-border">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate text-card-foreground">
                      {prompt.title}
                    </CardTitle>
                    {prompt.description && (
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {prompt.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditPrompt(prompt)}
                      data-testid={`button-edit-prompt-${prompt.id}`}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeletePrompt(prompt.id)}
                      data-testid={`button-delete-prompt-${prompt.id}`}
                      className="h-6 w-6 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                  {prompt.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInject(prompt.content)}
                    data-testid={`button-inject-prompt-${prompt.id}`}
                    className="flex-1 rounded-md text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Inject
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(prompt.content)}
                    data-testid={`button-copy-prompt-${prompt.id}`}
                    className="rounded-md"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}