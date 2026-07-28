const stats = [
  { k: "1.2M+", v: "Active learners" },
  { k: "48,000", v: "Educators onboard" },
  { k: "620+", v: "Institutions" },
  { k: "31%", v: "Avg. result uplift" },
];

export function Stats() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="glass grid gap-6 rounded-3xl p-8 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.v}>
              <p className="gradient-text text-3xl font-semibold tracking-tight sm:text-4xl">
                {s.k}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
