import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Relatorios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultarIA = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/relatorio/gerar');
      if (!response.ok) throw new Error("Erro na resposta do servidor");
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erro:", error);
      alert("O Backend não respondeu. Verifique se o terminal do VS Code está rodando o main.py");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0 }}>EnerGest Analytics</h1>
          <p style={{ color: '#94a3b8' }}>Relatórios de Eficiência Energética</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={consultarIA} style={btnStyle}>
            {loading ? 'ANALISANDO...' : 'EXECUTAR ANÁLISE'}
          </button>
          
          {data?.pdf_url && (
            <a href={data.pdf_url} target="_blank" rel="noreferrer" style={{ ...btnStyle, backgroundColor: '#10b981', textDecoration: 'none' }}>
              BAIXAR RELATÓRIO PDF
            </a>
          )}
        </div>
      </header>

      {data ? (
        <>
          {/* Cards de Indicadores com Explicações */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
            <div style={cardStyle}>
              <span style={labelStyle}>Consumo Total</span>
              <h2 style={valueStyle}>{data.consumo_total} kWh</h2>
              <p style={descStyle}>Volume total de energia processado pela IA no período selecionado.</p>
            </div>

            <div style={cardStyle}>
              <span style={labelStyle}>Custo Estimado</span>
              <h2 style={valueStyle}>R$ {data.custo_total}</h2>
              <p style={descStyle}>Previsão financeira baseada nas tarifas de consumo e sobretaxas de pico.</p>
            </div>

            <div style={cardStyle}>
              <span style={labelStyle}>Alertas de Anomalia</span>
              <h2 style={{ ...valueStyle, color: '#f43f5e' }}>{data.alertas}</h2>
              <p style={descStyle}>Desvios detectados onde o consumo fugiu do padrão esperado de operação.</p>
            </div>

            <div style={cardStyle}>
              <span style={labelStyle}>Eficiência Média</span>
              <h2 style={{ ...valueStyle, color: '#10b981' }}>{data.eficiencia}</h2>
              <p style={descStyle}>Relação entre horas trabalhadas e energia gasta (menor é melhor).</p>
            </div>
          </div>

          {/* Gráfico Único com Texto Explicativo */}
          <div style={{ ...cardStyle, height: 'auto', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '5px' }}>Tendência de Consumo (Histórico Analisado)</h3>
            <p style={{ ...descStyle, marginBottom: '20px' }}>
              Este gráfico de área ilustra a flutuação da demanda energética ao longo do tempo, 
              permitindo identificar picos de carga e períodos de ociosidade.
            </p>
            <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dados_grafico}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Area type="monotone" dataKey="consumo" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div> 
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>
          <p style={{ fontSize: '20px' }}>Dashboard aguardando processamento de dados...</p>
          <p>Clique no botão superior para iniciar a leitura do CSV via IA.</p>
        </div>
      )}
    </div>
  );
};

const btnStyle = { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const cardStyle = { backgroundColor: '#1e293b', padding: '25px', borderRadius: '15px', border: '1px solid #334155', textAlign: 'center' };
const labelStyle = { color: '#94a3b8', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' };
const valueStyle = { margin: '8px 0', fontSize: '24px' };
const descStyle = { color: '#64748b', fontSize: '12px', lineHeight: '1.4', margin: 0 };

export default Relatorios;