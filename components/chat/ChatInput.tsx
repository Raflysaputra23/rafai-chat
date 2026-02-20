/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect } from "react";
import { Plus, Send, Mic, Image as img, FileText, Video, X, Link } from "lucide-react";
import type { ChatInputProps } from "@/types/chat.d.ts";
import Image from "next/image";


export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);


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

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser tidak mendukung Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID"; // Bahasa Indonesia
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    const sound = new Audio("/audio/microphone.mp3");
    setIsRecording(true);
    sound.play();
    sound.volume = 0.5;
    recognitionRef.current?.start();
  };

  const stopRecording = () => {
    const sound = new Audio("/audio/microphone.mp3");
    setIsRecording(false);
    sound.play();
    sound.volume = 0.5;
    recognitionRef.current?.stop();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed, files);
    setPreviews([]);
    setFiles([]);
    setValue("");
    setMenuOpen(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuOpen(false);

    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        return URL.createObjectURL(file);
      } else if (file.type.startsWith('application/pdf')) {
        return `PDF:${file.size}`;
      } else {
        return `DOCS:${file.size}`;
      }
    }
    );

    setPreviews(previewUrls);
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    const size = bytes / Math.pow(1024, i);

    return `${size.toFixed(2)} ${sizes[i]}`;
  }


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const attachmentItems = [
    { icon: img, label: "Upload Gambar", color: "text-primary" },
    { icon: FileText, label: "Upload File", color: "text-primary" },
    { icon: Video, label: "Upload Video", color: "text-primary" },
    { icon: Link, label: "URL", color: "text-primary" },
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
              className="flex items-center gap-3 relative px-4 py-3 w-full hover:bg-secondary transition-colors text-sm text-foreground"
            >
              <input disabled={item.label === "URL"} type="file" multiple onChange={handleFile} className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
              <item.icon className={`h-4 w-4 ${item.color}`} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <div className="flex items-center justify-start gap-3">
          {previews.map((src, index) => {
            if (src.startsWith('PDF') || src.startsWith('DOCS')) {
              return (
                <div key={index} className="flex flex-col relative justify-center items-center px-2 py-2 rounded-md w-24 h-24 bg-primary/10 border border-primary hover:bg-secondary transition-colors text-sm text-foreground">
                  <X className="absolute text-red-500 top-2 right-2 h-4 w-4 cursor-pointer" onClick={() => { setPreviews(previews.filter((_, i) => i !== index)) }} />
                  <FileText className="h-4 w-4 text-primary mb-1" />
                  <span className="text-xs text-foreground">{src.split(':')[0]}</span>
                  <span className="text-xs text-foreground">{formatFileSize(Number(src.split(':')[1]))}</span>
                </div>
              )
            } else {
              return (
                <div key={index} className="rounded-md overflow-hidden relative w-18 h-20">
                  <X className="absolute text-red-500 top-2 right-2 h-4 w-4 cursor-pointer" onClick={() => { setPreviews(previews.filter((_, i) => i !== index)) }} />
                  <Image
                    src={src}
                    alt="Preview"
                    width={60}
                    height={100}
                    className="w-full h-full aspect-auto object-cover"
                  />
                </div>
              )
            }
          }
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Plus button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-all ${menuOpen ? "bg-primary text-primary-foreground rotate-45" : "hover:bg-secondary text-muted-foreground"
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
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-all ${isRecording
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
            className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
