"use client";

import * as React from "react";
import {
  Sparkles,
  Bot,
  X,
  Send,
  Trash2,
  ChevronDown,
  Minimize2,
  Terminal,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am **InterviewX AI**. How can I help you today? You can ask me anything about solving coding challenges, platform features, scheduling interviews, or sandbox execution limits.",
      provider: "InterviewX AI",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reach AI service");

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am ready to assist you.",
        provider: data.provider || "InterviewX AI",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Apologies, I encountered a temporary connection error. Please try asking again.`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. What else can I help you with?",
      },
    ]);
  };

  const quickPrompts = [
    "How do I schedule an interview?",
    "Explain LRU Cache O(1) approach",
    "What are the sandbox execution limits?",
    "How do hidden test cases work?",
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Expanded Chat Drawer */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-card border border-brand-500/30 shadow-2xl shadow-brand-500/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-border bg-gradient-to-r from-brand-950/60 to-background flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  InterviewX AI
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Online Copilot & Platform Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                type="button"
                onClick={clearChat}
                className="p-1 hover:text-foreground rounded"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-foreground rounded"
                title="Minimize assistant"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs select-text">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-md bg-brand-600/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed space-y-1.5 ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-tr-none shadow-sm"
                      : "bg-muted/50 border border-border/80 text-foreground rounded-tl-none"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: m.content
                        .replace(/\n\n/g, "<br/><br/>")
                        .replace(/\n/g, "<br/>")
                        .replace(/### (.*?)(?:<br\/>|$)/g, "<strong class='block font-bold text-xs mt-1 mb-0.5 text-brand-400'>$1</strong>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/`([^`]+)`/g, "<code class='bg-black/20 px-1 py-0.2 rounded font-mono text-[11px]'>$1</code>"),
                    }}
                  />
                  {m.provider && (
                    <div className="text-[9px] text-muted-foreground font-mono pt-1 text-right opacity-70">
                      {m.provider}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-muted-foreground text-xs font-mono">
                <div className="w-6 h-6 rounded-md bg-brand-600/20 text-brand-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="animate-pulse">Thinking & analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 border-t border-border/60 bg-background/50 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground border border-border shrink-0 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 border-t border-border bg-card flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about the interview, code, or platform..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-40 transition-colors shadow-sm"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Minimized Floating Button with Glow */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 border border-white/20"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide">Ask InterviewX AI</span>
        </button>
      )}
    </div>
  );
}
