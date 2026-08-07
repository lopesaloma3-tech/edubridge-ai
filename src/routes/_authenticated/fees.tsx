import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Wallet, ReceiptText } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/fees")({
  head: () => ({
    meta: [
      { title: "Fees | EduBridge" },
      {
        name: "description",
        content: "Invoices, payments and receipts for tuition and campus services.",
      },
      { property: "og:title", content: "Fees | EduBridge" },
      {
        property: "og:description",
        content: "Invoices, payments and receipts for tuition and campus services.",
      },
    ],
  }),
  component: Fees,
});

function Fees() {
  const { user } = useCurrentUser();
  const { data: invoices = [] } = useQuery({
    queryKey: ["fee-invoices", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fee_invoices")
        .select("id, invoice_number, label, amount, due_date, status, receipt_url")
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const outstanding = invoices
    .filter((item) => item.status === "due" || item.status === "overdue")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const paid = invoices
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const nextDue = invoices.find((item) => item.status !== "paid");

  return (
    <div className="animate-fade-in">
      <PageHeader title="Fees" subtitle="Invoices, payments and receipts in one place." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Outstanding"
          value={`$${outstanding.toLocaleString()}`}
          hint={`${invoices.filter((item) => item.status !== "paid").length} invoices`}
          icon={Wallet}
        />
        <StatCard
          label="Paid"
          value={`$${paid.toLocaleString()}`}
          hint="Settled invoices"
          icon={CreditCard}
        />
        <StatCard
          label="Next due"
          value={nextDue ? new Date(nextDue.due_date).toLocaleDateString() : "—"}
          hint={nextDue?.label ?? "No upcoming invoices"}
          icon={ReceiptText}
        />
      </div>

      <Panel title="Invoices" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 font-medium">Invoice</th>
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium">Amount</th>
                <th className="py-2 font-medium">Due</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium">{invoice.invoice_number}</td>
                  <td className="py-3 text-muted-foreground">{invoice.label}</td>
                  <td className="py-3">${Number(invoice.amount).toLocaleString()}</td>
                  <td className="py-3 text-muted-foreground">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs capitalize">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {invoice.receipt_url ? (
                      <Button asChild size="sm" variant="outline">
                        <a href={invoice.receipt_url} target="_blank" rel="noreferrer">
                          Receipt
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="hero" disabled>
                        Pay now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                    No fee invoices available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
