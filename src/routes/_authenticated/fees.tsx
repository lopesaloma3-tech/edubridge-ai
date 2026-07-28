import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CreditCard, Wallet, ReceiptText } from "lucide-react";
import { PageHeader, Panel, StatCard } from "@/components/app/panels";
import { Button } from "@/components/ui/button";
import { fees } from "@/lib/demo-data";

export const Route = createFileRoute("/_authenticated/fees")({
  head: () => ({
    meta: [
      { title: "Fees | EduBridge" },
      { name: "description", content: "Invoices, payments and receipts for tuition and campus services." },
      { property: "og:title", content: "Fees | EduBridge" },
      { property: "og:description", content: "Invoices, payments and receipts for tuition and campus services." },
    ],
  }),
  component: Fees,
});

function Fees() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Fees" subtitle="Invoices, payments and receipts in one place." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Outstanding" value="$1,545" hint="2 invoices" icon={Wallet} />
        <StatCard label="Paid this year" value="$1,630" hint="All settled" icon={CreditCard} />
        <StatCard label="Next due" value="15 Aug" hint="Tuition — Term 3" icon={ReceiptText} />
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
              {fees.map((f) => (
                <tr key={f.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 font-medium">{f.id}</td>
                  <td className="py-3 text-muted-foreground">{f.label}</td>
                  <td className="py-3">${f.amount.toLocaleString()}</td>
                  <td className="py-3 text-muted-foreground">{f.due}</td>
                  <td className="py-3">
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs">{f.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant={f.status === "Paid" ? "outline" : "hero"}
                      onClick={() =>
                        toast.success(f.status === "Paid" ? `Receipt ${f.id} downloaded` : "Payment flow coming soon")
                      }
                    >
                      {f.status === "Paid" ? "Receipt" : "Pay now"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
