"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content: "Hi! I can help put together a quick estimate. What's your name, and what project are you working on?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, leadId }),
      });
      const json = await res.json();
      if (json.leadId) setLeadId(json.leadId);
      setMessages((prev) => [...prev, { role: "assistant", content: json.reply || "Thanks — someone will follow up shortly." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again or call/email us directly." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-40 right-4 md:bottom-28 md:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm bg-warmwhite shadow-2xl border border-warmgray/20 flex flex-col overflow-hidden" style={{ height: "min(70vh, 520px)" }}>
          <div className="bg-charcoal text-warmwhite px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Get a Quick Estimate</p>
              <p className="text-xs text-warmwhite/60">Usually replies in a few minutes</p>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] text-sm px-3 py-2 rounded-sm ${
                    m.role === "user" ? "bg-accent text-warmwhite" : "bg-stonebeige/40 text-charcoal"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] text-sm px-3 py-2 rounded-sm bg-stonebeige/40 text-warmgray">Typing...</div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-warmgray/20 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-warmgray/30 px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send"
              className="bg-charcoal text-warmwhite px-3 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 bg-accent text-warmwhite w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-accent-dark transition-colors"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
