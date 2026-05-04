import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  ativo: "bg-success/10 text-success border-success/20",
  inativo: "bg-muted text-muted-foreground border-border",
  bloqueado: "bg-destructive/10 text-destructive border-destructive/20",
  pendente: "bg-warning/15 text-warning-foreground border-warning/30",
  em_analise: "bg-info/10 text-info border-info/20",
  aprovada: "bg-success/10 text-success border-success/20",
  rejeitada: "bg-destructive/10 text-destructive border-destructive/20",
};

const labels: Record<string, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  bloqueado: "Bloqueado",
  pendente: "Pendente",
  em_analise: "Em análise",
  aprovada: "Aprovada",
  rejeitada: "Rejeitada",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", map[status] ?? "")}>
      {labels[status] ?? status}
    </Badge>
  );
}