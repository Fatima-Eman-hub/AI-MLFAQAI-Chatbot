import { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff } from "lucide-react";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const SpeechRecognitionAPI = getSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognitionAPI) return;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div
        className="flex flex-1 items-end gap-2 rounded-2xl border px-4 py-3"
        style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-elevated)" }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={listening ? "Listening…" : "Ask about AI, ML, neural networks…"}
          rows={1}
          maxLength={500}
          disabled={disabled}
          className="max-h-32 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted disabled:opacity-50"
        />
        {SpeechRecognitionAPI && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
              listening ? "bg-red-500 text-white" : "text-muted hover:text-brand-500"
            }`}
          >
            {listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/25 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        <Send className="h-4 w-4" strokeWidth={2} />
      </button>
    </form>
  );
}
