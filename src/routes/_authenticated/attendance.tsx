import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { attendanceRoster, attendanceTrend } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance | EduBridge" },
      { name: "description", content: "Monitor presence rates and mark the daily register across classes." },
      { property: "og:title", content: "Attendance | EduBridge" },
      { property: "og:description", content: "Monitor presence rates and mark the daily register across classes." },
    ],
  }),
  component: Attendance,
});

function Attendance() {
  const { role } = useCurrentUser();
  const [marks, setMarks] = useState<Record<number, "present" | "absent">>({});

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance"
        subtitle={role === "teacher" ? "Mark today's register for Class 11-B." : "Your presence record this year."}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Monthly rate" description="Presence percentage" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[60, 100]} tickLine={false} axisLine={false} fontSize={12} width={30} />
                <Tooltip />
                <Bar dataKey="v" radius={[6, 6, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Summary">
          <dl className="space-y-4 text-sm">
            {[
              ["Present days", "168"],
              ["Absent days", "7"],
              ["Late arrivals", "3"],
              ["Overall rate", "96%"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel title="Today's register" description="Class 11-B" className="mt-4">
        <ul className="divide-y divide-border">
          {attendanceRoster.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.roll} · {s.rate}% this term
                </p>
              </div>
              <div className="flex gap-2">
                {(["present", "absent"] as const).map((state) => (
                  <button
                    key={state}
                    onClick={() => setMarks((m) => ({ ...m, [s.id]: state }))}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                      marks[s.id] === state
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <Button variant="hero" className="mt-4" onClick={() => toast.success("Register saved for today")}>
          Save register
        </Button>
      </Panel>
    </div>
  );
}
