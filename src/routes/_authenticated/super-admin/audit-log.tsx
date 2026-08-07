import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollText, Filter } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Panel } from "@/components/app/panels";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/super-admin/audit-log")({
  component: AuditLog,
});

function AuditLog() {
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: actorProfiles } = useQuery({
    queryKey: ["audit-log-actors", logs?.map((l) => l.actor_id)],
    enabled: !!logs && logs.length > 0,
    queryFn: async () => {
      const actorIds = [...new Set(logs!.map((l) => l.actor_id))];
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", actorIds);
      const map: Record<string, { full_name: string; email: string | null }> = {};
      data?.forEach((p) => {
        map[p.id] = { full_name: p.full_name, email: p.email };
      });
      return map;
    },
  });

  const filteredLogs = logs?.filter((log) => {
    const matchesText =
      !filter ||
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      log.target_type?.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === "all" || log.target_type === typeFilter;
    return matchesText && matchesType;
  });

  const targetTypes = [...new Set(logs?.map((l) => l.target_type).filter(Boolean) || [])];

  return (
    <Panel title="Audit Log" description="Complete history of super admin actions">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <ScrollText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {targetTypes.map((type) => (
              <SelectItem key={type} value={type!}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading audit log...</p>
      ) : filteredLogs && filteredLogs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">Action</th>
                <th className="pb-3 font-medium text-muted-foreground">Actor</th>
                <th className="pb-3 font-medium text-muted-foreground">Target</th>
                <th className="pb-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => {
                const actor = actorProfiles?.[log.actor_id];
                return (
                  <tr key={log.id}>
                    <td className="py-3 font-medium">{log.action}</td>
                    <td className="py-3 text-muted-foreground">
                      {actor?.full_name || actor?.email || log.actor_id.slice(0, 8)}
                    </td>
                    <td className="py-3">
                      {log.target_type && (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                          {log.target_type}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No audit log entries found.
        </p>
      )}
    </Panel>
  );
}
