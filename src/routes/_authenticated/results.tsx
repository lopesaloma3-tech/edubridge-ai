import { createFileRoute } from "@tanstack/react-router";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, ProgressBar } from "@/components/app/panels";
import { gradeTrend, results } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/results")({
  head: () => ({
    meta: [
      { title: "Results | EduBridge" },
      { name: "description", content: "Term-by-term academic performance with subject-level breakdowns." },
      { property: "og:title", content: "Results | EduBridge" },
      { property: "og:description", content: "Term-by-term academic performance with subject-level breakdowns." },
    ],
  }),
  component: Results,
});

function Results() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Results" subtitle="Term-by-term performance with subject breakdown." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Score trend" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[50, 100]} tickLine={false} axisLine={false} fontSize={12} width={30} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="v"
                  strokeWidth={3}
                  dot={false}
                  stroke="currentColor"
                  className="text-primary"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Term summary">
          <p className="text-4xl font-semibold tracking-tight">A-</p>
          <p className="mt-1 text-sm text-muted-foreground">Cumulative GPA 3.72</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Class rank</span>
              <span className="font-semibold">4 / 38</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credits earned</span>
              <span className="font-semibold">72</span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Subject breakdown" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Subject</th>
                <th className="py-2 font-medium">Term</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium">Grade</th>
                <th className="w-40 py-2 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.subject} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium">{r.subject}</td>
                  <td className="py-3 text-muted-foreground">{r.term}</td>
                  <td className="py-3">{r.score}</td>
                  <td className="py-3 font-semibold">{r.grade}</td>
                  <td className="py-3">
                    <ProgressBar value={r.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
