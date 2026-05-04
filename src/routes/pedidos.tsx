import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { quotes, suppliers, formatBRL, rankProposals, defaultWeights } from "@/lib/mock-data";

export const Route = createFileRoute("/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos — Procura" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = quotes.filter((q) => q.status === "aprovada").map((q) => {
    const top = rankProposals(q.proposals, defaultWeights)[0]!;
    return { quote: q, supplier: top.supplier!, total: top.totalCost, leadTime: top.leadTimeDays };
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Pedidos de Compra" description={`${orders.length} pedidos emitidos`} />
      <Card className="shadow-[var(--shadow-card)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Pedido</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.quote.id}>
                <TableCell className="font-mono text-xs">PO-{o.quote.code.split("-").slice(-1)}</TableCell>
                <TableCell className="font-medium">{o.supplier.nomeFantasia}</TableCell>
                <TableCell className="max-w-xs truncate">{o.quote.product}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">{formatBRL(o.total)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{o.leadTime} dias</TableCell>
                <TableCell><StatusBadge status="aprovada" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}