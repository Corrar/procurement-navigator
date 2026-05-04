import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Package, Users, Clock, DollarSign, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { suppliers, quotes, monthlySpending, categoryDistribution, formatBRL } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Procura" },
      { name: "description", content: "Visão geral de compras, gastos, fornecedores e cotações." },
    ],
  }),
  component: Dashboard,
});

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "oklch(0.55 0.14 30)"];

function Kpi({ icon: Icon, label, value, delta, positive }: { icon: any; label: string; value: string; delta: string; positive?: boolean }) {
  return (
    <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-semibold mt-2 tracking-tight">{value}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
          <span className="text-muted-foreground font-normal ml-1">vs mês anterior</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const totalGasto = monthlySpending.reduce((s, m) => s + m.value, 0);
  const topSuppliers = [...suppliers].sort((a, b) => b.totalCompras - a.totalCompras).slice(0, 5);
  const recentQuotes = quotes.slice(0, 4);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Dashboard de Compras"
        description="Visão executiva do desempenho de procurement"
        actions={
          <Button asChild>
            <Link to="/cotacoes">Nova RFQ <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Kpi icon={DollarSign} label="Gasto total (6m)" value={formatBRL(totalGasto)} delta="+13.6%" />
        <Kpi icon={TrendingDown} label="Economia gerada" value="R$ 184k" delta="+8.2%" positive />
        <Kpi icon={Clock} label="Lead time médio" value="9.4 dias" delta="-1.2 dias" positive />
        <Kpi icon={Users} label="Fornecedores ativos" value={String(suppliers.filter(s => s.status === "ativo").length)} delta="+2" positive />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Gastos ao longo do tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlySpending}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.48 0.18 255)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.48 0.18 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.012 250)" }} />
                <Line type="monotone" dataKey="value" stroke="oklch(0.48 0.18 255)" strokeWidth={2.5} dot={{ r: 4, fill: "oklch(0.48 0.18 255)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Distribuição por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatBRL(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Top fornecedores por volume</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/fornecedores">Ver todos</Link></Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSuppliers} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 250)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "oklch(0.5 0.03 250)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="nomeFantasia" tick={{ fontSize: 12, fill: "oklch(0.21 0.04 250)" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip formatter={(v: number) => formatBRL(v)} />
                <Bar dataKey="totalCompras" fill="oklch(0.48 0.18 255)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Cotações recentes</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/cotacoes">Ver todas</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentQuotes.map((q) => (
              <Link to="/cotacoes" key={q.id} className="block p-3 rounded-lg border hover:border-primary/40 hover:bg-primary/5 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-muted-foreground">{q.code}</p>
                    <p className="text-sm font-medium truncate mt-0.5">{q.product}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {q.proposals.length} propostas</span>
                  <span>•</span>
                  <span>até {new Date(q.deadline).toLocaleDateString("pt-BR")}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
