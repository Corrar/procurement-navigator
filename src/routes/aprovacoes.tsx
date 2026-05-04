import { createFileRoute } from "@tanstack/react-router";
import { Check, X, MessageSquare, Clock } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quotes, suppliers, formatBRL, rankProposals, defaultWeights } from "@/lib/mock-data";

export const Route = createFileRoute("/aprovacoes")({
  head: () => ({ meta: [{ title: "Aprovações — Procura" }] }),
  component: ApprovalsPage,
});

const flow = ["Supervisor", "Gerente", "Diretor"];

function ApprovalsPage() {
  const pending = quotes.filter((q) => q.status === "pendente" || q.status === "em_analise");

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader title="Aprovações" description={`${pending.length} cotações aguardando decisão`} />

      <div className="space-y-4">
        {pending.map((q, idx) => {
          const ranked = rankProposals(q.proposals, defaultWeights);
          const top = ranked[0]!;
          const currentLevel = idx % flow.length;
          return (
            <Card key={q.id} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{q.code}</span>
                      <StatusBadge status={q.status} />
                    </div>
                    <h3 className="font-semibold mt-1">{q.product}</h3>
                    <p className="text-sm text-muted-foreground">Solicitado por {q.requestedBy} • Prazo {new Date(q.deadline).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4 mr-1" />Comentar</Button>
                    <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/5"><X className="h-4 w-4 mr-1" />Rejeitar</Button>
                    <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground"><Check className="h-4 w-4 mr-1" />Aprovar</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-5">
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recomendação do sistema</p>
                    <p className="font-semibold">{top.supplier?.nomeFantasia}</p>
                    <p className="text-sm text-muted-foreground">{formatBRL(top.totalCost)} • {top.leadTimeDays} dias • Score {top.score}/100</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Fluxo de aprovação</p>
                    <div className="flex items-center gap-2">
                      {flow.map((step, i) => (
                        <div key={step} className="flex items-center gap-2 flex-1">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold ${i < currentLevel ? "bg-success text-success-foreground" : i === currentLevel ? "bg-primary text-primary-foreground ring-4 ring-primary/15" : "bg-muted text-muted-foreground"}`}>
                            {i < currentLevel ? <Check className="h-3 w-3" /> : i + 1}
                          </div>
                          <span className="text-xs font-medium hidden sm:inline">{step}</span>
                          {i < flow.length - 1 && <div className={`flex-1 h-0.5 ${i < currentLevel ? "bg-success" : "bg-border"}`} />}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><Clock className="h-3 w-3" />Aguardando {flow[currentLevel]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}