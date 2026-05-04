import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, MapPin, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { suppliers, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/busca")({
  head: () => ({ meta: [{ title: "Busca Inteligente — Procura" }] }),
  component: SearchPage,
});

const recent = ["Aço galvanizado 1.2mm", "Caixas papelão 30x20", "Notebook i7 16GB"];

function SearchPage() {
  const [q, setQ] = useState("");
  const matches = q ? suppliers.filter((s) => s.nomeFantasia.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase()) || s.city.toLowerCase().includes(q.toLowerCase())) : suppliers.slice(0, 5);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Busca Inteligente" description="Encontre fornecedores ideais com sugestões automáticas" />

      <div className="relative mb-4">
        <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busque por produto, categoria ou cidade…" className="pl-12 h-14 text-base shadow-[var(--shadow-card)]" />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-muted-foreground">Recentes:</span>
        {recent.map((r) => (
          <Badge key={r} variant="secondary" onClick={() => setQ(r)} className="cursor-pointer hover:bg-primary/10">{r}</Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>Sugestões com base no histórico e desempenho</span>
      </div>

      <div className="space-y-2">
        {matches.map((s) => (
          <Card key={s.id} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-primary/30 transition cursor-pointer">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {s.nomeFantasia.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{s.nomeFantasia}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{s.category}</span>•<span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.city}/{s.state}</span>•<span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{s.rating.toFixed(1)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatBRL(s.totalCompras)}</p>
                <p className="text-xs text-muted-foreground">{s.ordersCount} pedidos</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}