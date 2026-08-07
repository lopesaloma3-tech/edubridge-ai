import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Study Assistant | EduBridge" },
      {
        name: "description",
        content: "Ask questions, build revision plans and generate practice sets with AI.",
      },
      { property: "og:title", content: "AI Study Assistant | EduBridge" },
      {
        property: "og:description",
        content: "Ask questions, build revision plans and generate practice sets with AI.",
      },
    ],
  }),
  component: AiAssistant,
});

const prompts = [
  "Explain the key topic I studied most recently",
  "Create a 7-day revision plan from my courses",
  "Summarise my likely weak areas based on results",
  "Generate practice questions from my active subjects",
];

type AssistantMessage = {
  id: string;
  sender: "user" | "assistant";
  content: string;
};

function buildAssistantReply(prompt: string) {
  return `Study plan based on your academic workspace: ${prompt}. Start by reviewing your most recent course materials, then complete pending assignments, revisit low-scoring assessments, and finish with a short self-test for each active course.`;
}

function AiAssistant() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const [draft, setDraft] = useState("");

  const conversationQuery = useQuery({
    queryKey: ["ai-conversation", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: existing, error: existingError } = await supabase
        .from("ai_conversations")
        .select("id, title")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existingError) throw existingError;

      if (existing) return existing;

      const { data: created, error: createError } = await supabase
        .from("ai_conversations")
        .insert({ user_id: user!.id, title: "Study Assistant" })
        .select("id, title")
        .single();
      if (createError) throw createError;
      return created;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ["ai-messages", conversationQuery.data?.id],
    enabled: !!conversationQuery.data?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_messages")
        .select("id, sender, content")
        .eq("conversation_id", conversationQuery.data!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AssistantMessage[];
    },
  });

  const displayedMessages = useMemo(() => {
    if ((messagesQuery.data ?? []).length > 0) return messagesQuery.data ?? [];
    return [
      {
        id: "welcome",
        sender: "assistant" as const,
        content: "Hi! I use your EduBridge records to help with revision, planning, and practice.",
      },
    ];
  }, [messagesQuery.data]);

  const askMutation = useMutation({
    mutationFn: async (text: string) => {
      const conversationId = conversationQuery.data?.id;
      if (!conversationId || !text.trim()) return;

      const reply = buildAssistantReply(text.trim());

      const { error } = await supabase.from("ai_messages").insert([
        { conversation_id: conversationId, sender: "user", content: text.trim() },
        { conversation_id: conversationId, sender: "assistant", content: reply },
      ]);
      if (error) throw error;
    },
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["ai-messages", conversationQuery.data?.id] });
    },
  });

  useEffect(() => {
    if (!conversationQuery.data?.id) return;
    const channel = supabase
      .channel(`ai-messages-${conversationQuery.data.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ai_messages",
          filter: `conversation_id=eq.${conversationQuery.data.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["ai-messages", conversationQuery.data?.id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationQuery.data?.id, queryClient]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Study Assistant"
        subtitle="Revision help grounded in your EduBridge academic records."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Panel className="flex min-h-120 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {displayedMessages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    message.sender === "user"
                      ? "gradient-brand text-primary-foreground"
                      : "border border-border bg-muted/40 text-foreground",
                  )}
                >
                  {message.sender === "assistant" && (
                    <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5" /> EduBridge AI
                    </span>
                  )}
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              askMutation.mutate(draft);
            }}
            className="mt-4 flex gap-2"
          >
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything about your studies…"
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              aria-label="Send"
              disabled={!draft.trim() || askMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Panel>

        <Panel title="Suggested prompts">
          <ul className="space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt}>
                <button
                  onClick={() => askMutation.mutate(prompt)}
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
