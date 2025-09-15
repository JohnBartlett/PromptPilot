import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import ConversationHistory from '../ConversationHistory';
import type { Conversation } from '@shared/schema';

// Mock conversations for demonstration
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Creative Writing Assistant',
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
  },
  {
    id: '4',
    title: 'Technical Documentation',
    model: 'gpt-4',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    id: '5',
    title: 'Recipe Suggestions',
    model: 'gpt-3.5-turbo',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // Last month
  }
]; // todo: remove mock functionality

export default function ConversationHistoryExample() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');

  const handleSelect = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    console.log('Selected conversation:', conversation.title);
  };

  const handleDelete = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId('');
    }
    console.log('Deleted conversation:', id);
  };

  const handleNew = () => {
    console.log('Creating new conversation');
  };

  return (
    <ThemeProvider>
      <div className="h-screen bg-background">
        <div className="w-80 h-full">
          <ConversationHistory
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelect}
            onDeleteConversation={handleDelete}
            onNewConversation={handleNew}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}