// src/pages/RecomendacoesIA/RecomendacoesIA.jsx
import React, { useState, useEffect } from 'react';
import SimuladorIAReal from '../../components/ui/SimuladorIAReal';

const bibliotecaIA = [
  { diag: "Pico de temperatura anômalo no mancal principal.", acao: "Ajustar fluxo de refrigeração para 85%.", risco: "Desgaste severo e parada em 4h" },
  { diag: "Vibração harmônica excedendo limite seguro (ISO 10816).", acao: "Reduzir velocidade de rotação em 12% temporariamente.", risco: "Quebra do eixo de transmissão" },
  { diag: "Desbalanceamento de tensão detectado na fase T.", acao: "Acionar banco de capacitores reserva automaticamente.", risco: "Sobreaquecimento do estator" },
  { diag: "Pressão de sucção abaixo do limite de cavitação.", acao: "Abrir válvula de alívio V-02 em 30%.", risco: "Destruição do rotor da bomba" },
  { diag: "Harmônicas de rede afetando eficiência do motor.", acao: "Ativar filtro ativo de harmônicas.", risco: "Aumento de 18% no consumo" },
  { diag: "Desgaste prematuro estimado na correia de transmissão.", acao: "Reduzir carga mecânica no eixo em 15%.", risco: "Rompimento em pleno regime" },
  { diag: "Consumo de energia 20% acima do padrão do turno.", acao: "Otimizar setpoint de controle PID.", risco: "Multa por ultrapassar demanda contratada" },
  { diag: "Degradação da qualidade do óleo isolante.", acao: "Agendar filtragem termovácuo em janela de manutenção.", risco: "Curto-circuito interno no trafo" },
  { diag: "Sobrecarga térmica detectada no inversor de frequência.", acao: "Aumentar ventilação forçada do painel para 100%.", risco: "Desarme por proteção térmica (Trip)" },
  { diag: "Fator de potência abaixo do limite de 0.92.", acao: "Injetar reativos na rede via painel de compensação.", risco: "Taxa excedente na fatura de energia" }
];

const gerarRecomendacoesIniciais = () => {
  const maquinas = ["Motor Principal Extrusora", "Compressor de Amônia B", "Bomba de Recirculação 02", "Moinho de Bolas Industrial"];
  const prioridades = ["Alta", "Média", "Alta", "Média"];
  
  return maquinas.map((maq, index) => {
    const itemAleatorio = bibliotecaIA[Math.floor(Math.random() * bibliotecaIA.length)];
    return {
      id: `REC-${100 + index}`,
      equipamento: maq,
      categoria: "Otimização Energética",
      prioridade: prioridades[index],
      confianca: (Math.floor(Math.random() * 10) + 85) + "%", 
      ia_diagnostico: itemAleatorio.diag,
      acao_sugerida: itemAleatorio.acao,
      what_if: {
        aplicar_economia: (Math.random() * 100 + 50).toFixed(2),
        risco_ignorar: itemAleatorio.risco
      }
    };
  });
};

const RecomendacoesIA = () => {
  const [recsList, setRecsList] = useState([]);
  const [statusCards, setStatusCards] = useState({});
  const [toastConfig, setToastConfig] = useState(null);
  
  const [showJustificativa, setShowJustificativa] = useState({});
  const [textoJustificativa, setTextoJustificativa] = useState({});
  
  // Novo Estado: Controle do Filtro (Padrão: mostra só o que o usuário precisa resolver)
  const [filtroAtual, setFiltroAtual] = useState('Pendentes');

  useEffect(() => {
    setRecsList(gerarRecomendacoesIniciais());
  }, []);

  const showToast = (texto, tipo = 'sucesso') => {
    setToastConfig({ texto, tipo });
    setTimeout(() => setToastConfig(null), 4000);
  };

  const handleAprovar = (id, equipamento) => {
    setStatusCards(prev => ({ ...prev, [id]: 'loading' }));
    setShowJustificativa(prev => ({ ...prev, [id]: false }));
    setTimeout(() => {
      setStatusCards(prev => ({ ...prev, [id]: 'success' }));
      showToast(`Ação aprovada para: ${equipamento}. Movido para Histórico.`, 'sucesso');
    }, 1200);
  };

  // RECALCULAR CORRIGIDO: Altera apenas os números (economia e confiança)
  const handleRecalcular = (id, equipamento) => {
    setStatusCards(prev => ({ ...prev, [id]: 'recalculating' }));
    setShowJustificativa(prev => ({ ...prev, [id]: false }));
    
    setTimeout(() => {
      setRecsList(prevList => prevList.map(rec => {
        if (rec.id === id) {
          const variacao = (Math.random() * 0.1) - 0.05; 
          const economiaAtual = parseFloat(String(rec.what_if?.aplicar_economia || 0).replace(',', '.'));
          const novaEconomia = (economiaAtual * (1 + variacao)).toFixed(2);
          
          const novaConfianca = (Math.floor(Math.random() * 10) + 90) + '%'; 

          return { 
            ...rec, 
            confianca: novaConfianca, 
            // Diagnóstico, Ação e Risco originais mantidos intactos!
            what_if: { ...rec.what_if, aplicar_economia: novaEconomia } 
          };
        }
        return rec;
      }));
      setStatusCards(prev => ({ ...prev, [id]: 'idle' }));
      showToast(`Cálculos preditivos refinados para ${equipamento}.`, 'info');
    }, 1500);
  };

  const toggleJustificativa = (id) => {
    setShowJustificativa(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmarRecusa = (id, equipamento) => {
    if (!textoJustificativa[id] || textoJustificativa[id].length < 5) {
      alert("Por favor, insira uma justificação técnica para treinar o modelo.");
      return;
    }
    setStatusCards(prev => ({ ...prev, [id]: 'refused' }));
    setShowJustificativa(prev => ({ ...prev, [id]: false }));
    showToast(`Recomendação recusada. Movida para o Histórico.`, 'erro');
  };

  // Lógica de Filtro dos Cards
  const recsFiltradas = recsList.filter(rec => {
    const status = statusCards[rec.id] || 'idle';
    if (filtroAtual === 'Pendentes') return status !== 'success' && status !== 'refused';
    if (filtroAtual === 'Aprovados') return status === 'success';
    if (filtroAtual === 'Recusados') return status === 'refused';
    return true; // Exibe "Todos"
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      
      {/* Cabeçalho com Filtro */}
      <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-light)' }}>auto_awesome</span>
            Centro de Decisões Preditivas
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Aprovações ajustam parâmetros na planta instantaneamente.
          </p>
        </div>
        
        {/* Dropdown de Filtro */}
        <div style={{ position: 'relative', width: '220px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)', fontSize: '20px' }}>filter_alt</span>
          <select 
            value={filtroAtual} onChange={(e) => setFiltroAtual(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-border)', color: 'var(--text-main)', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }}
          >
            <option value="Pendentes">Exibir: Pendentes</option>
            <option value="Aprovados">Exibir: Aprovados</option>
            <option value="Recusados">Exibir: Recusados</option>
            <option value="Todos">Exibir: Todos</option>
          </select>
          <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)', pointerEvents: 'none' }}>expand_more</span>
        </div>
      </div>

      {/* Lista de Recomendações */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {recsFiltradas.length === 0 ? (
          <div className="animate-fade-in" style={{ padding: '48px', textAlign: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px dashed var(--bg-border)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)', fontSize: '48px', marginBottom: '16px' }}>check_circle</span>
            <h3 style={{ color: 'var(--text-main)', fontSize: '18px', marginBottom: '8px' }}>Caixa de entrada limpa!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Não há recomendações "{filtroAtual.toLowerCase()}" no momento.</p>
          </div>
        ) : (
          recsFiltradas.map((rec, index) => {
            const statusAtual = statusCards[rec.id] || 'idle';
            const isSuccess = statusAtual === 'success';
            const isRefused = statusAtual === 'refused';

            return (
              <div key={rec.id} className={`animate-fade-in delay-${index + 1}`} style={{
                backgroundColor: 'var(--bg-card)', borderRadius: '12px',
                border: `1px solid ${isSuccess ? '#10B981' : isRefused ? 'var(--bg-border)' : 'rgba(255, 255, 255, 0.1)'}`,
                padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'all 0.3s ease',
                opacity: isRefused ? 0.6 : 1
              }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ color: isRefused ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '20px', textDecoration: isRefused ? 'line-through' : 'none' }}>{rec.equipamento}</h3>
                      {isSuccess ? (
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Aprovado</span>
                      ) : isRefused ? (
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: '1px solid var(--bg-border)' }}>Recusado</span>
                      ) : (
                        <span style={{ backgroundColor: rec.prioridade === 'Alta' ? 'rgba(255, 61, 61, 0.1)' : 'rgba(255, 224, 200, 0.1)', color: rec.prioridade === 'Alta' ? 'var(--danger)' : 'var(--warning)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                          Prioridade {rec.prioridade}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>ID: {rec.id} | {rec.categoria}</p>
                  </div>
                  
                  <div style={{ textAlign: 'right', backgroundColor: 'var(--bg-main)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Confiança da Previsão</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: rec.confianca || '85%', height: '100%', backgroundColor: isRefused ? 'var(--text-muted)' : 'var(--primary-light)' }}></div>
                      </div>
                      <span style={{ color: isRefused ? 'var(--text-muted)' : 'var(--primary-light)', fontWeight: 'bold', fontSize: '14px' }}>{rec.confianca || '85%'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${isSuccess ? '#10B981' : isRefused ? 'var(--text-muted)' : 'var(--primary)'}` }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Diagnóstico & Ação</p>
                    <p style={{ color: 'var(--text-main)', fontSize: '14px', marginBottom: '12px' }}>{rec.ia_diagnostico}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isRefused ? 'var(--text-muted)' : 'var(--primary-light)', fontWeight: '600', fontSize: '14px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span> {rec.acao_sugerida}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: isSuccess || isRefused ? 0.5 : 1 }}>
                    <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ color: '#10B981' }}>check_circle</span> <span style={{ color: 'var(--text-main)', fontSize: '14px' }}>Se Aplicar</span></div>
                       <span style={{ color: '#10B981', fontWeight: 'bold' }}>+ R$ {rec.what_if.aplicar_economia} /dia</span>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255, 61, 61, 0.05)', border: '1px solid rgba(255, 61, 61, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ color: 'var(--danger)' }}>warning</span> <span style={{ color: 'var(--text-main)', fontSize: '14px' }}>Se Ignorar</span></div>
                       <span style={{ color: 'var(--danger)', fontWeight: 'bold', fontSize: '13px' }}>{rec.what_if.risco_ignorar}</span>
                    </div>
                  </div>
                </div>

                {showJustificativa[rec.id] && (
                  <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--danger)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px' }}>Motivo da Recusa (Ajuda a treinar o modelo preditivo):</p>
                    <textarea 
                      rows="2" 
                      placeholder="Ex: Meta de produção prioritária neste turno..."
                      onChange={(e) => setTextoJustificativa(prev => ({ ...prev, [rec.id]: e.target.value }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--bg-border)', color: 'var(--text-main)', outline: 'none', resize: 'none' }}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                      <button onClick={() => toggleJustificativa(rec.id)} style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                      <button onClick={() => confirmarRecusa(rec.id, rec.equipamento)} style={{ padding: '8px 16px', backgroundColor: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar Recusa</button>
                    </div>
                  </div>
                )}

                {/* Botões só aparecem se a ação for pendente */}
                {statusAtual !== 'success' && statusAtual !== 'refused' && !showJustificativa[rec.id] && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                    
                    <button onClick={() => toggleJustificativa(rec.id)} style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>block</span> Recusar
                    </button>
                    
                    <button onClick={() => handleRecalcular(rec.id, rec.equipamento)} disabled={statusAtual === 'recalculating'} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--bg-border)', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: statusAtual === 'recalculating' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: statusAtual === 'recalculating' ? 'spin 1s linear infinite' : 'none' }}>sync</span> 
                      {statusAtual === 'recalculating' ? 'Calculando Risco...' : 'Recalcular Ganho'}
                    </button>

                    <button onClick={() => handleAprovar(rec.id, rec.equipamento)} disabled={statusAtual === 'loading'} style={{ backgroundColor: statusAtual === 'loading' ? 'var(--bg-border)' : 'var(--primary-dark)', color: 'var(--text-main)', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: statusAtual === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                      {statusAtual === 'loading' ? <><span className="material-symbols-outlined" style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>sync</span> Processando...</> : <><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>task_alt</span> Aprovar Ação</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* <SimuladorIAReal /> */}

      {toastConfig && (
        <div className="animate-fade-in" style={{ position: 'fixed', bottom: '32px', right: '32px', backgroundColor: toastConfig.tipo === 'sucesso' ? '#10B981' : toastConfig.tipo === 'erro' ? 'var(--bg-card)' : 'var(--primary-dark)', color: '#ffffff', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999, fontWeight: '500', borderLeft: toastConfig.tipo === 'erro' ? '4px solid var(--danger)' : 'none' }}>
          <span className="material-symbols-outlined">{toastConfig.tipo === 'sucesso' ? 'check_circle' : toastConfig.tipo === 'erro' ? 'feedback' : 'model_training'}</span>
          {toastConfig.texto}
        </div>
      )}
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RecomendacoesIA;