import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const chat = [
  { from: "user" as const, text: "Explain Dijkstra's algorithm and quiz me on it." },
  {
    from: "ai" as const,
    text: "Dijkstra finds the shortest path from a source node by greedily expanding the closest unvisited node. Here's a 5-question quiz plus flashcards on relaxation and priority queues.",
  },
  { from: "user" as const, text: "Where am I weakest this semester?" },
  {
    from: "ai" as const,
    text: "Data Structures — 62% quiz accuracy vs your 84% average. I've added three 25-minute focus blocks to your planner.",
  },
];

const capabilities = [
  "Doubt solving",
  "Quiz generator",
  "Flashcards",
  "Learning paths",
  "Summarisation",
  "Exam prep",
  "Career guidance",
  "Weak-topic detection",
];

export function AiShowcase() {
  return (
    <section id="ai" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="aurora pointer-events-none absolute inset-0 -z-10 opacity-70" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-primary">EduBridge AI</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              A tutor for students. A co-teacher for faculty.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Grounded in your institution's own courses, notes and results — so answers, quizzes
              and recommendations always match what's actually being taught.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {capabilities.map((c) => (
                <li
                  key={c}
                  className="surface rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-4 shadow-elevated sm:p-6">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <span className="gradient-brand grid h-8 w-8 place-items-center rounded-lg text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold">Study Assistant</p>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" /> Online
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {chat.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.from === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "mr-auto max-w-[92%] rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-sm text-card-foreground shadow-soft"
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="surface mt-5 flex items-center gap-2 rounded-2xl p-2 pl-4">
              <span className="truncate text-sm text-muted-foreground">
                Ask anything about your courses…
              </span>
              <Button variant="hero" size="icon" className="ml-auto shrink-0" aria-label="Send">
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
