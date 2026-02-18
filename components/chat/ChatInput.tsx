"use client"

import { useState, useRef, useEffect } from "react";
import { Plus, Send, Mic, Image, FileText, Video, X } from "lucide-react";
import type { ChatInputProps } from "@/types/chat.d.ts";


export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    setMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const attachmentItems = [
    { icon: Image, label: "Upload Gambar", color: "text-primary" },
    { icon: FileText, label: "Upload File", color: "text-accent" },
    { icon: Video, label: "Upload Video", color: "text-primary" },
  ];

  return (
    <div className="relative">
      {/* Attachment menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in z-10"
        >
          {attachmentItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-4 py-3 w-full hover:bg-secondary transition-colors text-sm text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <item.icon className={`h-4 w-4 ${item.color}`} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        {/* Plus button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-all ${
            menuOpen ? "bg-primary text-primary-foreground rotate-45" : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan..."
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground py-2 max-h-40 scrollbar-thin"
        />

        {/* Voice button */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-all ${
            isRecording
              ? "bg-destructive text-destructive-foreground animate-pulse"
              : "hover:bg-secondary text-muted-foreground"
          }`}
        >
          {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-primary"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
