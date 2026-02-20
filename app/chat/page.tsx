"use client"

import { useEffect, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatBody } from "@/components/chat/ChatBody";
import { Menu } from "lucide-react";
import type { ChatConversation, ChatMessage } from "@/types/chat.d.ts";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

const Chatbot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([
    { id: "1", title: "Cara membuat REST API", createdAt: new Date() },
    { id: "2", title: "Belajar Machine Learning", createdAt: new Date() },
    { id: "3", title: "Deploy aplikasi ke cloud", createdAt: new Date() },
  ]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
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
      { role: "user", parts: [{ text: "Halo, bagaimana cara membuat REST API?" }] },
      { role: "model", parts: [{ text: "Halo! Untuk membuat REST API, kamu bisa menggunakan beberapa framework populer seperti:\n\n1. **Express.js** (Node.js)\n2. **FastAPI** (Python)\n3. **Spring Boot** (Java)\n\nMau saya jelaskan langkah-langkahnya dengan framework tertentu?" }] },
    ]);
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    const userMsg: ChatMessage = { role: "user", parts: [{ text: content }] };
    setMessages((prev) => [...prev, userMsg]);
    setLoadingText(true);

    if (!activeConversation) {
      const newConv: ChatConversation = {
        id: crypto.randomUUID(),
        title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        createdAt: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv.id);
    }

    // Mock bot response
    const response = await handleRespon(content, files);
    setLoadingText(false);
    if(response) {
      const botMsg: ChatMessage = { role: "model", parts: [{ text: response }] };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleRespon = async (prompt: string, file?: File[]) => {
    try {
      const formdata = new FormData();
      formdata.append("prompt", prompt);
      if (file) {
        file.forEach((f) => formdata.append("files", f));
        formdata.append("typeChat", "multimodal");
      }

      const res = await fetch("http://localhost:3000/api/v1", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_KEY
        },
        body: formdata
      });

      if (res.status === 200) {
        const data = await res.json();
        return data.response;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }



  return loading ? <LoadingScreen onFinish={() => setLoading(false)} /> : (
    <div className={`flex h-screen w-full bg-background ${isDark && "dark"}`}>
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
        loading={loadingText}
        isNew={!activeConversation && messages.length === 0}
      />
    </div>
  );
};

export default Chatbot;
