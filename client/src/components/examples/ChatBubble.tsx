import { ThemeProvider } from '../ThemeProvider';
import ChatBubble from '../ChatBubble';
import type { Message } from '@shared/schema';

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: 'conv-1',
    role: 'user',
    content: 'Can you help me write a creative short story about a robot learning to paint?',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    conversationId: 'conv-1', 
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
    createdAt: new Date('2024-01-15T10:31:30')
  }
]; // todo: remove mock functionality

export default function ChatBubbleExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-6">Chat Messages</h3>
          {mockMessages.map((message, index) => (
            <ChatBubble 
              key={message.id} 
              message={message} 
              isLast={index === mockMessages.length - 1}
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}