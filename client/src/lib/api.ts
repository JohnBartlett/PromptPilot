import type { Prompt, Conversation, Message, InsertPrompt, InsertConversation, OpenAIModel } from "@shared/schema";

const API_BASE = "/api";

// Prompts API
export async function getPrompts(): Promise<Prompt[]> {
  const response = await fetch(`${API_BASE}/prompts`);
  if (!response.ok) throw new Error("Failed to fetch prompts");
  return response.json();
}

export async function createPrompt(prompt: InsertPrompt): Promise<Prompt> {
  const response = await fetch(`${API_BASE}/prompts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });
  if (!response.ok) throw new Error("Failed to create prompt");
  return response.json();
}

export async function updatePrompt(id: string, prompt: Partial<InsertPrompt>): Promise<Prompt> {
  const response = await fetch(`${API_BASE}/prompts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });
  if (!response.ok) throw new Error("Failed to update prompt");
  return response.json();
}

export async function deletePrompt(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/prompts/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete prompt");
}

// Conversations API
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/conversations`);
  if (!response.ok) throw new Error("Failed to fetch conversations");
  return response.json();
}

export async function createConversation(conversation: InsertConversation): Promise<Conversation> {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conversation),
  });
  if (!response.ok) throw new Error("Failed to create conversation");
  return response.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/conversations/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete conversation");
}

// Messages API
export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

// Chat API
export interface ChatResponse {
  userMessage: Message;
  assistantMessage: Message;
}

export async function sendChatMessage(
  conversationId: string,
  message: string,
  model: OpenAIModel = "gpt-5"
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, message, model }),
  });
  if (!response.ok) throw new Error("Failed to send chat message");
  return response.json();
}

// Streaming chat API
export interface StreamingChatOptions {
  conversationId: string;
  message: string;
  model?: OpenAIModel;
  onChunk?: (content: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: string) => void;
}

export async function sendStreamingChatMessage(options: StreamingChatOptions): Promise<void> {
  const { conversationId, message, model = "gpt-5", onChunk, onComplete, onError } = options;

  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message, model }),
    });

    if (!response.ok) {
      throw new Error("Failed to start streaming chat");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              onError?.(parsed.error);
              return;
            }
            if (parsed.content !== undefined) {
              onChunk?.(parsed.content);
              if (parsed.finished) {
                onComplete?.(parsed.content);
                return;
              }
            }
          } catch (e) {
            console.warn("Failed to parse SSE data:", data, e);
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    onError?.(error instanceof Error ? error.message : "Unknown streaming error");
  }
}