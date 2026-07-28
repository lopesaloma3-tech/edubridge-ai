import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageHeader, Panel, ProgressBar } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { courses, assignments } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/courses")({
  component: Courses,
});

function Courses() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Courses"
        subtitle="Everything you're enrolled in, with live progress and next sessions."
        action={<Button variant="hero">Browse catalog</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <Panel key={c.id}>
            <div className="flex items-start gap-3">
              <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-primary-foreground">
                <BookOpen className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.teacher}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-semibold text-foreground">{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Next: {c.next}</p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Open course
            </Button>
          </Panel>
        ))}
      </div>

      <Panel title="Assignments" description="Across all courses" className="mt-4">
        <ul className="divide-y divide-border">
          {assignments.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">
                  {a.course} · due {a.due}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs">{a.status}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
