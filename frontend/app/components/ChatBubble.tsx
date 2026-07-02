import { motion } from "framer-motion";
import { ChatMessage } from "@/app/types";
import SourceCitations from "./SourceCitations";

interface ChatBubbleProps {
  message: ChatMessage;
  index: number;
}

export default function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-cyan-600/20 border border-cyan-500/30 text-white rounded-br-sm"
            : "bg-white/[0.05] border border-white/[0.08] text-gray-200 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCitations sources={message.sources} />
        )}
      </div>
    </motion.div>
  );
}
