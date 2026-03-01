export interface ChatConversation {
  id: string;
  title: string;
  created_at: Date;
}

export interface ChatMessage {
  role: string
  parts: [{
    text: string
  }]
}

export interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  setModel: (model: string) => void;
  model: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

interface ChatInputProps {
  onSend: (content: string, files?: File[], link?: string) => void;
}

interface ChatAreaProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  isNew: boolean;
  loading: boolean;
}