import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Can EduBridge replace our existing ERP?",
    a: "Yes. Attendance, courses, assignments, examinations, results, fees and communication all live in one system, with role-based portals for students, teachers, parents and administrators.",
  },
  {
    q: "How does the AI assistant stay accurate?",
    a: "It is grounded in your institution's own notes, courses and assessment history, so answers, generated quizzes and recommendations reflect what your faculty actually teach.",
  },
  {
    q: "Is student data secure?",
    a: "Every record is protected by role-based access control, encrypted storage and full audit logging. Administrators control exactly what each role can read or change.",
  },
  {
    q: "Does it work on mobile?",
    a: "The entire platform is responsive — desktop, tablet and phone — including attendance check-in, assignment submission and parent notifications.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most institutions import their students, teachers and course catalogue and go live within a week. Enterprise deployments include a dedicated success manager.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-primary">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Questions, answered
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
