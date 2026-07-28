import { Link } from "@tanstack/react-router";
import { ArrowRight, Play, Sparkles, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";


const data = [
  { m: "Mon", v: 62 },
  { m: "Tue", v: 71 },
  { m: "Wed", v: 68 },
  { m: "Thu", v: 84 },
  { m: "Fri", v: 79 },
  { m: "Sat", v: 92 },
  { m: "Sun", v: 97 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="aurora pointer-events-none absolute inset-0 -z-10 opacity-90" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-border" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-powered academic operating system
            </span>

            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
              One platform for every <span className="gradient-text">learning journey</span>
            </h1>

            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              EduBridge unifies attendance, assignments, results, fees and communication for
              students, teachers, parents and administrators — with an AI assistant that helps
              everyone move faster.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth">
                  Start free trial
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <a href="#how-it-works">
                  <Play />
                  Watch the tour
                </a>
              </Button>
            </div>


            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                { k: "1.2M+", v: "Learners" },
                { k: "48K", v: "Educators" },
                { k: "99.98%", v: "Uptime" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-semibold tracking-tight">{s.k}</dt>
                  <dd className="text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <div className="glass hover-lift relative rounded-3xl p-4 shadow-elevated sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-semibold text-primary-foreground">
                  AR
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Welcome back, Aarav</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Semester 4 · Computer Science
                  </p>
                </div>
                <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success">
                  <TrendingUp className="h-3.5 w-3.5" /> +12%
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { l: "Attendance", v: "94%" },
                  { l: "Assignments", v: "18/20" },
                  { l: "XP earned", v: "2,480" },
                ].map((c) => (
                  <div key={c.l} className="surface rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground">{c.l}</p>
                    <p className="mt-1 text-lg font-semibold tracking-tight">{c.v}</p>
                  </div>
                ))}
              </div>

              <div className="surface mt-3 rounded-2xl p-4">
                <p className="text-xs font-medium text-muted-foreground">Weekly performance</p>
                <div className="mt-2 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
                      <defs>
                        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="m"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                      />
                      <Tooltip
                        cursor={{ stroke: "var(--color-border)" }}
                        contentStyle={{
                          background: "var(--color-popover)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 12,
                          fontSize: 12,
                          color: "var(--color-popover-foreground)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="var(--color-primary)"
                        strokeWidth={2.5}
                        fill="url(#heroFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass animate-float absolute -bottom-6 -left-4 hidden max-w-[15rem] rounded-2xl p-3 shadow-soft sm:block">
                <p className="flex items-center gap-1.5 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> AI insight
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Revise "Graph Traversal" — predicted weak topic before Friday's quiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
