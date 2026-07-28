import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings | EduBridge" },
      { name: "description", content: "Manage your EduBridge profile, name and account preferences." },
      { property: "og:title", content: "Settings | EduBridge" },
      { property: "og:description", content: "Manage your EduBridge profile, name and account preferences." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { user, name, email, role } = useCurrentUser();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => setFullName(name), [name]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your profile and account details." />

      <Panel title="Profile">
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <p className="rounded-lg border border-border px-3 py-2 text-sm capitalize text-muted-foreground">
              {role}
            </p>
          </div>
          <Button type="submit" variant="hero" disabled={saving}>
            Save changes
          </Button>
        </form>
      </Panel>
    </div>
  );
}
