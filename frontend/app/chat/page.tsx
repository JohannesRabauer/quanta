"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/app/hooks/useChat";
import ChatBubble from "@/app/components/ChatBubble";

export default function ChatPage() {
  const { messages, input, setInput, loading, error, handleSend, handleClearError } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-shrink-0 relative z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl"
      >
        <div className="max-w-screen-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Image
                  src="/logo.png"
                  alt="Quanta Logo"
                  width={36}
                  height={36}
                  style={{
                    filter: "invert(1) hue-rotate(180deg) drop-shadow(0 0 10px rgba(6,182,212,0.6))",
                  }}
                  className="opacity-90"
                />
              </motion.div>
              <motion.h1
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent tracking-wide"
              >
                Quanta
              </motion.h1>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xs text-gray-500 border border-white/10 rounded-full px-2 py-0.5"
              >
                Chat
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </Link>
            </motion.div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Ask questions about your indexed files and get grounded answers.
          </p>
        </div>
      </motion.header>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          <AnimatePresence>
            {messages.length === 0 && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    className="w-16 h-16 mx-auto mb-5 text-gray-700/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </motion.div>
                <p className="text-gray-500 text-sm">Ask anything about your indexed files</p>
                <p className="text-gray-600/60 text-xs mt-2">
                  Answers are grounded in your local documents
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} index={index} />
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay) => (
                    <motion.span
                      key={delay}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay }}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400/70"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 border border-rose-500/20 bg-rose-500/8">
                <p className="text-sm font-medium text-rose-200">Something went wrong</p>
                <p className="mt-0.5 text-xs text-rose-200/80">{error}</p>
                <button
                  onClick={handleClearError}
                  className="mt-2 text-xs text-rose-300/60 hover:text-rose-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 relative z-10 border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="relative flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] focus-within:border-cyan-500/50 focus-within:bg-white/[0.06] transition-all duration-200">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your files... (Enter to send, Shift+Enter for newline)"
                disabled={loading}
                rows={1}
                className="w-full px-4 py-3.5 text-sm text-white bg-transparent outline-none placeholder-gray-500 resize-none max-h-40 overflow-y-auto disabled:opacity-50"
                style={{ minHeight: "52px" }}
                aria-label="Chat message input"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void handleSend()}
              disabled={loading || !input.trim()}
              className="px-5 py-3.5 rounded-xl font-medium bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex-shrink-0 flex items-center gap-2"
              aria-label="Send message"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                  />
                  Thinking
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </main>
  );
}
