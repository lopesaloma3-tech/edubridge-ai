import type { AppRole } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export async function getAllUsersWithRoles() {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, created_at")
    .order("created_at", { ascending: false });
  if (profilesError) throw profilesError;

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role");
  if (rolesError) throw rolesError;

  const roleMap = new Map<string, string[]>();
  (roles ?? []).forEach((item: { user_id: string; role: string }) => {
    const existing = roleMap.get(item.user_id) ?? [];
    existing.push(item.role);
    roleMap.set(item.user_id, existing);
  });

  return (profiles ?? []).map((profile) => ({
    ...profile,
    roles: roleMap.get(profile.id) ?? ["student"],
  }));
}

export async function writeAuditLog(
  actorId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: unknown,
) {
  const { error } = await supabase.from("admin_audit_log").insert({
    actor_id: actorId,
    action,
    target_type: targetType ?? null,
    target_id: targetId ?? null,
    details: details !== undefined ? (details as Json) : null,
  });
  if (error) throw error;
}

export async function assignUserRole(userId: string, role: AppRole, actorId: string) {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error) throw error;
  await writeAuditLog(actorId, `Assigned role "${role}"`, "user", userId, { role });
}

export async function removeUserRole(userId: string, role: AppRole, actorId: string) {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);
  if (error) throw error;
  await writeAuditLog(actorId, `Removed role "${role}"`, "user", userId, { role });
}
