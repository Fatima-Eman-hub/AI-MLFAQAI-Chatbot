import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, AlertCircle, Copy, Check, Volume2, Square } from "lucide-react";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ConfidenceBadge({ confidence, matched }) {
  if (confidence === undefined || confidence === null) return null;
  const pct = Math.round(confidence * 100);
  const tone = matched
    ? pct >= 70
      ? "text-emerald-500"
      : "text-amber-500"
    : "text-secondary";

  return (
    <span className={`text-xs font-medium ${tone}`}>
      {matched ? `${pct}% match` : `${pct}% (below threshold)`}
    </span>
  );
}

export default function ChatBubble({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <span
        className={`icon-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-gradient-to-br from-brand-500 to-brand-700" : ""
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" strokeWidth={2} />
        ) : message.isError ? (
          <AlertCircle className="h-4 w-4 text-amber-500" strokeWidth={2} />
        ) : (
          <Bot className="h-4 w-4 text-brand-500" strokeWidth={2} />
        )}
      </span>

      <div className={`flex max-w-[78%] flex-col gap-1 sm:max-w-[65%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
            isUser
              ? "rounded-br-md bg-gradient-to-br from-brand-500 to-brand-700 text-white"
              : "surface-card rounded-bl-md"
          }`}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-muted">{formatTime(message.timestamp)}</span>
          {!isUser && !message.isError && (
            <ConfidenceBadge confidence={message.confidence} matched={message.matched} />
          )}
          {!isUser && !message.isError && (
            <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={handleCopy}
                aria-label="Copy response"
                className="flex h-5 w-5 items-center justify-center rounded text-muted hover:text-brand-500"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {canSpeak && (
                <button
                  onClick={handleSpeak}
                  aria-label={speaking ? "Stop reading" : "Read answer aloud"}
                  className="flex h-5 w-5 items-center justify-center rounded text-muted hover:text-brand-500"
                >
                  {speaking ? <Square className="h-3 w-3" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
