import { useState } from "react";
import { motion } from "framer-motion";
import { useChat } from "../hooks/useChat";
import ChatWindow from "../components/ChatWindow";
import CategorySidebar from "../components/CategorySidebar";

export default function Chatbot() {
  const chat = useChat();
  const [category, setCategory] = useState(null);

  const handleSelectQuestion = (question) => {
    chat.sendMessage(question);
  };

  return (
    <section className="px-6 py-14 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Ask <span className="text-brand-500">FAQAI</span> anything
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-3 text-secondary"
        >
          Powered by TF-IDF and Cosine Similarity — real NLP, not keyword matching.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-10 flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-start lg:justify-center"
      >
        <CategorySidebar
          activeCategory={category}
          onSelectCategory={setCategory}
          onSelectQuestion={handleSelectQuestion}
        />
        <div className="flex-1 lg:max-w-3xl">
          <ChatWindow
            messages={chat.messages}
            isLoading={chat.isLoading}
            sendMessage={chat.sendMessage}
            clearChat={chat.clearChat}
            category={category}
          />
        </div>
      </motion.div>
    </section>
  );
}
