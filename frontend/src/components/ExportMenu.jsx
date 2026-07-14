import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileType } from "lucide-react";
import { exportChatAsTxt, exportChatAsPdf } from "../utils/exportChat";

export default function ExportMenu({ messages }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasContent = messages.some((m) => m.role === "user");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!hasContent}
        aria-label="Export chat"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-[var(--bg-subtle)] hover:text-brand-500 disabled:opacity-40 sm:px-3"
      >
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Export</span>
      </button>
      {open && (
        <div
          className="surface-card absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-xl py-1"
        >
          <button
            onClick={() => {
              exportChatAsTxt(messages);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-secondary hover:bg-[var(--bg-subtle)]"
          >
            <FileText className="h-3.5 w-3.5" /> as TXT
          </button>
          <button
            onClick={() => {
              exportChatAsPdf(messages);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-secondary hover:bg-[var(--bg-subtle)]"
          >
            <FileType className="h-3.5 w-3.5" /> as PDF
          </button>
        </div>
      )}
    </div>
  );
}
