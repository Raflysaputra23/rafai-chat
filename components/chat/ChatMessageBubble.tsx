import { Zap, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat.d.ts";
import ChatRemarkdown from "./ChatRemarkdown";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 py-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="hidden shrink-0 h-8 w-8 rounded-lg bg-primary/15 lg:flex items-center justify-center mt-1">
          <Zap className="h-4 w-4 text-primary" />
        </div>
      )}

      {!message.parts[0].text ?
        <div className={`h-10 w-10 visible opacity-100 scale-100 transition duration-600 ease-in-out flex rounded-lg bg-primary/30 shadow shadow-primary items-center justify-center mb-6 glow-primary relative`}>
          <Zap className={`opacity-100 scale-100 transition duration-600 ease-in-out h-6 w-6 text-primary`} />
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary glow-primary" />
          </div>
        </div>
        :
        <div
          className={`max-w-[95%] lg:max-w-[85%] prose dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
            ? "border border-primary/40 text-primary hover:bg-primary/10 rounded-br-md"
            : "bg-card border border-border text-foreground rounded-bl-md"
            }`}
        >
          <ChatRemarkdown content={message.parts[0].text} />
        </div>
      }

      {isUser && (
        <div className="hidden shrink-0 h-8 w-8 rounded-lg bg-secondary lg:flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
