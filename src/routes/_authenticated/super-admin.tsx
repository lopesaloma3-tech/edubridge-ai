import { createFileRoute, redirect, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  Users,
  Settings,
  Activity,
  LayoutDashboard,
  UserCog,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/super-admin")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);

    const isSuperAdmin = roles?.some((r) => r.role === "super_admin");
    if (!isSuperAdmin) throw redirect({ to: "/dashboard" });
  },
  component: SuperAdminLayout,
  head: () => ({
    meta: [
      { title: "Super Admin | EduBridge" },
      { name: "description", content: "Super Admin control panel for EduBridge platform management." },
    ],
  }),
});

const adminNav = [
  { label: "Overview", to: "/super-admin", icon: LayoutDashboard },
  { label: "User Management", to: "/super-admin/users", icon: Users },
  { label: "Role Management", to: "/super-admin/roles", icon: UserCog },
  { label: "System Settings", to: "/super-admin/settings", icon: Settings },
  { label: "Audit Log", to: "/super-admin/audit-log", icon: ScrollText },
];

function SuperAdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <Shield className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Super Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Platform-wide management and configuration</p>
        </div>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-2">
        {adminNav.map((item) => {
          const active = pathname === item.to || (item.to !== "/super-admin" && pathname.startsWith(item.to));
          const isExact = item.to === "/super-admin" && pathname === "/super-admin";
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active || isExact
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Outlet />
    </div>
  );
}