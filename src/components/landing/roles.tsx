import { GraduationCap, Presentation, Users, Building2 } from "lucide-react";

const roles = [
  {
    icon: GraduationCap,
    role: "Students",
    points: ["Courses & study material", "Assignments and quizzes", "XP, badges and leaderboards"],
  },
  {
    icon: Presentation,
    role: "Teachers",
    points: ["Course & content management", "AI question and rubric builder", "Grading workflows"],
  },
  {
    icon: Users,
    role: "Parents",
    points: ["Attendance & result alerts", "Fee status and receipts", "Direct teacher messaging"],
  },
  {
    icon: Building2,
    role: "Administrators",
    points: ["Institution-wide analytics", "Departments, batches, timetables", "Audit and reports"],
  },
];

export function Roles() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Four portals, one truth</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            A dedicated experience for every role
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <article key={r.role} className="glass hover-lift rounded-2xl p-6">
              <span className="gradient-brand grid h-11 w-11 place-items-center rounded-xl text-primary-foreground shadow-soft">
                <r.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{r.role}</h3>
              <ul className="mt-3 space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
