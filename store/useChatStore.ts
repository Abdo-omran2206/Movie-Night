import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Content } from '@google/generative-ai';
import { Message } from '@/constant/types';

interface ChatState {
  messages: Message[];
  conversationHistory: Content[];
  addMessage: (message: Message) => void;
  setHistory: (history: Content[]) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          role: "assistant",
          content: "👋 Hello! I'm NightGuide. What kind of movies or shows are you looking for?",
          timestamp: new Date() as unknown as Date, // Ensure initial state has it
        },
      ],
      conversationHistory: [],
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setHistory: (history) => set({ conversationHistory: history }),
      clearChat: () => set({ 
        messages: [
          {
            role: "assistant",
            content: "👋 Hello! I'm NightGuide. What kind of movies or shows are you looking for?",
            timestamp: new Date() as unknown as Date,
          },
        ], 
        conversationHistory: [] 
      }),
    }),
    {
      name: 'movie-night-chat-store',
    }
  )
);
