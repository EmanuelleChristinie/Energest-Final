// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import KpiCard from '../../components/ui/KpiCard';
import ConsumoCustoChart from '../../components/ui/ConsumoCustoChart'; 
import DistribuicaoConsumoChart from '../../components/ui/DistribuicaoConsumoChart';
import { getDashboardKpis } from '../../services/api';

const Dashboard = () => {
  // 1. Estado inicial com as chaves exatas que o Python envia
  const [kpis, setKpis] = useState({
    consumo_atual_kwh: '0.0',
    meta_diaria_kwh: '0.0',
    economia_acumulada_mes_brl: '0.0',
    status_planta: 'Conectando...',
    timestamp: new Date().toLocaleTimeString()
  });

  // 2. Ciclo de Vida do Dashboard
  useEffect(() => {
    const fetchDados = async () => {
      try {
        // Busca dados reais do Backend (main.py)
        const dadosAPI = await getDashboardKpis();
        
        setKpis({
          ...dadosAPI,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error("Erro ao carregar Dashboard:", error);
      }
    };

    // Carrega os dados iniciais
    fetchDados();

    // 3. Simulação IoT (Flutuação de consumo em tempo real)
    const intervalo = setInterval(() => {
      setKpis(prev => {
        // Converte o valor atual para número para permitir a soma
        const consumoBase = parseFloat(prev.consumo_atual_kwh) || 0;
        
        // Cria uma pequena oscilação (0.1 a 0.5) para efeito visual de telemetria
        const novaFlutuacao = (consumoBase + (Math.random() * 0.5)).toFixed(1);
        
        return {
          ...prev, // IMPORTANTE: Mantém os dados reais de Meta e Economia intactos
          consumo_atual_kwh: novaFlutuacao,
          timestamp: new Date().toLocaleTimeString()
        };
      });
    }, 3000);
    
    return () => clearInterval(intervalo); 
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Cabeçalho de Status Ao Vivo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', margin: '0 0 4px 0' }}>Monitoramento Global</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Dados atualizados em tempo real via telemetria.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '13px', fontWeight: 'bold' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            backgroundColor: '#10B981', 
            borderRadius: '50%', 
            animation: 'pulse 1.5s infinite' 
          }}></span>
          AO VIVO - {kpis.timestamp}
        </div>
      </div>
      
      {/* Grelha de KPIs - Agora usando as variáveis corretas do Backend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div className="animate-fade-in delay-1">
          <KpiCard 
            titulo="Consumo Atual" 
            valor={`${kpis.consumo_atual_kwh} kWh`} 
            icone="bolt" 
            corDestaque="var(--primary-light)" 
          />
        </div>
        <div className="animate-fade-in delay-2">
          <KpiCard 
            titulo="Meta Diária" 
            valor={`${kpis.meta_diaria_kwh} kWh`} 
            icone="flag" 
            corDestaque="var(--primary)" 
          />
        </div>
        <div className="animate-fade-in delay-3">
          <KpiCard 
            titulo="Economia Acumulada" 
            valor={`R$ ${kpis.economia_acumulada_mes_brl}`} 
            icone="savings" 
            corDestaque="var(--primary-dark)" 
          />
        </div>
        <div className="animate-fade-in delay-4">
          <KpiCard 
            titulo="Status da Planta" 
            valor={kpis.status_planta} 
            icone="warning" 
            corDestaque={kpis.status_planta === 'Atenção' ? 'var(--danger)' : 'var(--warning)'} 
          />
        </div>
      </div>

      {/* Grelha de Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        <div className="animate-fade-in delay-4" style={chartCardStyle}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={chartTitleStyle}>Consumo vs Custo Diário</h3>
            <p style={chartSubStyle}>Monitorização de impacto financeiro no horário de ponta</p>
          </div>
          <div style={{ flex: 1 }}><ConsumoCustoChart /></div>
        </div>

        <div className="animate-fade-in delay-4" style={chartCardStyle}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={chartTitleStyle}>Distribuição de Carga</h3>
            <p style={chartSubStyle}>Para onde vai a energia da planta industrial</p>
          </div>
          <div style={{ flex: 1 }}><DistribuicaoConsumoChart /></div>
        </div>

      </div>
      
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

// Estilos auxiliares para manter o código limpo
const chartCardStyle = { 
  backgroundColor: 'var(--bg-card)', 
  borderRadius: '12px', 
  padding: '24px', 
  border: '1px solid var(--bg-border)', 
  height: '420px', 
  display: 'flex', 
  flexDirection: 'column' 
};

const chartTitleStyle = { color: 'var(--text-main)', fontSize: '18px', marginBottom: '4px', marginTop: 0 };
const chartSubStyle = { color: 'var(--text-muted)', fontSize: '13px', margin: 0 };

export default Dashboard;