// src/services/mockData.js

export const kpiData = {
  consumo_atual_kwh: 450.2,
  meta_diaria_kwh: 500.0,
  economia_acumulada_mes_brl: 3450.75,
  status_planta: "Atenção Requerida",
  equipamentos_ativos: 42,
  equipamentos_alerta: 2
};

export const chartData = [
  { hora: "14:00", consumo_kwh: 310, custo_brl: 155.00 },
  { hora: "15:00", consumo_kwh: 315, custo_brl: 157.50 },
  { hora: "16:00", consumo_kwh: 320, custo_brl: 160.00 },
  { hora: "17:00", consumo_kwh: 305, custo_brl: 290.00 }, 
  { hora: "18:00", consumo_kwh: 300, custo_brl: 450.00 } 
];

export const iaRecommendations = [
  {
    id: "REC-001",
    equipamento: "Motor Principal - Linha 1",
    categoria: "Manutenção Preditiva",
    prioridade: "Alta",
    ia_diagnostico: "Aumento de 18% na temperatura e vibração anômala.",
    acao_sugerida: "Pausar operação por 45 min para lubrificação e troca de rolamento.",
    what_if: {
      aplicar_custo: 450.00,
      ignorar_custo: 15000.00,
      risco_ignorar: "87%"
    }
  },
  {
    id: "REC-002",
    equipamento: "Sistema de Exaustão",
    categoria: "Eficiência Energética",
    prioridade: "Média",
    ia_diagnostico: "Equipamento operando a 100% durante horário de ponta.",
    acao_sugerida: "Reduzir carga para 60% entre 18h e 21h.",
    what_if: {
      aplicar_economia: 120.50,
      ignorar_desperdicio: 3615.00,
      risco_ignorar: "Baixo"
    }
  }
];

export const equipamentosData = [
  {
    id: "MOT-001",
    nome: "Motor Trifásico - Extrusora Linha 1",
    tipo: "Motor Trifásico",
    status: "Crítico",
    temperatura: "78ºC",
    vibracao: "Alta (5.2 mm/s)",
    ultima_manutencao: "2026-01-10"
  },
  {
    id: "COMP-023",
    nome: "Compressor de Parafuso - Central",
    tipo: "Compressor Parafuso",
    status: "Operacional",
    temperatura: "45ºC",
    vibracao: "Normal (1.1 mm/s)",
    ultima_manutencao: "2026-02-15"
  },
  {
    id: "EXA-005",
    nome: "Exaustor de Gases - Setor Fundição",
    tipo: "Exaustor",
    status: "Atenção",
    temperatura: "65ºC",
    vibracao: "Média (3.0 mm/s)",
    ultima_manutencao: "2025-11-05"
  },
  {
    id: "MOT-002",
    nome: "Motor Trifásico - Transportador Linha 2",
    tipo: "Motor Trifásico",
    status: "Operacional",
    temperatura: "42ºC",
    vibracao: "Normal (0.8 mm/s)",
    ultima_manutencao: "2026-01-20"
  },
  {
    id: "BOMB-011",
    nome: "Bomba Centrífuga - Circuito Hidráulico A",
    tipo: "Bomba Centrífuga",
    status: "Operacional",
    temperatura: "38ºC",
    vibracao: "Normal (0.6 mm/s)",
    ultima_manutencao: "2026-03-01"
  },
  {
    id: "BOMB-012",
    nome: "Bomba de Recirculação - Torre de Resfriamento",
    tipo: "Bomba Centrífuga",
    status: "Atenção",
    temperatura: "58ºC",
    vibracao: "Média (2.4 mm/s)",
    ultima_manutencao: "2025-10-18"
  },
  {
    id: "FORNO-003",
    nome: "Forno Industrial de Resistência - Tratamento Térmico",
    tipo: "Trafo a Seco",
    status: "Operacional",
    temperatura: "52ºC",
    vibracao: "Normal (0.4 mm/s)",
    ultima_manutencao: "2026-02-28"
  },
  {
    id: "INV-009",
    nome: "Inversor de Frequência - Esteira Linha 3",
    tipo: "Motor Trifásico",
    status: "Operacional",
    temperatura: "47ºC",
    vibracao: "Normal (0.9 mm/s)",
    ultima_manutencao: "2026-04-10"
  },
  {
    id: "MOT-007",
    nome: "Motor do Moinho de Bolas - Setor Cerâmica",
    tipo: "Motor Trifásico",
    status: "Crítico",
    temperatura: "85ºC",
    vibracao: "Alta (6.1 mm/s)",
    ultima_manutencao: "2025-08-22"
  },
  {
    id: "COMP-031",
    nome: "Compressor de Amônia - Câmara Fria B",
    tipo: "Compressor Parafuso",
    status: "Operacional",
    temperatura: "41ºC",
    vibracao: "Normal (1.3 mm/s)",
    ultima_manutencao: "2026-01-30"
  },
  {
    id: "EXA-008",
    nome: "Exaustor Axial - Cabine de Pintura",
    tipo: "Exaustor",
    status: "Operacional",
    temperatura: "36ºC",
    vibracao: "Normal (0.7 mm/s)",
    ultima_manutencao: "2026-03-15"
  },
  {
    id: "TRAFO-002",
    nome: "Transformador a Seco 500 kVA - Subestação",
    tipo: "Trafo a Seco",
    status: "Offline",
    temperatura: "--",
    vibracao: "--",
    ultima_manutencao: "2025-12-01"
  }
];

// Adicione isto no final do ficheiro src/services/mockData.js
export const distribuicaoData = [
  { name: 'Motores e Máquinas', value: 55, color: '#0D6E6E' },
  { name: 'Sistemas de Exaustão', value: 25, color: '#4a9d9c' },
  { name: 'Iluminação Industrial', value: 15, color: '#afffff' },
  { name: 'Servidores/TI', value: 5, color: '#ffe0c8' }
];