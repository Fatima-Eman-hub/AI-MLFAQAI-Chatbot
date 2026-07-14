import { Mail, MapPin, ArrowRight } from "lucide-react";
import GithubIcon from "./GithubIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CONTACT_CARDS = [
  { icon: Mail, label: "Email", value: "fatimaeman1724@gmail.com" },
  { icon: GithubIcon, label: "GitHub", value: "github.com/Fatima-Eman-hub" },
  { icon: MapPin, label: "Location", value: "Remote" },
];

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
          Contact
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Get in touch
        </h2>
        <p className="mt-4 text-lg text-secondary">
          Interested in this project or have feedback? Reach out.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONTACT_CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="surface-card flex flex-col items-center gap-3 rounded-2xl p-7 text-center shadow-sm"
            >
              <span className="icon-glow flex h-11 w-11 items-center justify-center rounded-full">
                <card.icon className="h-5 w-5 text-brand-500" strokeWidth={2} />
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {card.label}
              </span>
              <span className="text-sm font-semibold break-all">{card.value}</span>
            </motion.div>
          ))}
        </div>

        <Link
          to="/chatbot"
          className="group mt-12 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-[1.03]"
        >
          Start Chatting Now
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
