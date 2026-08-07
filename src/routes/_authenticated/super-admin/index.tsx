import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Shield, BookOpen, CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard, Panel } from "@/components/app/panels";

export const Route = createFileRoute("/_authenticated/super-admin/")({
  component: SuperAdminOverview,
});

function SuperAdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      const [profilesRes, rolesRes, auditRes, settingsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("role"),
        supabase.from("admin_audit_log").select("id", { count: "exact", head: true }),
        supabase.from("system_settings").select("*"),
      ]);

      const roleCounts: Record<string, number> = {};
      (rolesRes.data ?? []).forEach((r: { role: string }) => {
        roleCounts[r.role] = (roleCounts[r.role] || 0) + 1;
      });

      return {
        totalUsers: profilesRes.count || 0,
        roleCounts,
        totalAuditEntries: auditRes.count || 0,
        settings: settingsRes.data || [],
      };
    },
  });

  const overviewStats = [
    {
      label: "Total Users",
      value: String(stats?.totalUsers || 0),
      hint: "Registered accounts",
      icon: Users,
    },
    {
      label: "Students",
      value: String(stats?.roleCounts?.student || 0),
      hint: "Active students",
      icon: BookOpen,
    },
    {
      label: "Teachers",
      value: String(stats?.roleCounts?.teacher || 0),
      hint: "Teaching staff",
      icon: CalendarCheck,
    },
    {
      label: "Admins",
      value: String((stats?.roleCounts?.admin || 0) + (stats?.roleCounts?.super_admin || 0)),
      hint: "Admin + Super Admin",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Role Distribution" description="Users by role across the platform">
          <div className="space-y-3">
            {["student", "teacher", "parent", "admin", "super_admin"].map((role) => {
              const count = stats?.roleCounts?.[role] || 0;
              const total = stats?.totalUsers || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full bg-primary"
                      style={{ opacity: 0.3 + pct / 100 }}
                    />
                    <span className="text-sm font-medium capitalize">{role.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count} users</span>
                    <span className="text-xs font-semibold">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="System Settings" description="Current platform configuration">
          <div className="space-y-3">
            {stats?.settings?.map(
              (setting: {
                id: string;
                key: string;
                description: string | null;
                value: unknown;
              }) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {setting.key.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {typeof setting.value === "string"
                      ? setting.value.replace(/"/g, "")
                      : JSON.stringify(setting.value)}
                  </span>
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>

      <Panel title="Recent Activity" description="Latest audit log entries">
        <RecentAuditLog />
      </Panel>
    </div>
  );
}

function RecentAuditLog() {
  const { data: logs } = useQuery({
    queryKey: ["recent-audit-logs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  if (!logs || logs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">No audit log entries yet.</p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {logs.map(
        (log: {
          id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          created_at: string;
        }) => (
          <li key={log.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{log.action}</p>
              <p className="text-xs text-muted-foreground">
                {log.target_type && `${log.target_type}: ${log.target_id}`}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(log.created_at).toLocaleDateString()}
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
