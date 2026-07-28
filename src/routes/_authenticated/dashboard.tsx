import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  Flame,
  Trophy,
  Users,
  Wallet,
  ClipboardList,
} from "lucide-react";
import { PageHeader, Panel, ProgressBar, StatCard } from "@/components/app/panels";
import { useCurrentUser } from "@/hooks/use-current-user";
import { assignments, attendanceTrend, courses, gradeTrend, attendanceRoster } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | EduBridge" },
      { name: "description", content: "Your personalised campus overview: attendance, grades, courses and upcoming work." },
      { property: "og:title", content: "Dashboard | EduBridge" },
      { property: "og:description", content: "Your personalised campus overview: attendance, grades, courses and upcoming work." },
    ],
  }),
  component: Dashboard,
});

const statsByRole = {
  student: [
    { label: "Attendance", value: "96%", hint: "Last 30 days", icon: CalendarCheck },
    { label: "Average grade", value: "A-", hint: "+4% this term", icon: Trophy },
    { label: "Active courses", value: "6", hint: "2 assessments due", icon: BookOpen },
    { label: "Streak", value: "18 days", hint: "Keep it going", icon: Flame },
  ],
  teacher: [
    { label: "My classes", value: "5", hint: "142 students", icon: Users },
    { label: "To grade", value: "23", hint: "Due this week", icon: ClipboardList },
    { label: "Avg. attendance", value: "93%", hint: "Across classes", icon: CalendarCheck },
    { label: "Class average", value: "84%", hint: "+3% vs last term", icon: Trophy },
  ],
  parent: [
    { label: "Children", value: "2", hint: "Aisha & Omar", icon: Users },
    { label: "Attendance", value: "94%", hint: "This term", icon: CalendarCheck },
    { label: "Outstanding fees", value: "$1,450", hint: "Due 15 Aug", icon: Wallet },
    { label: "Avg. grade", value: "B+", hint: "Improving", icon: Trophy },
  ],
  admin: [
    { label: "Students", value: "1,284", hint: "+62 this term", icon: Users },
    { label: "Staff", value: "96", hint: "12 departments", icon: BookOpen },
    { label: "Fee collection", value: "88%", hint: "$412k collected", icon: CreditCard },
    { label: "Attendance", value: "95%", hint: "Campus-wide", icon: CalendarCheck },
  ],
} as const;

function Dashboard() {
  const { role, name } = useCurrentUser();
  const stats = statsByRole[role];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Good day${name ? `, ${name.split(" ")[0]}` : ""}`}
        subtitle="Here's what's happening across your campus today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Performance trend" description="Average score over the last 6 months" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gradeTrend}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>

                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="currentColor" className="text-primary" fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Attendance" description="Monthly presence rate">
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
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title={role === "teacher" ? "My classes" : "Courses"} description="Progress this term">
          <ul className="space-y-4">
            {courses.map((c) => (
              <li key={c.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.teacher}</p>
                  </div>
                  <span className="text-xs font-semibold">{c.progress}%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={c.progress} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        {role === "teacher" ? (
          <Panel title="Class roster" description="Class 11-B attendance rate">
            <ul className="divide-y divide-border">
              {attendanceRoster.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.roll}</p>
                  </div>
                  <span className={s.rate < 80 ? "text-destructive" : "text-muted-foreground"}>{s.rate}%</span>
                </li>
              ))}
            </ul>
          </Panel>
        ) : (
          <Panel title="Upcoming work" description="Assignments and deadlines">
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
        )}
      </div>
    </div>
  );
}
