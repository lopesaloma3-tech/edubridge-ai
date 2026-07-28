import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/app/panels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppRole } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/super-admin/roles")({
  component: RoleManagement,
});

function RoleManagement() {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("admin");
  const queryClient = useQueryClient();

  const { data: superAdmins } = useQuery({
    queryKey: ["super-admin-list"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "super_admin");

      if (!roles || roles.length === 0) return [];

      const userIds = roles.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      return profiles || [];
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: AppRole }) => {
      // Find user by email in profiles
      const { data: profile, error: findError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (findError) throw findError;
      if (!profile) throw new Error("User not found with that email address");

      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: profile.id, role });

      if (error) {
        if (error.code === "23505") throw new Error("User already has this role");
        throw error;
      }

      // Audit log
      const { data: me } = await supabase.auth.getUser();
      await supabase.from("admin_audit_log").insert({
        actor_id: me.user!.id,
        action: `Assigned role "${role}" via email`,
        target_type: "user",
        target_id: profile.id,
        details: { email, role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin-list"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
      toast.success("Role assigned successfully");
      setEmail("");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const roleDescriptions: Record<AppRole, string> = {
    student: "Can view courses, attendance, results, and submit assignments",
    teacher: "Can manage classes, grade assignments, and take attendance",
    parent: "Can view children's progress, fees, and communicate with teachers",
    admin: "Can manage school operations, fees, and view reports",
    super_admin: "Full platform access: user management, system settings, and all admin capabilities",
  };

  return (
    <div className="space-y-6">
      <Panel title="Assign Role by Email" description="Quickly assign a role to any registered user">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="assign-email">User Email</Label>
            <Input
              id="assign-email"
              type="email"
              placeholder="user@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2 sm:w-48">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => assignRoleMutation.mutate({ email, role: selectedRole })}
            disabled={!email || assignRoleMutation.isPending}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </div>
      </Panel>

      <Panel title="Role Definitions" description="Available roles and their permissions">
        <div className="space-y-3">
          {(Object.entries(roleDescriptions) as [AppRole, string][]).map(([role, desc]) => (
            <div key={role} className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold capitalize">{role.replace("_", " ")}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Super Admins" description="Users with super admin privileges">
        {superAdmins && superAdmins.length > 0 ? (
          <ul className="divide-y divide-border">
            {superAdmins.map((admin) => (
              <li key={admin.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-xs font-bold text-destructive">
                    {admin.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{admin.full_name}</p>
                    <p className="text-xs text-muted-foreground">{admin.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                  Super Admin
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No super admins assigned yet. Use the form above to assign the super_admin role.
          </p>
        )}
      </Panel>
    </div>
  );
}