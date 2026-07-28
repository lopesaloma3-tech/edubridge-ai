import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaFooter() {
  return (
    <>
      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="gradient-brand relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-elevated sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl">
              Give your campus one intelligent home
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
              Start free with up to 100 students. No credit card, no migration headache.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="xl" variant="glass" className="text-primary-foreground">
                Book a demo
              </Button>
              <Button size="xl" className="bg-card text-card-foreground hover:bg-card/90">
                Get started
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="gradient-brand grid h-9 w-9 place-items-center rounded-xl text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">EduBridge</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI-powered education management platform for modern institutions.
            </p>
          </div>
          {[
            { t: "Product", l: ["Features", "AI Assistant", "Pricing", "Security"] },
            { t: "Portals", l: ["Students", "Teachers", "Parents", "Administrators"] },
            { t: "Company", l: ["About", "Careers", "Contact", "Privacy"] },
          ].map((col) => (
            <div key={col.t}>
              <p className="text-sm font-semibold">{col.t}</p>
              <ul className="mt-4 space-y-2.5">
                {col.l.map((i) => (
                  <li key={i}>
                    <a
                      href="#features"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
          <p className="border-t border-border pt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} EduBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
