"use client";

import { useCallback, useRef, useState } from "react";
import { ChatMessage } from "@/app/types";
import { sendChatMessage } from "@/app/lib/api";

interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  setInput: (value: string) => void;
  loading: boolean;
  error: string | null;
  handleSend: () => Promise<void>;
  handleClearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestIdRef = useRef(0);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    const requestId = ++latestRequestIdRef.current;

    try {
      const response = await sendChatMessage(updatedMessages);

      if (requestId !== latestRequestIdRef.current) return;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.answer,
        sources: response.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      if (requestId !== latestRequestIdRef.current) return;

      console.error("Chat error:", err);
      setError("Could not get a response right now. Please try again.");
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [input, loading, messages]);

  const handleClearError = useCallback(() => setError(null), []);

  return { messages, input, setInput, loading, error, handleSend, handleClearError };
}
