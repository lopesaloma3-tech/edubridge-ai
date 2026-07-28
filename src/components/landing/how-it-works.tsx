import { UserPlus, Layers, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Onboard your institution",
    body: "Import students, teachers and parents in minutes. Departments, batches and courses map automatically.",
  },
  {
    icon: Layers,
    title: "Run your academic day",
    body: "Attendance, assignments, quizzes, exams and fees all flow through one connected timeline.",
  },
  {
    icon: Rocket,
    title: "Let AI do the heavy lifting",
    body: "Generate questions, detect weak subjects, predict outcomes and nudge the right student at the right time.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Live in a week, not a semester
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="surface hover-lift relative rounded-2xl p-6">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                STEP {String(i + 1).padStart(2, "0")}
              </span>
              <span className="bg-primary-soft text-primary mt-4 grid h-11 w-11 place-items-center rounded-xl">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
