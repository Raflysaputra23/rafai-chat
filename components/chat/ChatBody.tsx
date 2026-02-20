"use client"

import { useRef, useEffect } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { Zap, Code, Lightbulb, BookOpen } from "lucide-react";
import type { ChatAreaProps } from "@/types/chat.d.ts";


const suggestions = [
  { icon: Code, label: "Buatkan kode", desc: "REST API dengan Express.js" },
  { icon: Lightbulb, label: "Jelaskan konsep", desc: "Machine Learning dasar" },
  { icon: BookOpen, label: "Bantu pelajari", desc: "Algoritma dan struktur data" },
];

export function ChatBody({ messages, onSend, isNew, loading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Messages / Welcome */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isNew ? (
          <div className="lg:flex lg:flex-col lg:justify-center lg:items-center lg:h-full px-6 animate-fade-in py-6">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center mb-10 glow-primary">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl mx-auto md:text-4xl font-bold text-foreground mb-3 text-center">
              Halo, ada yang bisa <span className="text-primary glow-text">RafAI</span> bantu?
            </h1>
            <p className="text-muted-foreground mx-auto text-center max-w-md mb-10">
              Tanyakan apa saja — coding, belajar, atau ide kreatif. Saya siap membantu!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 mx-auto gap-3 w-full max-w-2xl">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => onSend(`${s.label}: ${s.desc}`)}
                  className="flex flex-col cursor-pointer hover:scale-105 items-start gap-2 p-4 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary/30 transition-all text-left group"
                >
                  <s.icon className="h-5 w-5 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">
            {messages.map((msg, i) => (
              <ChatMessageBubble key={i} message={msg} />
            ))}

            {/* Loading indicator */}
            <div className={`h-10 w-10 ${loading ? "visible opacity-100 scale-100 transition duration-600 ease-in-out" : "invisible opacity-0 scale-50"} flex rounded-lg bg-primary/30 shadow shadow-primary items-center justify-center mb-6 glow-primary relative`}>
              <Zap className={`${loading ? "opacity-100 scale-100 transition duration-600 ease-in-out" : "invisible opacity-0 scale-50"} h-6 w-6 text-primary`} />
              {/* Orbiting dot */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary glow-primary" />
              </div>
            </div>

            {/* Scroll to bottom */}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={onSend} />
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            RafAI bisa membuat kesalahan. Periksa info penting.
          </p>
        </div>
      </div>
    </div>
  );
}
