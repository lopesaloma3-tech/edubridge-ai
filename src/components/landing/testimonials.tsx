import { Quote } from "lucide-react";

const items = [
  {
    quote:
      "We retired four separate tools in one term. Attendance disputes dropped to nearly zero and our faculty finally trust the data.",
    name: "Dr. Meera Iyer",
    role: "Dean of Academics, Nova Institute of Technology",
  },
  {
    quote:
      "The AI question generator saves me six hours a week. It writes from my own notes, so the difficulty is always right.",
    name: "Rahul Verma",
    role: "Senior Lecturer, Computer Science",
  },
  {
    quote:
      "As a parent I finally see attendance, results and fees in one place — without chasing anyone on WhatsApp.",
    name: "Anita Sharma",
    role: "Parent, Grade 11",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Loved by institutions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Trusted across campuses and classrooms
          </h2>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="surface hover-lift flex flex-col rounded-2xl p-6">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex min-w-0 items-center gap-3">
                <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground">
                  {t.name.split(" ").slice(-1)[0]?.[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{t.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
