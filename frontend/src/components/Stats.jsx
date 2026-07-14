import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { icon: Sparkles, value: "30+", label: "AI/ML FAQs" },
  { icon: Zap, value: "TF-IDF", label: "NLP Engine" },
  { icon: ShieldCheck, value: "100%", label: "Open Source" },
];

export default function Stats() {
  return (
    <section className="px-6 pb-14 sm:pb-20 lg:px-8">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="surface-card flex flex-col items-center gap-2 rounded-2xl px-6 py-8 text-center shadow-sm"
          >
            <span className="icon-glow mb-1 flex h-11 w-11 items-center justify-center rounded-full">
              <stat.icon className="h-5 w-5 text-brand-500" strokeWidth={2} />
            </span>
            <span className="font-display text-2xl font-bold">{stat.value}</span>
            <span className="text-sm text-secondary">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
