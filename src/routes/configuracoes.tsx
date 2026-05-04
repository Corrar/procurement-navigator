import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Procura" }] }),
  component: SettingsPage,
});

const roles = [
  { name: "Comprador", perms: ["Criar RFQ", "Cadastrar fornecedor"], count: 12 },
  { name: "Gestor", perms: ["Aprovar até R$ 50k", "Editar fornecedores"], count: 4 },
  { name: "Administrador", perms: ["Acesso total", "Configurar sistema"], count: 2 },
];

function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Configurações" description="Perfis, permissões e preferências" />

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-base">Controle de acesso</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {roles.map((r) => (
            <div key={r.name} className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.perms.join(" • ")}</p>
              </div>
              <Badge variant="secondary">{r.count} usuários</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader><CardTitle className="text-base">Notificações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            "Novas cotações recebidas",
            "Pendências de aprovação",
            "Atrasos de entrega",
            "Alertas de desempenho de fornecedor",
          ].map((label, i) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Switch defaultChecked={i !== 3} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}