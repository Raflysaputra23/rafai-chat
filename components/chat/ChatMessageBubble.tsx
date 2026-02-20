import { Zap, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat.d.ts";

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 py-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="shrink-0 h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center mt-1">
          <Zap className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "border border-primary/40 text-primary hover:bg-primary/10 rounded-br-md"
            : "bg-card border border-border text-foreground rounded-bl-md"
        }`}
      >
        {message.parts[0].text.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </p>
        ))}
      </div>

      {isUser && (
        <div className="shrink-0 h-8 w-8 rounded-lg bg-secondary flex items-center justify-center mt-1">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
