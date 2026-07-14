import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="surface-card group rounded-2xl p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="icon-glow mb-5 flex h-11 w-11 items-center justify-center rounded-xl">
        <Icon className="h-5 w-5 text-brand-500" strokeWidth={2} />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-secondary">{description}</p>
    </motion.div>
  );
}
