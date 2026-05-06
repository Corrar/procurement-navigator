export type SupplierStatus = "ativo" | "inativo" | "bloqueado";
export type Category = "Matéria-prima" | "Embalagens" | "Tecnologia" | "Serviços" | "Logística" | "Manutenção";

export interface Supplier {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  category: Category;
  rating: number; // 0-5
  status: SupplierStatus;
  email: string;
  phone: string;
  responsavel: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  totalCompras: number;
  ordersCount: number;
  onTimeRate: number; // 0-100
}

export const suppliers: Supplier[] = [
  { id: "f1", razaoSocial: "Aço Brasil Indústria S/A", nomeFantasia: "AçoBrasil", cnpj: "12.345.678/0001-90", category: "Matéria-prima", rating: 4.7, status: "ativo", email: "vendas@acobrasil.com.br", phone: "(11) 3344-5566", responsavel: "Carlos Mendes", city: "São Paulo", state: "SP", address: "Av. Industrial, 1200", lat: -23.5505, lng: -46.6333, totalCompras: 1245000, ordersCount: 87, onTimeRate: 94 },
  { id: "f2", razaoSocial: "Embalagens União Ltda", nomeFantasia: "União Pack", cnpj: "23.456.789/0001-12", category: "Embalagens", rating: 4.2, status: "ativo", email: "comercial@uniaopack.com", phone: "(21) 2233-4455", responsavel: "Ana Ribeiro", city: "Rio de Janeiro", state: "RJ", address: "Rua das Indústrias, 345", lat: -22.9068, lng: -43.1729, totalCompras: 580000, ordersCount: 64, onTimeRate: 88 },
  { id: "f3", razaoSocial: "TechSupply Soluções Ltda", nomeFantasia: "TechSupply", cnpj: "34.567.890/0001-23", category: "Tecnologia", rating: 4.9, status: "ativo", email: "contato@techsupply.io", phone: "(31) 3344-6677", responsavel: "Pedro Almeida", city: "Belo Horizonte", state: "MG", address: "Av. Afonso Pena, 4500", lat: -19.9167, lng: -43.9345, totalCompras: 920000, ordersCount: 42, onTimeRate: 97 },
  { id: "f4", razaoSocial: "Logística Sul Express ME", nomeFantasia: "Sul Express", cnpj: "45.678.901/0001-34", category: "Logística", rating: 3.8, status: "ativo", email: "operacoes@sulexpress.com", phone: "(51) 3232-1010", responsavel: "Roberta Lima", city: "Porto Alegre", state: "RS", address: "Rod. BR-116, km 12", lat: -30.0346, lng: -51.2177, totalCompras: 340000, ordersCount: 120, onTimeRate: 82 },
  { id: "f5", razaoSocial: "Serviços NE Comercial", nomeFantasia: "NE Comercial", cnpj: "56.789.012/0001-45", category: "Serviços", rating: 4.0, status: "ativo", email: "contato@necomercial.com", phone: "(81) 3434-5656", responsavel: "Marcos Souza", city: "Recife", state: "PE", address: "Av. Boa Viagem, 800", lat: -8.0476, lng: -34.8770, totalCompras: 215000, ordersCount: 38, onTimeRate: 90 },
  { id: "f6", razaoSocial: "Manutec Engenharia", nomeFantasia: "Manutec", cnpj: "67.890.123/0001-56", category: "Manutenção", rating: 4.5, status: "ativo", email: "atendimento@manutec.eng.br", phone: "(41) 3535-7878", responsavel: "Juliana Costa", city: "Curitiba", state: "PR", address: "Rua XV de Novembro, 200", lat: -25.4284, lng: -49.2733, totalCompras: 410000, ordersCount: 55, onTimeRate: 91 },
  { id: "f7", razaoSocial: "Norte Insumos Ltda", nomeFantasia: "Norte Insumos", cnpj: "78.901.234/0001-67", category: "Matéria-prima", rating: 3.5, status: "bloqueado", email: "vendas@norteinsumos.com", phone: "(92) 3636-8989", responsavel: "Felipe Araújo", city: "Manaus", state: "AM", address: "Av. Eduardo Ribeiro, 1100", lat: -3.1190, lng: -60.0217, totalCompras: 95000, ordersCount: 12, onTimeRate: 65 },
  { id: "f8", razaoSocial: "Centro-Oeste Pack", nomeFantasia: "CO Pack", cnpj: "89.012.345/0001-78", category: "Embalagens", rating: 4.3, status: "ativo", email: "comercial@copack.com.br", phone: "(62) 3737-9090", responsavel: "Beatriz Alves", city: "Goiânia", state: "GO", address: "Rua T-23, 450", lat: -16.6864, lng: -49.2643, totalCompras: 305000, ordersCount: 47, onTimeRate: 89 },
  { id: "f9", razaoSocial: "Litoral Tech Equip.", nomeFantasia: "Litoral Tech", cnpj: "90.123.456/0001-89", category: "Tecnologia", rating: 4.1, status: "inativo", email: "ti@litoraltech.com", phone: "(48) 3838-1212", responsavel: "Diego Rocha", city: "Florianópolis", state: "SC", address: "Av. Beira Mar, 900", lat: -27.5954, lng: -48.5480, totalCompras: 175000, ordersCount: 24, onTimeRate: 86 },
];

export type QuoteStatus = "pendente" | "aprovada" | "rejeitada" | "em_analise";
export interface QuoteProposal {
  supplierId: string;
  price: number;
  freight: number;
  leadTimeDays: number;
}
export interface Quote {
  id: string;
  code: string;
  product: string;
  quantity: number;
  requestedBy: string;
  createdAt: string;
  deadline: string;
  status: QuoteStatus;
  proposals: QuoteProposal[];
  notes?: string;
  category?: Category;
  attachments?: RfqAttachment[];
}

export interface RfqAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export const quotes: Quote[] = [
  { id: "q1", code: "RFQ-2025-0142", product: "Bobina de aço galvanizado 1.2mm", quantity: 500, requestedBy: "Marina Costa", createdAt: "2026-04-22", deadline: "2026-05-08", status: "pendente",
    proposals: [
      { supplierId: "f1", price: 245000, freight: 4800, leadTimeDays: 7 },
      { supplierId: "f7", price: 232000, freight: 9200, leadTimeDays: 14 },
    ] },
  { id: "q2", code: "RFQ-2025-0141", product: "Caixas papelão 30x20x15 (lote 10k)", quantity: 10000, requestedBy: "João Pedro", createdAt: "2026-04-20", deadline: "2026-05-05", status: "em_analise",
    proposals: [
      { supplierId: "f2", price: 18900, freight: 1200, leadTimeDays: 5 },
      { supplierId: "f8", price: 17500, freight: 2400, leadTimeDays: 8 },
    ] },
  { id: "q3", code: "RFQ-2025-0140", product: "Notebooks corporativos i7 16GB", quantity: 25, requestedBy: "Camila Duarte", createdAt: "2026-04-15", deadline: "2026-04-30", status: "aprovada",
    proposals: [
      { supplierId: "f3", price: 162500, freight: 0, leadTimeDays: 10 },
      { supplierId: "f9", price: 158000, freight: 1500, leadTimeDays: 18 },
    ] },
  { id: "q4", code: "RFQ-2025-0139", product: "Frete dedicado SP→RS (carreta)", quantity: 1, requestedBy: "Marina Costa", createdAt: "2026-04-12", deadline: "2026-04-22", status: "rejeitada",
    proposals: [
      { supplierId: "f4", price: 12800, freight: 0, leadTimeDays: 3 },
    ] },
  { id: "q5", code: "RFQ-2025-0138", product: "Manutenção preventiva linha 3", quantity: 1, requestedBy: "Rafael Nunes", createdAt: "2026-04-10", deadline: "2026-04-25", status: "aprovada",
    proposals: [
      { supplierId: "f6", price: 47200, freight: 0, leadTimeDays: 5 },
    ] },
];

export const monthlySpending = [
  { month: "Nov", value: 380000 },
  { month: "Dez", value: 425000 },
  { month: "Jan", value: 510000 },
  { month: "Fev", value: 488000 },
  { month: "Mar", value: 612000 },
  { month: "Abr", value: 695000 },
];

export const categoryDistribution = [
  { name: "Matéria-prima", value: 1340000 },
  { name: "Tecnologia", value: 1095000 },
  { name: "Embalagens", value: 885000 },
  { name: "Manutenção", value: 410000 },
  { name: "Logística", value: 340000 },
  { name: "Serviços", value: 215000 },
];

export interface ScoringWeights {
  price: number;
  freight: number;
  leadTime: number;
  rating: number;
}

export const defaultWeights: ScoringWeights = { price: 40, freight: 20, leadTime: 25, rating: 15 };

export function rankProposals(proposals: QuoteProposal[], weights: ScoringWeights) {
  if (!proposals.length) return [];
  const total = (proposals[0]!.price + proposals[0]!.freight);
  const prices = proposals.map(p => p.price);
  const freights = proposals.map(p => p.freight);
  const leadTimes = proposals.map(p => p.leadTimeDays);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minF = Math.min(...freights), maxF = Math.max(...freights);
  const minL = Math.min(...leadTimes), maxL = Math.max(...leadTimes);
  const norm = (v: number, min: number, max: number) => (max === min ? 1 : 1 - (v - min) / (max - min));
  const wSum = weights.price + weights.freight + weights.leadTime + weights.rating;
  return proposals
    .map((p) => {
      const supplier = suppliers.find(s => s.id === p.supplierId);
      const ratingNorm = supplier ? supplier.rating / 5 : 0.5;
      const score =
        (norm(p.price, minP, maxP) * weights.price +
          norm(p.freight, minF, maxF) * weights.freight +
          norm(p.leadTimeDays, minL, maxL) * weights.leadTime +
          ratingNorm * weights.rating) / wSum;
      return { ...p, supplier, score: Math.round(score * 100), totalCost: p.price + p.freight, _t: total };
    })
    .sort((a, b) => b.score - a.score);
}

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}