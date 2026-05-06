import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Sparkles, Trophy, TrendingDown, Clock, Truck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { quotes as initialQuotes, defaultWeights, rankProposals, formatBRL, type ScoringWeights, type Quote } from "@/lib/mock-data";
import { NewRfqDialog } from "@/components/NewRfqDialog";

export const Route = createFileRoute("/cotacoes")({
  head: () => ({ meta: [{ title: "Cotações & RFQ — Procura" }] }),
  component: QuotesPage,
});

function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [selected, setSelected] = useState(initialQuotes[0]!.id);
  const [open, setOpen] = useState(false);
  const [weights, setWeights] = useState<ScoringWeights>(defaultWeights);
  const quote = quotes.find((q) => q.id === selected)!;
  const ranked = useMemo(() => rankProposals(quote.proposals, weights), [quote, weights]);
  const winner = ranked[0];

  const setW = (k: keyof ScoringWeights) => (v: number[]) => setWeights({ ...weights, [k]: v[0]! });

  const presetCost = () => setWeights({ price: 55, freight: 25, leadTime: 10, rating: 10 });
  const presetEntrega = () => setWeights({ price: 20, freight: 15, leadTime: 50, rating: 15 });
  const presetLog = () => setWeights({ price: 25, freight: 45, leadTime: 20, rating: 10 });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Cotações (RFQ)"
        description="Compare propostas e identifique o melhor fornecedor com IA de decisão"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" />Nova RFQ</Button>}
      />
      <NewRfqDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(q) => {
          setQuotes((prev) => [q, ...prev]);
          setSelected(q.id);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="shadow-[var(--shadow-card)] h-fit">
          <CardHeader><CardTitle className="text-sm">Solicitações</CardTitle></CardHeader>
          <CardContent className="p-2 space-y-1">
            {quotes.map((q) => (
              <button key={q.id} onClick={() => setSelected(q.id)} className={`w-full text-left p-3 rounded-lg transition border ${selected === q.id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-mono text-muted-foreground">{q.code}</span>
                  <StatusBadge status={q.status} />
                </div>
                <p className="text-sm font-medium leading-tight">{q.product}</p>
                <p className="text-xs text-muted-foreground mt-1">{q.proposals.length} propostas</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 min-w-0">
          <Card className="shadow-[var(--shadow-card)] border-primary/20 overflow-hidden">
            <div className="bg-[image:var(--gradient-primary)] text-primary-foreground p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                <Sparkles className="h-3.5 w-3.5" /> Recomendação inteligente
              </div>
              {winner && (
                <>
                  <h2 className="text-2xl font-semibold mt-2">{winner.supplier?.nomeFantasia}</h2>
                  <p className="text-sm opacity-90">Score {winner.score}/100 • Custo total {formatBRL(winner.totalCost)} • Entrega em {winner.leadTimeDays} dias</p>
                </>
              )}
            </div>
            <CardContent className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pesos da decisão</p>
                  <div className="space-y-3">
                    <WeightSlider label="Preço" icon={TrendingDown} value={weights.price} onChange={setW("price")} />
                    <WeightSlider label="Frete" icon={Truck} value={weights.freight} onChange={setW("freight")} />
                    <WeightSlider label="Prazo" icon={Clock} value={weights.leadTime} onChange={setW("leadTime")} />
                    <WeightSlider label="Avaliação" icon={Trophy} value={weights.rating} onChange={setW("rating")} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Cenários rápidos</p>
                  <Tabs defaultValue="custo" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="custo" onClick={presetCost}>Custo</TabsTrigger>
                      <TabsTrigger value="entrega" onClick={presetEntrega}>Entrega</TabsTrigger>
                      <TabsTrigger value="log" onClick={presetLog}>Logística</TabsTrigger>
                    </TabsList>
                    <TabsContent value="custo" className="text-xs text-muted-foreground mt-3">Prioriza menor preço unitário e frete reduzido. Ideal para commodities.</TabsContent>
                    <TabsContent value="entrega" className="text-xs text-muted-foreground mt-3">Maximiza velocidade de entrega. Ideal para reposições urgentes.</TabsContent>
                    <TabsContent value="log" className="text-xs text-muted-foreground mt-3">Otimiza custo logístico total. Ideal para grandes volumes.</TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader><CardTitle className="text-sm">Ranking de propostas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {ranked.map((p, idx) => (
                <div key={p.supplierId} className={`p-4 rounded-lg border ${idx === 0 ? "border-primary/40 bg-primary/5" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{p.supplier?.nomeFantasia}</p>
                        {idx === 0 && <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Melhor opção</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.supplier?.city}/{p.supplier?.state} • Rating {p.supplier?.rating.toFixed(1)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold tabular-nums" style={{ color: idx === 0 ? "oklch(0.48 0.18 255)" : undefined }}>{p.score}</div>
                      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t">
                    <Metric label="Preço" value={formatBRL(p.price)} />
                    <Metric label="Frete" value={formatBRL(p.freight)} />
                    <Metric label="Prazo" value={`${p.leadTimeDays} dias`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WeightSlider({ label, icon: Icon, value, onChange }: { label: string; icon: any; value: number; onChange: (v: number[]) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="flex items-center gap-1.5 font-medium"><Icon className="h-3.5 w-3.5 text-muted-foreground" />{label}</span>
        <span className="tabular-nums font-semibold text-primary">{value}%</span>
      </div>
      <Slider value={[value]} onValueChange={onChange} max={100} step={5} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5 tabular-nums">{value}</p>
    </div>
  );
}