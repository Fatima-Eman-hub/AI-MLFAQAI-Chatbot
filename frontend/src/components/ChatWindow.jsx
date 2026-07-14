import { useEffect, useRef } from "react";
import { Trash2, Bot } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import ExportMenu from "./ExportMenu";

export default function ChatWindow({ messages, isLoading, sendMessage, clearChat, category }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const showSuggestions = (messages.length <= 1 || Boolean(category)) && !isLoading;

  return (
    <div className="surface-card mx-auto flex h-[70vh] max-w-3xl flex-col overflow-hidden rounded-3xl sm:h-[75vh]">
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-3 sm:px-5 sm:py-4"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="icon-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9">
            <Bot className="h-4 w-4 text-brand-500" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">FAQAI Assistant</p>
            <p className="hidden items-center gap-1.5 text-xs text-secondary sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ExportMenu messages={messages} />
          <button
            onClick={clearChat}
            aria-label="Clear chat"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-[var(--bg-subtle)] hover:text-red-500 sm:px-3"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-5 sm:py-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      {/* Suggestions + Input */}
      <div className="shrink-0 space-y-3 border-t px-3 py-3 sm:px-5 sm:py-4" style={{ borderColor: "var(--border-subtle)" }}>
        {showSuggestions && <SuggestedQuestions onSelect={sendMessage} disabled={isLoading} category={category} />}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
