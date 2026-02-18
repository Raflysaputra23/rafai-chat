"use client"

import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatBody } from "@/components/chat/ChatBody";
import { Menu } from "lucide-react";
import type { ChatConversation, ChatMessage } from "@/types/chat.d.ts";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([
    { id: "1", title: "Cara membuat REST API", createdAt: new Date() },
    { id: "2", title: "Belajar Machine Learning", createdAt: new Date() },
    { id: "3", title: "Deploy aplikasi ke cloud", createdAt: new Date() },
  ]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const handleResize = () => {
        if(window.innerWidth > 768) {
            setSidebarOpen(true)
        }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize)
    };
  }, []);

  const handleNewChat = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    // Mock messages for demo
    setMessages([
      { id: "m1", role: "user", content: "Halo, bagaimana cara membuat REST API?" },
      { id: "m2", role: "assistant", content: "Halo! Untuk membuat REST API, kamu bisa menggunakan beberapa framework populer seperti:\n\n1. **Express.js** (Node.js)\n2. **FastAPI** (Python)\n3. **Spring Boot** (Java)\n\nMau saya jelaskan langkah-langkahnya dengan framework tertentu?" },
    ]);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);

    if (!activeConversation) {
      const newConv: ChatConversation = {
        id: Date.now().toString(),
        title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        createdAt: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv.id);
    }

    // Mock bot response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Terima kasih atas pertanyaannya! Saya adalah RafAI, asisten AI yang siap membantu kamu. Fitur ini masih dalam tahap demo, tapi nanti saya akan bisa menjawab pertanyaan kamu secara lengkap. 🚀",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full bg-background dark">
      {/* Mobile toggle */}
      <Button
        variant={"hero"}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg w-10 h-10 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeConversation}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <ChatBody
        messages={messages}
        onSend={handleSendMessage}
        isNew={!activeConversation && messages.length === 0}
      />
    </div>
  );
};

export default Index;
