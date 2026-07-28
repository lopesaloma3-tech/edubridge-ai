import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  component: AiAssistant,
});

const prompts = [
  "Explain integration by parts with an example",
  "Make a 7-day revision plan for physics",
  "Summarise my weakest topics this term",
  "Generate 10 practice questions on data structures",
];

type Msg = { from: "me" | "ai"; text: string };

function AiAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Hi! I'm your EduBridge study assistant. Ask me anything about your courses." },
  ]);
  const [draft, setDraft] = useState("");

  function ask(text: string) {
    if (!text.trim()) return;
    setMsgs((m) => [
      ...m,
      { from: "me", text },
      {
        from: "ai",
        text: "Here's a structured approach: break the topic into core ideas, work one solved example, then attempt three practice problems. I can generate those for you next.",
      },
    ]);
    setDraft("");
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="AI Study Assistant" subtitle="Explanations, revision plans and practice, on demand." />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Panel className="flex min-h-[30rem] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    m.from === "me"
                      ? "gradient-brand text-primary-foreground"
                      : "border border-border bg-muted/40 text-foreground",
                  )}
                >
                  {m.from === "ai" && (
                    <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" /> EduBridge AI
                    </span>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
            className="mt-4 flex gap-2"
          >
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask anything…" />
            <Button type="submit" variant="hero" size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Panel>

        <Panel title="Suggested prompts">
          <ul className="space-y-2">
            {prompts.map((p) => (
              <li key={p}>
                <button
                  onClick={() => ask(p)}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
