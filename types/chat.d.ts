export interface ChatConversation {
  id: string;
  title: string;
  createdAt: Date;
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
}

interface ChatInputProps {
  onSend: (content: string, files?: File[]) => void;
}

interface ChatAreaProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  isNew: boolean;
  loading: boolean;
}