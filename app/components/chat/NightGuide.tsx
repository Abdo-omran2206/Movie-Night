"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { askAI, clearConversation, getQuickSuggestions } from "@/app/lib/NightGuide";
import { MessageParser } from "./MessageParser";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Message } from "@/app/constant/types";

export default function NightGuide() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm NightGuide. What kind of movies or shows are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const suggestions = getQuickSuggestions();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const handleClick = () => {
    setOpen(!open);
  };

  async function handleSubmit(e?: React.FormEvent, suggestionText?: string) {
    e?.preventDefault();

    const textToSend = suggestionText || message.trim();
    
    if (!textToSend || loading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await askAI(textToSend);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Night Guide error:", error);
      
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }



  const handleClearChat = () => {
    clearConversation(); // Clear AI conversation history
    setMessages([
      {
        role: "assistant",
        content: "👋 Hello! I'm NightGuide. What kind of movies or shows are you looking for?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(undefined, suggestion);
  };

  // Don't show the floating widget on the full-page chat route
  if (pathname === "/nightguide" || pathname.includes("player")) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-60 animate-in fade-in slide-in-from-bottom-10 duration-500">
        <button
          onClick={handleClick}
          aria-label="Open Night Guide Chatbot"
          className="relative group"
        >
          <Image
            src="/NightGuide.png"
            alt="Night Guide Chatbot"
            height={80}
            width={80}
            quality={75}
            priority
            sizes="(max-width: 768px) 52px, 80px"
            className="
              w-13
              md:w-20
              md:h-20
              rounded-full 
              ring-2 
              ring-red-700 
              hover:scale-110 
              transition-transform 
              duration-200 
              cursor-pointer
              shadow-lg
            "
          />
          {/* Notification Badge */}
          {!open && messages.length > 1 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {messages.filter((m) => m.role === "assistant").length - 1}
            </span>
          )}
        </button>
      </div>

      {/* Chat Modal */}
      {open && (
        <div className="fixed bottom-16 right-2.5 md:bottom-28 md:right-6 z-60 w-[380px] max-w-[calc(100vw-2rem)] bg-[#050505] text-white rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden flex flex-col max-h-[600px] animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Link href="/nightguide" className="text-lg font-bold tracking-wider text-red-600">Night Guide</Link>
              <span className="text-xs text-gray-400">🎬 AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                🗑️
              </button>
              <button
                onClick={handleClick}
                className="text-gray-400 hover:text-white text-xl leading-none"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth bg-linear-to-b from-white/5 to-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="text-[10px] text-gray-500 mb-1 ml-1 select-none font-medium">NightGuide</span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#1f1f1f] text-gray-100 border border-white/5 rounded-br-sm"
                      : "bg-transparent text-gray-200 border border-white/5 rounded-bl-sm"
                  }`}
                >
                  <div>
                    <MessageParser content={msg.content} />
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Suggestions - Show only at start */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-400 px-1">Quick suggestions:</p>
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left text-xs bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-colors"
                  >
                    💡 {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-transparent border border-white/5 rounded-2xl rounded-bl-sm px-4 py-4">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center bg-[#141414] border border-white/10 p-1.5 rounded-full ring-1 ring-transparent focus-within:ring-red-500/30 transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask for a movie..."
                className="flex-1 px-3 py-2 bg-transparent text-gray-100 text-[14px] outline-none placeholder:text-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (message.trim()) handleSubmit();
                  }
                }}
                disabled={loading}
              />

              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="bg-white text-black h-9 w-9 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black shrink-0"
              >
                <svg className="w-4 h-4 ml-[-2px]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}