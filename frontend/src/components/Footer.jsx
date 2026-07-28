import { Link } from "react-router-dom";
import { Brain, ExternalLink } from "lucide-react";
import GithubIcon from "./GithubIcon";

const PAGES = [
  { label: "Home", hash: "#home" },
  { label: "Chatbot", to: "/chatbot" },
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
];

const TECH_STACK = ["React + Vite", "Tailwind CSS", "FastAPI", "NLTK + Scikit-learn", "TF-IDF / Cosine"];

export default function Footer() {
  const handleAnchor = (hash) => (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      window.location.href = "/" + hash;
      return;
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t px-6 pb-8 pt-16 lg:px-8" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="icon-glow flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <Brain className="h-4 w-4 text-white" strokeWidth={2} />
              </span>
              <span className="font-display text-base font-bold">
                FAQ<span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-secondary">
              An NLP-powered FAQ chatbot built for the CodeAlpha AI Internship
              Task 2. Uses TF-IDF + Cosine Similarity for intelligent question
              matching.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Pages</h4>
            <ul className="mt-4 space-y-2.5">
              {PAGES.map((page) => (
                <li key={page.label}>
                  {page.to ? (
                    <Link to={page.to} className="text-sm text-secondary hover:text-brand-500">
                      {page.label}
                    </Link>
                  ) : (
                    <a
                      href={page.hash}
                      onClick={handleAnchor(page.hash)}
                      className="text-sm text-secondary hover:text-brand-500"
                    >
                      {page.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">Tech Stack</h4>
            <ul className="mt-4 space-y-2.5">
              {TECH_STACK.map((tech) => (
                <li key={tech} className="text-sm text-secondary">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted sm:flex-row"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p>Built for CodeAlpha AI Internship &middot; Task 2 — FAQ Chatbot</p>
            <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-500"
            >
              <GithubIcon className="h-3.5 w-3.5" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
