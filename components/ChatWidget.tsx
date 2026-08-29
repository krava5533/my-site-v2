"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, X, Send, Paperclip } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  imagePreview?: string; // local data URL, for display only
}

const GREETING: Message = {
  role: "assistant",
  content: "Hey there! Tell me a bit about your project — what room, roughly how big — and I can give you a ballpark idea right away. You can also upload a photo of the space for design suggestions.",
};

const MAX_IMAGE_MB = 8;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendToApi(nextMessages: Message[], image?: { mediaType: string; data: string }) {
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          leadId,
          image,
        }),
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

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    await sendToApi(nextMessages);
  }

  function handlePhotoClick() {
    setPhotoError(null);
    fileInputRef.current?.click();
  }

  async function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setPhotoError(`Image is too large — please keep it under ${MAX_IMAGE_MB}MB.`);
      return;
    }

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const [, base64] = dataUrl.split(",");
    const caption = input.trim() || "Here's a photo of my space — what would you suggest?";
    setInput("");

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: caption, imagePreview: dataUrl },
    ];
    setMessages(nextMessages);

    await sendToApi(nextMessages, { mediaType: file.type, data: base64 });
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
                  {m.imagePreview && (
                    <div className="relative w-40 h-32 mb-2">
                      <Image src={m.imagePreview} alt="Uploaded room photo" fill className="object-cover rounded-sm" unoptimized />
                    </div>
                  )}
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

          {photoError && <p className="form-error px-3">{photoError}</p>}

          <form onSubmit={handleSend} className="border-t border-warmgray/20 p-3 flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelected}
            />
            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={sending}
              aria-label="Upload a photo"
              className="border border-warmgray/30 px-2.5 text-charcoal hover:border-accent disabled:opacity-40"
            >
              <Paperclip size={16} />
            </button>
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
