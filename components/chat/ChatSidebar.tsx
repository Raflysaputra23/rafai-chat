import { Plus, MessageSquare, Zap, X } from "lucide-react";
import type { ChatConversation, ChatSidebarProps } from "@/types/chat.d.ts";
import { Button } from "../ui/button";


export function ChatSidebar({ open, onClose, conversations, activeId, onSelect, onNewChat }: ChatSidebarProps) {
  const today = new Date();
  const todayConvs = conversations.filter(
    (c) => c.createdAt.toDateString() === today.toDateString()
  );
  const olderConvs = conversations.filter(
    (c) => c.createdAt.toDateString() !== today.toDateString()
  );

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative z-40 h-full flex flex-col
          bg-sidebar-background border-r border-sidebar-border
          transition-all duration-300 ease-in-out
          ${open ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0"}
          overflow-hidden
        `}
      >
        <div className="shrink-0 p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground tracking-tight">RafAI</span>
            </div>
            <Button onClick={onClose} variant={"hero"} className="w-10 h-10 rounded-lg md:hidden">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            variant={"heroOutline"}
            onClick={onNewChat}
            className="w-full flex justify-start items-center gap-2 p-5 rounded-lg bg-primary/10 hover:bg-primary/50  transition-colors text-sm font-medium text-foreground"
          >
            <Plus className="h-4 w-4" />
            Percakapan Baru
          </Button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4">
          {todayConvs.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">Hari Ini</p>
              {todayConvs.map((c) => (
                <ConversationItem key={c.id} conv={c} active={c.id === activeId} onSelect={onSelect} />
              ))}
            </div>
          )}

          {olderConvs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground px-2 mb-2 uppercase tracking-wider">Sebelumnya</p>
              {olderConvs.map((c) => (
                <ConversationItem key={c.id} conv={c} active={c.id === activeId} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function ConversationItem({ conv, active, onSelect }: { conv: ChatConversation; active: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      onClick={() => onSelect(conv.id)}
      className={`
        w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors mb-1
        ${active
          ? "bg-primary/15 text-primary font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
        }
      `}
    >
      <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
      <span className="truncate">{conv.title}</span>
    </button>
  );
}
