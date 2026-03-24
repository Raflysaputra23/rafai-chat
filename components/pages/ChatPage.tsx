/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef, useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatBody } from "@/components/chat/ChatBody";
import { Menu } from "lucide-react";
import type { ChatConversation, ChatMessage } from "@/types/chat.d.ts";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { useTheme } from "@/hooks/useTheme";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { toastError, toastSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";


const ChatPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingText, setLoadingText] = useState(false);
    const [apikey, setApikey] = useState<string>("");
    const [model, setModel] = useState<string>("gemini-3-flash-preview");
    const [openModal, setOpenModal] = useState(false);
    const [thinking, setThinking] = useState<null | string>("");
    const [response, setResponse] = useState<string>("");
    const { isDark } = useTheme();
    const router = useRouter();
    const abortControllerRef = useRef<AbortController>(null);

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

    const getConversation = async () => {
        const supabase = createClient();
        if (user) {
            const { data, error } = await supabase.from("conversations")
                .select("*")
                .eq("id_user", user.id)
                .order("created_at", { ascending: false });
            if (!error && data) {
                setConversations(data);
            }
        }
    }

    const getChat = async () => {
        const supabase = createClient();
        if (apikey) {
            if (activeConversation) {
                const { data } = await supabase
                    .from("chats").select("*")
                    .eq("apikey", apikey)
                    .eq("idcv", activeConversation)
                    .maybeSingle();
                if (data) {
                    setMessages(JSON.parse(data.history));
                }
            } else {
                setMessages([]);
            }
        }
    }


    const getApikey = async () => {
        const supabase = createClient();
        if (user) {
            const { error, data }: any = await supabase.from("apikeys")
                .select("*")
                .eq("id_user", user.id)
                .limit(1);
            if (data.length <= 0) {
                toastError("Anda harus membuat api key terlebih dahulu!");
                router.push("/dashboard");
                return;
            }
            if (!error && data.length > 0) {
                setApikey(data[0].apikey);
            }
        }
    }

    useEffect(() => {
        (async () => {
            await getApikey();
            await getConversation();
            setLoading(false);
        })();
    }, [user]);

    useEffect(() => {
        (async () => {
            await getChat();
        })();
    }, [activeConversation, apikey]);

    const handleNewChat = () => {
        setActiveConversation(null);
        setMessages([]);
    };

    const handleSelectConversation = (id: string) => {
        setActiveConversation(id);
    };

    const handleDeleteConversation = async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase.from("conversations").delete().eq("id", id);
        if (!error) {
            setConversations((prev) => prev.filter((conv) => conv.id !== id));
        }
    };

    const handleSendMessage = async (content: string, files?: File[], link?: string) => {
        const supabase = createClient();
        const userMsg: ChatMessage = { role: "user", parts: [{ text: `${(!!link ? `(Link Youtube: ${link})` : '')} ${content}` }] };
        setMessages((prev) => [...prev, userMsg]);
        setThinking(null);
        setLoadingText(true);

        let idcv = activeConversation;
        if (!activeConversation && user) {
            const newConvId = uuidv4();
            const newConv: ChatConversation = {
                id: newConvId,
                title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
                created_at: new Date(),
            };
            const { error } = await supabase.from("conversations").insert({ ...newConv, id_user: user.id });
            if (error) {
                console.log(error);
                return;
            };
            setConversations((prev) => [newConv, ...prev]);
            setActiveConversation(newConv.id);
            idcv = newConvId;
        }

        // Mock bot response
        const response = await handleRespon(content, idcv, files, link);
        if (!response) {
            if (messages.length < 1) await handleDeleteConversation(idcv ?? "");
        }

    };

    const parseAIResponse = (text: string) => {
        const thinkingStart = text.indexOf("<thinking>");
        const thinkingEnd = text.indexOf("</thinking>");

        let thinking = null;
        let finalResponse = text;

        if (thinkingStart !== -1) {
            if (thinkingEnd !== -1) {
                thinking = text.substring(thinkingStart + 10, thinkingEnd).trim();
                finalResponse = text.substring(thinkingEnd + 11).trim();
            } else {
                thinking = text.substring(thinkingStart + 10).trim();
                finalResponse = "";
            }
        }

        return { thinking, finalResponse };
    };

    const handleRespon = async (prompt: string, idcv?: string | null, file?: File[], link?: string) => {
        let fullText = "";

        try {
            const formdata = new FormData();
            formdata.append("prompt", prompt);
            formdata.append("idcv", idcv ?? "");
            formdata.append("model", model);
            if (link) {
                const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/|embed\/)?[A-Za-z0-9_-]{11}.*$/;
                if (!ytRegex.test(link)) {
                    if (!Boolean(messages.length)) await handleDeleteConversation(idcv ?? "");
                    return `Link youtube Tidak Valid`;
                }
                formdata.append("url", link);
                formdata.append("typeChat", "multimodal");
            };
            if (file && file.length > 0) {
                file.forEach((f) => formdata.append("files", f));
                formdata.append("typeChat", "multimodal");
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const res = await fetch(`${process.env.NEXT_PUBLIC_URL_DOMAIN}/api/v2`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apikey}`
                },
                body: formdata,
                signal: controller.signal
            });

            if (!res.body) throw new Error("RafAI tidak merespon");
            if (res.status === 500) throw new Error("RafAI Server Error");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                const chunkValue = decoder.decode(value);
                fullText += chunkValue;

                const { thinking, finalResponse } = parseAIResponse(fullText);
                setThinking(thinking);
                setResponse(finalResponse);
            }

            const cleanText = fullText.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
            const botMsg: ChatMessage = { role: "model", parts: [{ text: cleanText }] };
            setMessages((prev) => [...prev, botMsg]);
            return true;
        } catch (error) {
            // TANGKEP ABORT ERROR
            if(error instanceof Error && error.name === 'AbortError') {
                const botMsg: ChatMessage = { role: "model", parts: [{ text: fullText }] };
                setMessages((prev) => [...prev, botMsg]);
                return true;
            } else {
                const botMsg: ChatMessage = { role: "model", parts: [{ text: 'RafAI tidak merespon, coba beberapa saat lagi.' }] };
                setMessages((prev) => [...prev, botMsg]);
                return false;
            }
        } finally {
            setLoadingText(false);
            setResponse("");
            abortControllerRef.current = null;
        }
    }

    const handleStopResponse = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoadingText(false);
        }
    };

    if (authLoading || loading) {
        return <LoadingScreen statusLoading={authLoading || loading} />
    }

    return (
        <div className={`flex h-screen w-full bg-background ${isDark && "dark"}`}>
            {/* Mobile toggle */}
            <Button
                variant={"hero"}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-40 p-2 rounded-lg w-10 h-10 lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </Button>

            <ChatSidebar
                modalOpen={openModal}
                setModalOpen={setOpenModal}
                model={model}
                setModel={setModel}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                conversations={conversations}
                activeId={activeConversation}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                setConversations={setConversations}
            />

            <ChatBody
                onStopResponse={handleStopResponse}
                stream={response}
                thinking={thinking}
                messages={messages}
                onSend={handleSendMessage}
                loading={loadingText}
                isNew={!activeConversation && messages.length === 0}
            />
        </div>
    );
};

export default ChatPage;
