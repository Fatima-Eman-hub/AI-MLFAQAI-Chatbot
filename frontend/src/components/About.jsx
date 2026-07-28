import { motion } from "framer-motion";

const TECH_STACK = [
  "Python",
  "FastAPI",
  "NLTK",
  "Scikit-learn",
  "React",
  "Tailwind CSS",
  "TF-IDF",
  "Cosine Similarity",
];

const STEPS = [
  {
    number: "01",
    title: "FAQ Collection",
    description: "30 hand-crafted AI/ML Q&A pairs stored in a JSON file, covering everything from neural networks to NLP fundamentals.",
  },
  {
    number: "02",
    title: "NLP Preprocessing",
    description: "Each question is lowercased, tokenized, stripped of stop words, and lemmatized using NLTK's WordNetLemmatizer.",
  },
  {
    number: "03",
    title: "TF-IDF Indexing",
    description: "Scikit-learn's TfidfVectorizer converts preprocessed questions into a numerical matrix at startup.",
  },
  {
    number: "04",
    title: "Cosine Matching",
    description: "User queries are vectorized and compared against the FAQ matrix. The highest-scoring match above threshold wins.",
  },
];

export default function About() {
  return (
    <section id="about" className="px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
          About the project
        </span>
        <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Built for an AI internship,
          <br />
          <span className="text-secondary">designed for a portfolio.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-secondary">
          This FAQ Chatbot was built as a personal learning project. It
          demonstrates real-world NLP techniques — not toy examples — by
          implementing a full TF-IDF pipeline with proper text preprocessing.
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-secondary">
          The backend runs NLTK for tokenization and lemmatization,
          Scikit-learn for vectorization, and FastAPI for the REST API. The
          frontend is a polished React app with dark mode, animations, and a
          smooth chat interface.
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-full border px-4 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-300"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-subtle)" }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="surface-card flex items-start gap-4 rounded-2xl p-6 shadow-sm sm:items-center"
            >
              <span className="font-display shrink-0 text-sm font-bold text-brand-500">
                {step.number}
              </span>
              <div>
                <h3 className="font-display font-semibold">{step.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-secondary">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
