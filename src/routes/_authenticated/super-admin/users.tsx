import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, UserX, UserCheck, MoreVertical, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel } from "@/components/app/panels";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppRole } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/super-admin/users")({
  component: UserManagement,
});

interface UserWithRole {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

function UserManagement() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["super-admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: allRoles } = await supabase.from("user_roles").select("*");

      const roleMap: Record<string, string[]> = {};
      allRoles?.forEach((r) => {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role);
      });

      return (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        roles: roleMap[p.id] || ["student"],
      })) as UserWithRole[];
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role as any);
      if (error) throw error;

      // Log audit
      const { data: me } = await supabase.auth.getUser();
      await supabase.from("admin_audit_log").insert({
        actor_id: me.user!.id,
        action: `Removed role "${role}"`,
        target_type: "user",
        target_id: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      toast.success("Role removed successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;

      const { data: me } = await supabase.auth.getUser();
      await supabase.from("admin_audit_log").insert({
        actor_id: me.user!.id,
        action: `Assigned role "${role}"`,
        target_type: "user",
        target_id: userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      toast.success("Role assigned successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const filteredUsers = users?.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Panel title="User Management" description={`${users?.length || 0} registered users`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 font-medium text-muted-foreground">User</th>
                <th className="pb-3 font-medium text-muted-foreground">Roles</th>
                <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                <th className="pb-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="group">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {user.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name || "Unnamed"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium capitalize"
                        >
                          {role.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {(["student", "teacher", "parent", "admin", "super_admin"] as AppRole[])
                          .filter((r) => !user.roles.includes(r))
                          .map((role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => addRoleMutation.mutate({ userId: user.id, role })}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Assign {role.replace("_", " ")}
                            </DropdownMenuItem>
                          ))}
                        {user.roles.length > 1 &&
                          user.roles.map((role) => (
                            <DropdownMenuItem
                              key={`remove-${role}`}
                              className="text-destructive"
                              onClick={() => deleteRoleMutation.mutate({ userId: user.id, role })}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Remove {role.replace("_", " ")}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers?.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      )}
    </Panel>
  );
}