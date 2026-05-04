import { createFileRoute } from "@tanstack/react-router";
import { Bell, AlertTriangle, CheckCircle2, Clock, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações — Procura" }] }),
  component: NotificationsPage,
});

const items = [
  { icon: Bell, color: "text-info bg-info/10", title: "Nova proposta recebida", desc: "TechSupply enviou proposta para RFQ-2025-0142", time: "há 12 min" },
  { icon: Clock, color: "text-warning bg-warning/15", title: "Aprovação pendente há 3 dias", desc: "RFQ-2025-0141 aguarda decisão do Gerente", time: "há 3 dias" },
  { icon: AlertTriangle, color: "text-destructive bg-destructive/10", title: "Queda de desempenho detectada", desc: "Norte Insumos: pontualidade caiu de 82% para 65%", time: "há 5 horas" },
  { icon: TrendingDown, color: "text-warning bg-warning/15", title: "Preço acima da média", desc: "Bobina de aço: proposta 14% acima da média histórica", time: "ontem" },
  { icon: CheckCircle2, color: "text-success bg-success/10", title: "Pedido entregue no prazo", desc: "PO-0140 da TechSupply foi entregue conforme acordado", time: "ontem" },
];

function NotificationsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Notificações" description="Alertas inteligentes de procurement" />
      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="p-2 divide-y">
          {items.map((n, i) => (
            <div key={i} className="flex gap-3 p-4 hover:bg-muted/40 transition rounded-md">
              <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${n.color}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}