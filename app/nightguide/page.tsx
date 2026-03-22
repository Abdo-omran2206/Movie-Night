"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { askAI, clearConversation, getQuickSuggestions } from "../lib/NightGuide";
import { MessageParser } from "../components/MessageParser";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function NightGuidePage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm **NightGuide**. What kind of movies or shows are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = getQuickSuggestions();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e?: React.FormEvent, suggestionText?: string) {
    if (e) e.preventDefault();

    const textToSend = suggestionText || message.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    if (inputRef.current) {
        inputRef.current.style.height = "auto";
    }
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClearChat = () => {
    clearConversation();
    setMessages([
      {
        role: "assistant",
        content: "👋 Hello! I'm **NightGuide**. What kind of movies or shows are you looking for?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSubmit(undefined, suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden selection:bg-red-500/30">
      {/* Header - Minimal and Flat */}
      <div className="flex justify-between items-center px-4 md:px-8 py-4 shrink-0 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md z-10 w-full relative">
        <div className="flex items-center gap-3 cursor-pointer transition-opacity hover:opacity-80">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-red-500/30 relative shadow-[0_0_15px_rgba(220,38,38,0.2)] bg-black">
            <Image
              src="/NightGuide.png"
              alt="NightGuide Logo"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <h1 className="text-sm md:text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
            NightGuide AI
          </h1>
        </div>
        <button
          onClick={handleClearChat}
          className="text-gray-400 hover:text-red-400 transition-colors p-2.5 rounded-xl hover:bg-white/5 active:scale-95 flex items-center gap-2 group"
          title="Clear Chat"
        >
          <span className="text-xs font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            Clear
          </span>
          <FaTrash className="text-[14px]" />
        </button>
      </div>

      {/* Chat Area */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="flex-1 overflow-y-auto pb-48 px-4 md:px-6 scroll-smooth no-scrollbar relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto flex flex-col gap-8 pt-8 relative z-0">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full group animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0 mt-1 mr-4 border border-red-500/20 relative bg-black shadow-[0_0_10px_rgba(220,38,38,0.1)]">
                  <Image
                    src="/NightGuide.png"
                    alt="NightGuide"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              
              <div
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start max-w-full min-w-0 flex-1"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="text-[11px] font-medium text-gray-500 mb-1.5 ml-1 select-none">
                    NightGuide
                  </span>
                )}
                <div
                  className={`text-[15px] md:text-base leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1f1f1f] border border-white/5 shadow-md px-5 py-3 rounded-2xl max-w-[85%] md:max-w-xl text-gray-100 break-words"
                      : "text-gray-200 max-w-full font-normal break-words"
                  }`}
                >
                  <MessageParser content={msg.content} />
                </div>
              </div>
            </div>
          ))}

          {/* Initial Suggestions */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-col items-center justify-center mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group text-left text-[14px] bg-[#0f0f0f] border border-white/5 hover:border-red-500/30 text-gray-300 hover:text-white rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(220,38,38,0.1)] hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex w-full justify-start items-start animate-fade-in group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0 mt-1 mr-4 border border-red-500/20 relative bg-black">
                <Image
                  src="/NightGuide.png"
                  alt="NightGuide"
                  fill
                  className="object-cover grayscale"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col items-start pt-1">
                <span className="text-[11px] font-medium text-gray-500 mb-2 ml-1">NightGuide thinking...</span>
                <div className="flex gap-1.5 items-center h-6 px-1">
                  <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Fixed Output Box at Bottom Center */}
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent pt-16 pb-6 px-4 md:px-6 pointer-events-none">
        <div className="max-w-3xl mx-auto relative pointer-events-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end bg-[#141414] border border-white/10 rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] px-4 py-2 ring-1 ring-transparent focus-within:ring-red-500/30 focus-within:border-red-500/30 transition-all duration-300"
          >
            <textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask for a movie recommendation..."
              className="flex-1 max-h-40 min-h-[44px] py-3 pl-3 bg-transparent text-gray-100 outline-none resize-none placeholder:text-gray-500 text-[15px] leading-relaxed no-scrollbar"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // Auto resize
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
              onKeyDown={handleKeyPress}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="ml-2 mb-1 p-3 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 disabled:bg-white disabled:text-black disabled:cursor-not-allowed flex items-center justify-center shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <FaPaperPlane className="text-sm border-none ml-[-2px]" />
            </button>
          </form>
          <div className="text-center mt-3.5 opacity-60">
            <span className="text-[10px] md:text-[11px] text-gray-400 font-medium tracking-wide">
              NightGuide AI can make mistakes. Built with ❤️ and Gemini.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
