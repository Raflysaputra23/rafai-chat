"use client"

import { ChatConversation } from "@/types/chat";
import { MessageSquare, Trash2 } from "lucide-react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";


const ConversationItem = ({ conv, active, onSelect, setConversations }: { conv: ChatConversation; active: boolean; onSelect: (id: string) => void, setConversations: (callback: (prev: ChatConversation[]) => ChatConversation[]) => void }) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const id = conv.id;
        const supabase = createClient();
        const { error } = await supabase.from("conversations").delete().eq("id", conv.id);
        if (!error) {
            setConversations((prev)=> prev.filter((conv) => conv.id !== id));
        }
    }

    const handleShowModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowModal((prev) => !prev);
    }

    return (<>
        <button
            onClick={() => onSelect(conv.id)}
            className={`
        w-full flex cursor-pointer group relative items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors mb-1
        ${active
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }
      `}
        >
            <MessageSquare className="inline-block opacity-60 group-hover:opacity-0 group-hover:hidden h-4 w-4 shrink-0 " />
            <Trash2 onClick={(e) => handleShowModal(e)} className="hidden opacity-0 h-4 w-4 shrink-0 text-red-500 group-hover:opacity-60 group-hover:inline-block transition" />
            <span className="truncate">{conv.title}</span>
        </button>

        {/* Information Delete Conversations */}
        <Modal showForm={showModal} size="lg" resetForm={() => setShowModal(false)}>
            <h1 className='text-xl font-black mb-2'>Hapus</h1>
            <p className='text-sm text-muted-foreground mb-4'>Apakah anda yakin ingin menghapus cluster ini?</p>
            <div className='flex justify-end gap-2'>
                <Button onClick={() => setShowModal(false)} variant="hero" className="" size={"default"}>
                    Tidak
                </Button>
                <Button onClick={handleDelete} variant="hero" className="bg-red-500 border  cursor-pointer hover:bg-red-500/80 text-foreground" size={"default"}>
                    Hapus
                </Button>
            </div>
        </Modal>
    </>
    );
}

export default ConversationItem;