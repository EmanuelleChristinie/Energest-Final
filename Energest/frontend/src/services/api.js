// src/services/api.js
import { kpiData, chartData, iaRecommendations, equipamentosData } from './mockData.js';

// ==========================================
// CONFIGURAÇÃO DE AMBIENTE (ENV)
// ==========================================
// Mantenha em 'false' para ler os dados REAIS do seu Python (main.py)
const USE_MOCK = false; 

const BASE_URL = 'http://127.0.0.1:8001';  // alterei a porta 
// ==========================================

/**
 * Função Core de Fetch com Fallback de Segurança
 */
async function fetchFromApi(endpoint, mockFallback) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFallback), 600);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[API ERROR] Falha ao comunicar com ${endpoint}:`, error);
    console.warn("🛡️ Ativando Fallback Mode: Usando Mocks para não travar a tela.");
    return mockFallback;
  }
}

// ==========================================
// ROTAS DO SISTEMA (ENDPOINTS)
// ==========================================

// Esta é a rota que alimenta a sua tela de Visão Geral (Dashboard.jsx)
export const getDashboardKpis = () => fetchFromApi('/api/dashboard/kpis', kpiData);

export const getConsumoHistorico = () => fetchFromApi('/api/dashboard/grafico-consumo', chartData);

export const getRecomendacoesIA = () => fetchFromApi('/api/ia/recomendacoes', iaRecommendations);

export const getEquipamentos = async () => {
  const result = await fetchFromApi('/api/equipamentos/lista', equipamentosData);
  // Se o banco retornar vazio, usa os dados de demonstração (mockData)
  if (!result || result.length === 0) {
    console.warn('[EQUIPAMENTOS] Banco vazio — carregando dados de demonstração.');
    // Limpa cache antigo para não exibir dados desatualizados
    localStorage.removeItem('energest_equipamentos');
    return equipamentosData;
  }
  return result;
};

// Rota para a tela de Relatórios (Relatorios.jsx)
export const fetchRelatorioIA = async () => {
    const response = await fetch(`${BASE_URL}/api/relatorio/gerar`);
    if (!response.ok) throw new Error("Erro ao gerar relatório");
    return await response.json();
};

export const aprovarRecomendacao = async (idRecomendacao) => {
  if (USE_MOCK) {
    console.log(`[AUDITORIA] Ação ${idRecomendacao} enviada ao CLP.`);
    return { status: 'sucesso', mensagem: 'Ação aplicada.' };
  }

  const response = await fetch(`${BASE_URL}/api/ia/aprovar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: idRecomendacao })
  });
  return response.json();
};

export const getLiveIoTData = () => fetchFromApi('/api/iot/live', {
  sensoresAtivos: 24,
  temperaturaMedia: '45ºC',
  statusGeral: 'Operacional'
});

export const simularPrevisaoIA = async (dadosTelemetria) => {
  if (USE_MOCK) {
    return { previsao: 250.0 };
  }

  try {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosTelemetria)
    });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[API ERROR] Falha ao comunicar com /predict:`, error);
    console.warn("🛡️ Ativando Fallback Mode: Usando Mocks para não travar a tela.");
    return { previsao: 250.0 };
  }
};