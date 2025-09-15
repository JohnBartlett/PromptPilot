import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import SavedPrompts from '../SavedPrompts';
import type { Prompt } from '@shared/schema';

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

export default function SavedPromptsExample() {
  const [prompts, setPrompts] = useState<Prompt[]>(mockPrompts);

  const handleInject = (content: string) => {
    console.log('Injecting prompt:', content.substring(0, 50) + '...');
  };

  const handleCreate = () => {
    console.log('Creating new prompt');
  };

  const handleEdit = (prompt: Prompt) => {
    console.log('Editing prompt:', prompt.title);
  };

  const handleDelete = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    console.log('Deleted prompt:', id);
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-background">
        <div className="w-80 h-full">
          <SavedPrompts
            prompts={prompts}
            onInjectPrompt={handleInject}
            onCreatePrompt={handleCreate}
            onEditPrompt={handleEdit}
            onDeletePrompt={handleDelete}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}