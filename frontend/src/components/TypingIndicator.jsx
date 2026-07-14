import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2.5"
    >
      <span className="icon-glow flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        <Bot className="h-4 w-4 text-brand-500" strokeWidth={2} />
      </span>
      <div className="surface-card flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
