import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "AI Assistant", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-500 sm:px-5",
          scrolled ? "glass shadow-soft" : "border border-transparent",
        )}
      >
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="gradient-brand grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-semibold tracking-tight">EduBridge</span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button variant="hero" className="hidden sm:inline-flex" asChild>
            <Link to="/auth">Get started</Link>
          </Button>

          <Button
            variant="glass"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl animate-fade-in rounded-2xl p-3 shadow-soft lg:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </Button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
