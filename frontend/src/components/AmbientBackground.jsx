export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      <div
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl dark:opacity-25"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-400), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-20 h-[550px] w-[550px] rounded-full opacity-25 blur-3xl dark:opacity-20"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-500), transparent 70%)" }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl dark:opacity-[0.1]"
        style={{ background: "radial-gradient(closest-side, var(--color-brand-300), transparent 70%)" }}
      />
    </div>
  );
}
