import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Brain } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { label: "Home", hash: "#home" },
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (hash) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
      return;
    }
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg border-b"
          : "border-b border-transparent"
      }`}
      style={{
        backgroundColor: scrolled ? "color-mix(in srgb, var(--bg-base) 85%, transparent)" : "transparent",
        borderColor: scrolled ? "var(--border-subtle)" : "transparent",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="icon-glow flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 transition-transform group-hover:scale-105">
            <Brain className="h-5 w-5 text-white" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            FAQ<span className="text-brand-500">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.hash}
              onClick={handleAnchorClick(link.hash)}
              className="text-sm font-medium text-secondary transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/chatbot"
            className="text-sm font-medium text-secondary transition-colors hover:text-[var(--text-primary)]"
          >
            Chatbot
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full text-secondary transition-colors hover:bg-[var(--bg-subtle)]"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <Link
            to="/chatbot"
            className="hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition-transform hover:scale-[1.03] sm:inline-block"
          >
            Try Chatbot
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-secondary hover:bg-[var(--bg-subtle)] md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="border-t px-6 py-4 md:hidden"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.hash}
                onClick={handleAnchorClick(link.hash)}
                className="text-sm font-medium text-secondary"
              >
                {link.label}
              </a>
            ))}
            <Link to="/chatbot" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-secondary">
              Chatbot
            </Link>
            <Link
              to="/chatbot"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              Try Chatbot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
