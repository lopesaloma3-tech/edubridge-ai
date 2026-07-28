import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversations } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/messages")({
  component: Messages,
});

type Msg = { from: "me" | "them"; text: string };

const initial: Msg[] = [
  { from: "them", text: "Great progress on the last problem set!" },
  { from: "me", text: "Thank you! Integration finally clicked." },
  { from: "them", text: "Try the bonus questions before Monday's class." },
];

function Messages() {
  const [active, setActive] = useState(conversations[0].id);
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: draft.trim() }]);
    setDraft("");
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Messages" subtitle="Talk to teachers, classmates and the school office." />

      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <Panel title="Conversations">
          <ul className="space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                    active === c.id ? "bg-accent" : "hover:bg-accent/60",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="flex min-h-[28rem] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                <p
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "me"
                      ? "gradient-brand text-primary-foreground"
                      : "border border-border bg-muted/40 text-foreground",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" />
            <Button type="submit" variant="hero" size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
