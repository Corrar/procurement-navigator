import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  FileText,
  Paperclip,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  quotes as initialQuotes,
  rankProposals,
  defaultWeights,
  formatBRL,
  suppliers,
  type Quote,
  type QuoteStatus,
} from "@/lib/mock-data";

export const Route = createFileRoute("/rfqs")({
  head: () => ({ meta: [{ title: "Minhas RFQs — Procura" }] }),
  component: RfqsPage,
});

const FILTERS: { id: "todas" | QuoteStatus; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "pendente", label: "Pendentes" },
  { id: "em_analise", label: "Em análise" },
  { id: "aprovada", label: "Aprovadas" },
  { id: "rejeitada", label: "Rejeitadas" },
];

function RfqsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Quote | null>(null);

  const list = useMemo(() => {
    return initialQuotes.filter((q) => {
      if (filter !== "todas" && q.status !== filter) return false;
      if (query) {
        const t = query.toLowerCase();
        return (
          q.product.toLowerCase().includes(t) ||
          q.code.toLowerCase().includes(t) ||
          q.requestedBy.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [filter, query]);

  const counts = useMemo(
    () => ({
      total: initialQuotes.length,
      pendente: initialQuotes.filter((q) => q.status === "pendente").length,
      aprovada: initialQuotes.filter((q) => q.status === "aprovada").length,
      rejeitada: initialQuotes.filter((q) => q.status === "rejeitada").length,
    }),
    [],
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Minhas RFQs"
        description="Acompanhe o status das cotações enviadas e revise o histórico de propostas"
      />

      <div className="grid gap-3 md:grid-cols-4 mb-6">
        <KpiCard label="Total enviadas" value={counts.total} icon={FileText} tone="info" />
        <KpiCard label="Pendentes" value={counts.pendente} icon={Clock} tone="warning" />
        <KpiCard label="Aprovadas" value={counts.aprovada} icon={CheckCircle2} tone="success" />
        <KpiCard label="Rejeitadas" value={counts.rejeitada} icon={XCircle} tone="destructive" />
      </div>

      <Card className="shadow-[var(--shadow-card)]">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList>
                {FILTERS.map((f) => (
                  <TabsTrigger key={f.id} value={f.id}>{f.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-72">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por código, produto ou solicitante…"
                className="pl-9"
              />
            </div>
          </div>

          <div className="divide-y border rounded-lg">
            {list.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">
                Nenhuma RFQ encontrada para esses filtros.
              </div>
            )}
            {list.map((q) => {
              const ranked = rankProposals(q.proposals, defaultWeights);
              const top = ranked[0];
              return (
                <button
                  key={q.id}
                  onClick={() => setSelected(q)}
                  className="w-full text-left p-4 hover:bg-muted/40 transition-colors grid grid-cols-12 gap-3 items-center"
                >
                  <div className="col-span-12 md:col-span-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-mono text-muted-foreground">{q.code}</span>
                      <StatusBadge status={q.status} />
                      {q.attachments && q.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Paperclip className="h-3 w-3" />
                          {q.attachments.length}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium leading-tight">{q.product}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">por {q.requestedBy}</p>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> Prazo
                    </p>
                    <p className="font-medium">{format(new Date(q.deadline), "dd MMM yyyy", { locale: ptBR })}</p>
                  </div>
                  <div className="col-span-6 md:col-span-2 text-xs">
                    <p className="text-muted-foreground">Propostas</p>
                    <p className="font-medium">{q.proposals.length} recebida(s)</p>
                  </div>
                  <div className="col-span-8 md:col-span-3 text-xs">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Melhor proposta
                    </p>
                    {top ? (
                      <p className="font-medium truncate">
                        {top.supplier?.nomeFantasia} • {formatBRL(top.totalCost)}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">Aguardando</p>
                    )}
                  </div>
                  <div className="col-span-4 md:col-span-1 text-right">
                    <Eye className="h-4 w-4 inline text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <RfqDetailSheet quote={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: any;
  tone: "info" | "warning" | "success" | "destructive";
}) {
  const tones: Record<string, string> = {
    info: "bg-info/10 text-info",
    warning: "bg-warning/15 text-warning-foreground",
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RfqDetailSheet({
  quote,
  onOpenChange,
}: {
  quote: Quote | null;
  onOpenChange: (o: boolean) => void;
}) {
  const ranked = quote ? rankProposals(quote.proposals, defaultWeights) : [];
  return (
    <Sheet open={!!quote} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        {quote && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">{quote.code}</span>
                <StatusBadge status={quote.status} />
              </div>
              <SheetTitle className="text-left">{quote.product}</SheetTitle>
              <SheetDescription className="text-left">
                Solicitado por {quote.requestedBy} em{" "}
                {format(new Date(quote.createdAt), "dd MMM yyyy", { locale: ptBR })} • Prazo{" "}
                {format(new Date(quote.deadline), "dd MMM yyyy", { locale: ptBR })}
              </SheetDescription>
            </SheetHeader>

            <div className="grid grid-cols-3 gap-3 mt-5 text-sm">
              <Info label="Quantidade" value={String(quote.quantity)} />
              <Info label="Categoria" value={quote.category ?? "—"} />
              <Info label="Propostas" value={String(quote.proposals.length)} />
            </div>

            {quote.notes && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Observações
                </p>
                <p className="text-sm rounded-lg bg-muted/40 p-3">{quote.notes}</p>
              </div>
            )}

            {quote.attachments && quote.attachments.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" /> Anexos ({quote.attachments.length})
                </p>
                <ul className="border rounded-lg divide-y">
                  {quote.attachments.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 p-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{a.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Histórico de propostas
              </p>
              <div className="space-y-2">
                {ranked.map((p, idx) => {
                  const s = suppliers.find((x) => x.id === p.supplierId);
                  return (
                    <div
                      key={p.supplierId}
                      className={`p-3 rounded-lg border ${idx === 0 ? "border-primary/40 bg-primary/5" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">
                          #{idx + 1} {s?.nomeFantasia}
                        </p>
                        <span className="text-xs font-bold text-primary tabular-nums">{p.score}/100</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <span>Preço: <strong className="text-foreground">{formatBRL(p.price)}</strong></span>
                        <span>Frete: <strong className="text-foreground">{formatBRL(p.freight)}</strong></span>
                        <span>Prazo: <strong className="text-foreground">{p.leadTimeDays}d</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <Link to="/cotacoes">Abrir no comparador inteligente</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}