import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "teacher" | "parent" | "admin" | "super_admin";

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}

export function useCurrentUser() {
  const { user, loading } = useSession();

  const query = useQuery({
    queryKey: ["me", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user!.id),
      ]);
      const role = (roles?.[0]?.role ?? "student") as AppRole;
      return {
        profile: profile ?? null,
        role,
        name:
          profile?.full_name ||
          (user!.user_metadata?.full_name as string) ||
          user!.email?.split("@")[0] ||
          "User",
        email: user!.email ?? "",
      };
    },
  });

  return {
    user,
    loading: loading || (!!user && query.isLoading),
    role: (query.data?.role ?? "student") as AppRole,
    name: query.data?.name ?? "",
    email: query.data?.email ?? user?.email ?? "",
  };
}
