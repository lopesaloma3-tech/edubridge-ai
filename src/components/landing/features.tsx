import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CreditCard,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Smart attendance",
    body: "QR check-ins, biometric-ready sessions and automatic defaulter alerts across every batch.",
  },
  {
    icon: BookOpen,
    title: "Learning management",
    body: "Notes, lecture videos, assignments and quizzes organised per course and semester.",
  },
  {
    icon: Sparkles,
    title: "AI academic assistant",
    body: "Doubt solving, quiz generation, flashcards and personalised learning paths on demand.",
  },
  {
    icon: BarChart3,
    title: "Performance analytics",
    body: "Trends, weak-subject detection and predictive scoring for students and departments.",
  },
  {
    icon: MessageSquare,
    title: "Realtime communication",
    body: "Class chat, group discussions, announcements and parent–teacher messaging.",
  },
  {
    icon: CreditCard,
    title: "Fees & finance",
    body: "Invoices, instalments, receipts and reconciliation with a clear parent-facing view.",
  },
  {
    icon: CalendarDays,
    title: "Timetable & exams",
    body: "Conflict-free scheduling, examination planning and instant result publishing.",
  },
  {
    icon: Bell,
    title: "Notification engine",
    body: "Deadline nudges, attendance warnings and result alerts delivered in realtime.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based security",
    body: "Granular permissions, audit logs and encrypted records for every portal.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Everything in one place</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Replace six disconnected tools with one intelligent platform
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for institutions that want less admin work, better visibility and genuinely
            engaged students.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="surface hover-lift group rounded-2xl p-6">
              <span className="bg-primary-soft text-primary grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
