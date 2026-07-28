import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Roles } from "@/components/landing/roles";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiShowcase } from "@/components/landing/ai-showcase";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { CtaFooter } from "@/components/landing/cta-footer";

const title = "EduBridge — AI Education Management Platform";
const description =
  "EduBridge unifies attendance, courses, assignments, results, fees and communication for students, teachers, parents and administrators, powered by AI.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Roles />
        <HowItWorks />
        <AiShowcase />
        <Stats />
        <Testimonials />
        <Pricing />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  );
}
