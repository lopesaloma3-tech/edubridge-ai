import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCurrentUser, type AppRole } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: typeof BookOpen; roles?: AppRole[] };

const nav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/courses", icon: BookOpen },
  { label: "Attendance", to: "/attendance", icon: CalendarCheck },
  { label: "Results", to: "/results", icon: Trophy },
  { label: "Fees", to: "/fees", icon: CreditCard, roles: ["student", "parent", "admin"] },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "AI Assistant", to: "/ai-assistant", icon: Sparkles },
  { label: "Settings", to: "/settings", icon: Settings },
];

const roleLabel: Record<AppRole, string> = {
  student: "Student portal",
  teacher: "Teacher portal",
  parent: "Parent portal",
  admin: "Admin console",
};

export function AppShell() {
  const { name, email, role } = useCurrentUser();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const items = nav.filter((i) => !i.roles || i.roles.includes(role));

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/dashboard" className="flex items-center gap-2.5 px-1">
        <span className="gradient-brand grid h-9 w-9 place-items-center rounded-xl text-primary-foreground">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">EduBridge</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "gradient-brand text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-border p-3">
        <p className="truncate text-sm font-medium">{name || "Loading…"}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
          <div className="glass absolute inset-y-0 left-0 w-72 animate-fade-in">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-40 flex items-center gap-3 border-b border-border px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{roleLabel[role]}</p>
            <p className="truncate text-xs text-muted-foreground">Welcome back, {name || "there"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden rounded-full border border-border px-3 py-1 text-xs font-medium capitalize sm:inline">
              {role}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
