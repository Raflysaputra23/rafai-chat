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

      <div
        className={`max-w-[95%] lg:max-w-[85%] prose dark:prose-invert prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "border border-primary/40 text-primary hover:bg-primary/10 rounded-br-md"
            : "bg-card border border-border text-foreground rounded-bl-md"
        }`}
      >
        <ChatRemarkdown content={message.parts[0].text} />
      </div>

      {isUser && (
        <div className="hidden shrink-0 h-8 w-8 rounded-lg bg-secondary lg:flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
