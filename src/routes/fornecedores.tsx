import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Star, MapPin, Phone, Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { suppliers, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/fornecedores")({
  head: () => ({ meta: [{ title: "Fornecedores — Procura" }] }),
  component: SuppliersPage,
});

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(value) ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

function SuppliersPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = suppliers.filter((s) => {
    const matchQ = !q || s.nomeFantasia.toLowerCase().includes(q.toLowerCase()) || s.razaoSocial.toLowerCase().includes(q.toLowerCase()) || s.cnpj.includes(q);
    const matchC = cat === "all" || s.category === cat;
    const matchS = status === "all" || s.status === status;
    return matchQ && matchC && matchS;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Fornecedores"
        description={`${suppliers.length} cadastrados • ${suppliers.filter((s) => s.status === "ativo").length} ativos`}
        actions={<Button><Plus className="h-4 w-4 mr-1" />Novo fornecedor</Button>}
      />

      <Card className="shadow-[var(--shadow-card)] mb-4">
        <CardContent className="p-4 flex flex-wrap gap-3">
          <Input placeholder="Buscar por nome ou CNPJ…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {["Matéria-prima", "Embalagens", "Tecnologia", "Serviços", "Logística", "Manutenção"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="bloqueado">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Fornecedor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead className="text-right">Compras totais</TableHead>
              <TableHead>Pontualidade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {s.nomeFantasia.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{s.nomeFantasia}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.razaoSocial} • {s.cnpj}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="text-sm">{s.category}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {s.city}/{s.state}
                  </div>
                </TableCell>
                <TableCell><Stars value={s.rating} /></TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatBRL(s.totalCompras)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${s.onTimeRate >= 90 ? "bg-success" : s.onTimeRate >= 80 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.onTimeRate}%` }} />
                    </div>
                    <span className="text-xs tabular-nums">{s.onTimeRate}%</span>
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={s.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}