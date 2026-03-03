import ChatPage from "@/components/pages/ChatPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatbot",
}

const Chatbot = () => {
  return <ChatPage />;
}

export default Chatbot;
