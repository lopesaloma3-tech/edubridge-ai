import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$0",
    note: "for pilots up to 100 students",
    features: [
      "Student & teacher portals",
      "Attendance and assignments",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Institution",
    price: "$3",
    note: "per active student / month",
    features: [
      "All four portals",
      "AI assistant & question generator",
      "Fees, exams and results",
      "Realtime chat & announcements",
      "Priority support",
    ],
    cta: "Start 30-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "multi-campus deployments",
    features: [
      "SSO, SAML & audit logs",
      "Custom integrations & API",
      "Dedicated success manager",
      "99.99% uptime SLA",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Simple plans that scale with your campus
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={cn(
                "hover-lift relative rounded-3xl p-7",
                p.highlight ? "glass shadow-elevated ring-2 ring-primary" : "surface",
              )}
            >
              {p.highlight && (
                <span className="gradient-brand absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-4 text-4xl font-semibold tracking-tight">{p.price}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
              <Button
                variant={p.highlight ? "hero" : "outline"}
                size="lg"
                className="mt-6 w-full"
                asChild
              >
                <Link to="/auth">{p.cta}</Link>
              </Button>

              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
