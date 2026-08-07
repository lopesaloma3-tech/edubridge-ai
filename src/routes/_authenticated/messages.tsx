import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  getMessages,
  getMessageThreads,
  sendMessage,
  type ChatMessage,
  type MessageThread,
} from "@/lib/supabase/academic";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/messages")({
  head: () => ({
    meta: [
      { title: "Messages | EduBridge" },
      {
        name: "description",
        content: "Chat with teachers, parents and classmates in one secure inbox.",
      },
      { property: "og:title", content: "Messages | EduBridge" },
      {
        property: "og:description",
        content: "Chat with teachers, parents and classmates in one secure inbox.",
      },
    ],
  }),
  component: Messages,
});

function Messages() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const [active, setActive] = useState<string>("");
  const [draft, setDraft] = useState("");

  const threadsQuery = useQuery({
    queryKey: ["message-threads", user?.id],
    enabled: !!user,
    queryFn: () => getMessageThreads(user!.id),
  });

  useEffect(() => {
    if (!active && threadsQuery.data?.[0]?.id) {
      setActive(threadsQuery.data[0].id);
    }
  }, [active, threadsQuery.data]);

  const messagesQuery = useQuery({
    queryKey: ["messages", active],
    enabled: !!active,
    queryFn: () => getMessages(active),
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!user || !active || !draft.trim()) return;
      await sendMessage(active, user.id, draft.trim());
    },
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["messages", active] });
      queryClient.invalidateQueries({ queryKey: ["message-threads", user?.id] });
    },
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Messages" subtitle="Talk to teachers, classmates and the school office." />

      <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
        <Panel title="Conversations">
          <ul className="space-y-1">
            {(threadsQuery.data ?? []).map((thread: MessageThread) => (
              <li key={thread.id}>
                <button
                  onClick={() => setActive(thread.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                    active === thread.id ? "bg-accent" : "hover:bg-accent/60",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {thread.subject || "Conversation"}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {thread.updated_at ? new Date(thread.updated_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground capitalize">
                    {thread.thread_type}
                  </p>
                </button>
              </li>
            ))}
            {(threadsQuery.data ?? []).length === 0 && (
              <li className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                No conversations yet.
              </li>
            )}
          </ul>
        </Panel>

        <Panel className="flex min-h-112 flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {(messagesQuery.data ?? []).map((message: ChatMessage) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender_user_id === user?.id ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.sender_user_id === user?.id
                      ? "gradient-brand text-primary-foreground"
                      : "border border-border bg-muted/40 text-foreground",
                  )}
                >
                  <p>{message.body}</p>
                  <p className="mt-1 text-[11px] opacity-70">
                    {new Date(message.sent_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {active && (messagesQuery.data ?? []).length === 0 && (
              <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                No messages in this conversation yet.
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMutation.mutate();
            }}
            className="mt-4 flex gap-2"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              disabled={!active}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              aria-label="Send"
              disabled={!active || !draft.trim() || sendMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
