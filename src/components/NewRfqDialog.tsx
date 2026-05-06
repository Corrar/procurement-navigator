import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Package, Send, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  suppliers,
  type Category,
  type Quote,
  type QuoteProposal,
} from "@/lib/mock-data";

const CATEGORIES: Category[] = [
  "Matéria-prima",
  "Embalagens",
  "Tecnologia",
  "Serviços",
  "Logística",
  "Manutenção",
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (quote: Quote) => void;
}

export function NewRfqDialog({ open, onOpenChange, onCreated }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [deadline, setDeadline] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 86400000),
  );
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const eligible = useMemo(
    () =>
      suppliers.filter(
        (s) => s.status === "ativo" && (!category || s.category === category),
      ),
    [category],
  );

  const reset = () => {
    setStep(1);
    setProduct("");
    setCategory("");
    setQuantity(1);
    setDeadline(new Date(Date.now() + 14 * 86400000));
    setNotes("");
    setSelectedIds([]);
  };

  const close = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const canNext1 = product.trim().length > 2 && !!category && quantity > 0 && !!deadline;
  const canNext2 = selectedIds.length >= 1;

  const submit = () => {
    const code = `RFQ-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const proposals: QuoteProposal[] = selectedIds.map((id) => {
      const base = 5000 + Math.random() * 200000;
      return {
        supplierId: id,
        price: Math.round(base),
        freight: Math.round(base * (0.01 + Math.random() * 0.05)),
        leadTimeDays: Math.floor(3 + Math.random() * 20),
      };
    });
    const quote: Quote = {
      id: `q_${Date.now()}`,
      code,
      product: product.trim(),
      quantity,
      requestedBy: "Marina Costa",
      createdAt: new Date().toISOString().slice(0, 10),
      deadline: deadline!.toISOString().slice(0, 10),
      status: "pendente",
      proposals,
    };
    onCreated(quote);
    toast.success(`RFQ ${code} enviada`, {
      description: `${selectedIds.length} fornecedor(es) notificado(s).`,
    });
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            Nova solicitação de cotação
          </DialogTitle>
          <DialogDescription>
            Etapa {step} de 3 — {step === 1 ? "Produto e prazo" : step === 2 ? "Selecionar fornecedores" : "Revisar e enviar"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                n <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="product"><Package className="h-3.5 w-3.5 inline mr-1" />Produto / Serviço</Label>
              <Input
                id="product"
                placeholder="Ex.: Bobina de aço galvanizado 1.2mm"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="qty">Quantidade</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Prazo limite para respostas</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(d) => d < new Date(Date.now() - 86400000)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Especificações técnicas, condições de pagamento, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-2">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-4 w-4" />
                {eligible.length} fornecedor(es) elegíveis em <strong className="text-foreground">{category}</strong>
              </span>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() =>
                  setSelectedIds(
                    selectedIds.length === eligible.length ? [] : eligible.map((s) => s.id),
                  )
                }
              >
                {selectedIds.length === eligible.length ? "Limpar" : "Selecionar todos"}
              </button>
            </div>
            <div className="border rounded-lg divide-y max-h-[340px] overflow-y-auto">
              {eligible.length === 0 && (
                <p className="p-6 text-sm text-center text-muted-foreground">
                  Nenhum fornecedor ativo nesta categoria.
                </p>
              )}
              {eligible.map((s) => {
                const checked = selectedIds.includes(s.id);
                return (
                  <label
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                      checked ? "bg-primary/5" : "hover:bg-muted/50",
                    )}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggle(s.id)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.nomeFantasia}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.city}/{s.state} • Rating {s.rating.toFixed(1)} • {s.onTimeRate}% no prazo
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 py-2 text-sm">
            <SummaryRow label="Produto" value={product} />
            <SummaryRow label="Categoria" value={category} />
            <SummaryRow label="Quantidade" value={String(quantity)} />
            <SummaryRow label="Prazo" value={deadline ? format(deadline, "dd/MM/yyyy") : "—"} />
            <SummaryRow label="Fornecedores" value={`${selectedIds.length} selecionado(s)`} />
            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
              Ao confirmar, a RFQ será enviada simultaneamente para todos os fornecedores
              selecionados. Você poderá comparar as propostas no ranking inteligente.
            </div>
          </div>
        )}

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => (step === 1 ? close(false) : setStep((s) => (s - 1) as 1 | 2 | 3))}
          >
            {step === 1 ? "Cancelar" : "Voltar"}
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
            >
              Avançar
            </Button>
          ) : (
            <Button onClick={submit}>
              <Send className="h-4 w-4 mr-1" /> Enviar RFQ
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}