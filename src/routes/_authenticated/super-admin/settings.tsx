import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Panel } from "@/components/app/panels";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/super-admin/settings")({
  component: SystemSettings,
});

function SystemSettings() {
  const queryClient = useQueryClient();
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("system_settings").select("*").order("key");
      if (error) throw error;
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data: me } = await supabase.auth.getUser();

      // Determine the JSON value to store
      let jsonValue: Json;
      if (value === "true" || value === "false") {
        jsonValue = value === "true";
      } else if (!isNaN(Number(value)) && value.trim() !== "") {
        jsonValue = Number(value);
      } else {
        jsonValue = value;
      }

      const { error } = await supabase
        .from("system_settings")
        .update({ value: jsonValue, updated_by: me.user!.id })
        .eq("key", key);

      if (error) throw error;

      // Audit log
      await supabase.from("admin_audit_log").insert({
        actor_id: me.user!.id,
        action: `Updated setting "${key}"`,
        target_type: "setting",
        target_id: key,
        details: { new_value: jsonValue },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Setting updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function getDisplayValue(value: Json): string {
    if (typeof value === "string") return value.replace(/^"|"$/g, "");
    return String(value);
  }

  function handleSave(key: string) {
    const value = editValues[key];
    if (value !== undefined) {
      updateMutation.mutate({ key, value });
      setEditValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  if (isLoading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading settings...</p>;
  }

  return (
    <Panel title="System Settings" description="Configure platform-wide settings">
      <div className="space-y-6">
        {settings?.map((setting) => {
          const currentValue = getDisplayValue(setting.value);
          const isBoolean = currentValue === "true" || currentValue === "false";
          const editValue = editValues[setting.key];
          const displayValue = editValue !== undefined ? editValue : currentValue;
          const hasChanges = editValue !== undefined && editValue !== currentValue;

          return (
            <div key={setting.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-semibold capitalize">
                    {setting.key.replace(/_/g, " ")}
                  </Label>
                  {setting.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{setting.description}</p>
                  )}
                </div>
                {hasChanges && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setEditValues((prev) => {
                          const next = { ...prev };
                          delete next[setting.key];
                          return next;
                        })
                      }
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Reset
                    </Button>
                    <Button size="sm" onClick={() => handleSave(setting.key)}>
                      <Save className="mr-1 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-3">
                {isBoolean ? (
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={displayValue === "true"}
                      onCheckedChange={(checked) =>
                        setEditValues((prev) => ({ ...prev, [setting.key]: String(checked) }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {displayValue === "true" ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                ) : (
                  <Input
                    value={displayValue}
                    onChange={(e) =>
                      setEditValues((prev) => ({ ...prev, [setting.key]: e.target.value }))
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
