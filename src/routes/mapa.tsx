import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { suppliers, formatBRL } from "@/lib/mock-data";
import { MapPin, Star } from "lucide-react";

export const Route = createFileRoute("/mapa")({
  head: () => ({ meta: [{ title: "Mapa de Fornecedores — Procura" }] }),
  component: MapPage,
});

function MapPage() {
  const [cat, setCat] = useState("all");
  const [Map, setMap] = useState<any>(null);
  const list = suppliers.filter((s) => cat === "all" || s.category === cat);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import("react-leaflet"), import("leaflet"), import("leaflet/dist/leaflet.css" as any)]).then(([rl, L]) => {
      if (cancelled) return;
      // fix default icon paths
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setMap({ ...rl, L: L.default });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Mapa de Fornecedores"
        description="Visualização geográfica da rede de suprimentos"
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card className="shadow-[var(--shadow-card)] overflow-hidden">
          <CardContent className="p-0 h-[640px] relative">
            {!Map && <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Carregando mapa…</div>}
            {Map && (
              <Map.MapContainer center={[-15.7, -47.9]} zoom={4} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
                <Map.TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {list.map((s) => (
                  <Map.Marker key={s.id} position={[s.lat, s.lng]}>
                    <Map.Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{s.nomeFantasia}</p>
                        <p className="text-xs opacity-70">{s.category}</p>
                        <p className="text-xs mt-1">{s.city}/{s.state}</p>
                        <p className="text-xs mt-1">⭐ {s.rating.toFixed(1)} • {formatBRL(s.totalCompras)}</p>
                      </div>
                    </Map.Popup>
                  </Map.Marker>
                ))}
              </Map.MapContainer>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filtros</p>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {["Matéria-prima", "Embalagens", "Tecnologia", "Serviços", "Logística", "Manutenção"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">{list.length} fornecedores</Badge>
                <Badge variant="outline" className="border-success/30 text-success">{list.filter(s => s.status === "ativo").length} ativos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] max-h-[460px] overflow-auto">
            <CardContent className="p-2 space-y-1">
              {list.map((s) => (
                <div key={s.id} className="p-3 rounded-lg hover:bg-muted/50 transition cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{s.nomeFantasia}</p>
                    <span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-warning text-warning" />{s.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{s.city}/{s.state}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}