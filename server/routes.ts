import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendChatMessage, streamChatMessage } from "./openai";
import { insertPromptSchema, insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prompts API
  app.get("/api/prompts", async (req, res) => {
    try {
      const prompts = await storage.getPrompts();
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  app.post("/api/prompts", async (req, res) => {
    try {
      const promptData = insertPromptSchema.parse(req.body);
      const prompt = await storage.createPrompt(promptData);
      res.json(prompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid prompt data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create prompt" });
      }
    }
  });

  app.put("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertPromptSchema.partial().parse(req.body);
      const prompt = await storage.updatePrompt(id, updateData);
      
      if (!prompt) {
        res.status(404).json({ error: "Prompt not found" });
        return;
      }
      
      res.json(prompt);
    } catch (error) {
      console.error("Error updating prompt:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid prompt data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update prompt" });
      }
    }
  });

  app.delete("/api/prompts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePrompt(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Prompt not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting prompt:", error);
      res.status(500).json({ error: "Failed to delete prompt" });
    }
  });

  // Conversations API
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(conversationData);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid conversation data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create conversation" });
      }
    }
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteConversation(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Messages API
  app.get("/api/conversations/:conversationId/messages", async (req, res) => {
    try {
      const { conversationId } = req.params;
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Chat API - Send message to OpenAI
  app.post("/api/chat", async (req, res) => {
    try {
      const { conversationId, message, model = "gpt-5" } = req.body;
      
      if (!conversationId || !message) {
        res.status(400).json({ error: "conversationId and message are required" });
        return;
      }

      // Get conversation to verify it exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }

      // Store user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content: message,
      });

      // Get conversation history
      const messages = await storage.getMessages(conversationId);
      const chatMessages = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Send to OpenAI
      const response = await sendChatMessage(chatMessages, model);

      // Store assistant response
      const assistantMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: response,
      });

      res.json({ 
        userMessage, 
        assistantMessage 
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Chat streaming API
  app.post("/api/chat/stream", async (req, res) => {
    try {
      const { conversationId, message, model = "gpt-5" } = req.body;
      
      if (!conversationId || !message) {
        res.status(400).json({ error: "conversationId and message are required" });
        return;
      }

      // Get conversation to verify it exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }

      // Store user message
      await storage.createMessage({
        conversationId,
        role: "user",
        content: message,
      });

      // Get conversation history
      const messages = await storage.getMessages(conversationId);
      const chatMessages = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Set up streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      let fullResponse = "";
      let messageStored = false;
      
      try {
        for await (const chunk of streamChatMessage(chatMessages, model)) {
          fullResponse = chunk.content;
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          // Force flush if available
          if (typeof res.flush === 'function') {
            res.flush();
          }
          
          if (chunk.finished && !messageStored) {
            // Store the complete assistant response
            await storage.createMessage({
              conversationId,
              role: "assistant",
              content: fullResponse,
            });
            messageStored = true;
          }
        }
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        const errorMessage = streamError instanceof Error ? streamError.message : String(streamError);
        res.write(`data: ${JSON.stringify({ error: "Streaming failed: " + errorMessage })}\n\n`);
      }
      
      res.end();
    } catch (error) {
      console.error("Error in streaming chat:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to process streaming chat" });
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.write(`data: ${JSON.stringify({ error: "Server error: " + errorMessage })}\n\n`);
        res.end();
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
