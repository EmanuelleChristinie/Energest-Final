// src/pages/Equipamentos/Equipamentos.jsx
import React, { useState, useEffect } from "react";
import { getEquipamentos } from "../../services/api";
import AlertBadge from "../../components/ui/AlertBadge.jsx"; // <-- Só tiramos o 'src/' daqui!
import SimuladorIAReal from "../../components/ui/SimuladorIAReal.jsx";

const Equipamentos = () => {
  const [toastMsg, setToastMsg] = useState(null);
  
  // O Estado Central começa vazio
  const [listaEquipamentos, setListaEquipamentos] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // 1. CONEXÃO COM O BACK-END (PYTHON) 
  useEffect(() => {
    const carregarDados = async () => {
      setIsLoadingData(true);
      try {
        // Vai buscar os dados ao FastAPI (ou assume o mock de segurança se falhar)
        const dadosAPI = await getEquipamentos();
        
        // Formata os dados para garantir que a última máquina aparece offline
        const dadosFormatados = dadosAPI.map((maq, index) => ({
          ...maq,
          status: index === dadosAPI.length - 1 ? 'Offline' : maq.status
        }));
        
        setListaEquipamentos(dadosFormatados);
      } catch (error) {
        console.error("Erro de conexão com a API:", error);
        // Fallback de emergência: Tenta recuperar do cache do navegador
        const dadosGuardados = localStorage.getItem('energest_equipamentos');
        if (dadosGuardados) {
          setListaEquipamentos(JSON.parse(dadosGuardados));
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    carregarDados();
  }, []);

  // 2. BACKUP LOCAL (Segurança para a Apresentação)
  useEffect(() => {
    if (!isLoadingData && listaEquipamentos.length > 0) {
      localStorage.setItem('energest_equipamentos', JSON.stringify(listaEquipamentos));
    }
  }, [listaEquipamentos, isLoadingData]);

  const [modalIoT, setModalIoT] = useState(null);
  
  // Estados para o CRUD (Registo e Edição)
  const [showModalForm, setShowModalForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '', nome: '', tipo: 'Motor Trifásico', ultima_manutencao: '', status: 'Operacional'
  });

  // --- FUNÇÕES DO CRUD (Atualizam o Ecrã Instantaneamente) ---

  const handleAbrirCadastro = () => {
    setIsEditing(false);
    setFormData({ id: '', nome: '', tipo: 'Motor Trifásico', ultima_manutencao: '', status: 'Operacional' });
    setShowModalForm(true);
  };

  const handleAbrirEdicao = (maquina) => {
    setIsEditing(true);
    setFormData({ ...maquina });
    setShowModalForm(true);
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      setListaEquipamentos(prev => prev.map(maq => 
        maq.id === formData.id ? { ...maq, ...formData } : maq
      ));
      setToastMsg(`Equipamento ${formData.id} atualizado!`);
    } else {
      const novoId = `MAC-${Math.floor(Math.random() * 900) + 100}`;
      const novaMaquina = {
        ...formData,
        id: novoId,
        temperatura: '35ºC',
        vibracao: 'Normal (0.5 mm/s)'
      };
      setListaEquipamentos([novaMaquina, ...listaEquipamentos]);
      setToastMsg(`Equipamento ${novoId} emparelhado com sucesso!`);
    }

    setShowModalForm(false);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExcluir = (id, nome) => {
    if (window.confirm(`⚠️ ATENÇÃO: Tem a certeza que deseja desconectar e excluir "${nome}" (${id}) da monitorização IoT?`)) {
      setListaEquipamentos(prev => prev.filter(maq => maq.id !== id));
      setToastMsg(`Equipamento ${id} removido da planta.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // --- FUNÇÕES AUXILIARES ---

  const handleExportarCSV = () => {
    const cabecalho = "ID,Equipamento,Tipo,Status_Operacional,Temperatura,Vibracao,Ultima_Manutencao\n";
    const linhas = listaEquipamentos.map(maq => {
      return `${maq.id},${maq.nome},${maq.tipo},${maq.status},${maq.temperatura},${maq.vibracao},${maq.ultima_manutencao}`;
    }).join("\n");
    
    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `EnerGest_Relatorio_${new Date().toLocaleDateString('pt-PT').replace(/\//g, '-')}.csv`;
    link.click();
    
    setToastMsg("Relatório CSV exportado com sucesso!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getBadgeType = (status) => {
    if (status === 'Crítico') return 'danger';
    if (status === 'Atenção') return 'warning';
    if (status === 'Offline') return 'offline';
    return 'success';
  };

  const [ping, setPing] = useState(12);
  useEffect(() => {
    if (modalIoT) {
      const interval = setInterval(() => setPing(Math.floor(Math.random() * 5) + 10), 2000);
      return () => clearInterval(interval);
    }
  }, [modalIoT]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: 'var(--text-main)', fontSize: '24px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-light)' }}>conveyor_belt</span>
            Inventário de Equipamentos
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Monitorização de sensores, temperatura e vibração em tempo real.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleAbrirCadastro} 
            style={{ 
              backgroundColor: 'var(--primary-dark)', color: 'var(--text-main)', border: 'none', 
              padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', 
              cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
          >
            <span className="material-symbols-outlined">add_circle</span> Novo Equipamento
          </button>

          <button 
            onClick={handleExportarCSV} 
            style={{ 
              backgroundColor: 'transparent', color: 'var(--primary-light)', border: '1px solid var(--primary-light)', 
              padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', 
              cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(74, 157, 156, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-symbols-outlined">download</span> Exportar CSV
          </button>
        </div>
      </div>

      {/* Tabela com CRUD */}
      <div className="animate-fade-in" style={{
        backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--bg-border)', overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', borderBottom: '1px solid var(--bg-border)' }}>
              <th style={{ padding: '16px 24px', fontWeight: '500' }}>Equipamento</th>
              <th style={{ padding: '16px 24px', fontWeight: '500' }}>Estado Operacional</th>
              <th style={{ padding: '16px 24px', fontWeight: '500' }}>Temperatura</th>
              <th style={{ padding: '16px 24px', fontWeight: '500' }}>Vibração</th>
              <th style={{ padding: '16px 24px', fontWeight: '500', textAlign: 'center' }}>Ações e IoT</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingData ? (
              <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>A carregar dados da API...</td></tr>
            ) : listaEquipamentos.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum equipamento na planta.</td></tr>
            ) : (
              listaEquipamentos.map((maq, index) => (
                <tr key={maq.id} style={{ 
                  borderBottom: index === listaEquipamentos.length - 1 ? 'none' : '1px solid var(--bg-border)',
                  color: 'var(--text-main)', transition: 'background 0.2s',
                  opacity: maq.status === 'Offline' ? 0.6 : 1
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '600' }}>{maq.nome}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{maq.id} | {maq.tipo}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <AlertBadge type={getBadgeType(maq.status)} label={maq.status} icon={maq.status === 'Offline' ? 'wifi_off' : 'sensors'} />
                  </td>
                  <td style={{ padding: '16px 24px', color: maq.status === 'Crítico' ? 'var(--danger)' : 'var(--text-main)' }}>
                    {maq.status === 'Offline' ? '--' : maq.temperatura}
                  </td>
                  <td style={{ padding: '16px 24px' }}>{maq.status === 'Offline' ? '--' : maq.vibracao}</td>
                  
                  {/* BOTÕES DE AÇÃO (CRUD + IOT) */}
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button title="Ver Telemetria" onClick={() => setModalIoT(maq)} style={{
                        background: 'transparent', color: 'var(--primary-light)', border: '1px solid var(--bg-border)',
                        padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s'
                      }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-light)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-border)'}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>settings_input_antenna</span>
                      </button>

                      <button title="Editar Equipamento" onClick={() => handleAbrirEdicao(maq)} style={{
                        background: 'transparent', color: 'var(--warning)', border: '1px solid var(--bg-border)',
                        padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s'
                      }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--warning)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-border)'}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                      </button>

                      <button title="Desconectar/Excluir" onClick={() => handleExcluir(maq.id, maq.nome)} style={{
                        background: 'transparent', color: 'var(--danger)', border: '1px solid var(--bg-border)',
                        padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s'
                      }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--danger)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--bg-border)'}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '16px' }}>
        <SimuladorIAReal />
      </div>

      {/* MODAL DE FORMULÁRIO (CRIAR E EDITAR) */}
      {showModalForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: 'var(--bg-card)', width: '480px', borderRadius: '16px',
            border: `1px solid ${isEditing ? 'var(--warning)' : 'var(--primary-light)'}`, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-border)' }}>
              <h3 style={{ color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: isEditing ? 'var(--warning)' : 'var(--primary-light)' }}>
                  {isEditing ? 'edit_square' : 'add_circle'}
                </span>
                {isEditing ? 'Editar Equipamento' : 'Emparelhar Novo Equipamento'}
              </h3>
              <button onClick={() => setShowModalForm(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSalvar} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isEditing && (
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>ID do Equipamento (Não editável)</label>
                  <input type="text" value={formData.id} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', outline: 'none', cursor: 'not-allowed' }} />
                </div>
              )}

              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Nome do Equipamento</label>
                <input required type="text" placeholder="Ex: Extrusora Principal" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Categoria / Tipo</label>
                  <select required value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none', appearance: 'none' }}>
                    <option value="Motor Trifásico">Motor Trifásico</option>
                    <option value="Compressor Parafuso">Compressor Parafuso</option>
                    <option value="Bomba Centrífuga">Bomba Centrífuga</option>
                    <option value="Exaustor">Exaustor</option>
                    <option value="Trafo a Seco">Trafo a Seco</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Data da Instalação</label>
                  <input required type="date" value={formData.ultima_manutencao} onChange={(e) => setFormData({...formData, ultima_manutencao: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }} />
                </div>
              </div>

              {isEditing && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--bg-border)', marginTop: '8px' }}>
                  <label style={{ color: 'var(--primary-light)', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>science</span> Controlo de Status Simulador (Demo)
                  </label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', appearance: 'none' }}>
                    <option value="Operacional">🟢 Operacional</option>
                    <option value="Atenção">🟠 Atenção (Alerta Leve)</option>
                    <option value="Crítico">🔴 Crítico (Risco de Quebra)</option>
                    <option value="Offline">⚪ Offline (Sensor Desconectado)</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModalForm(false)} style={{ background: 'transparent', color: 'var(--text-muted)', padding: '12px 16px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ backgroundColor: isEditing ? 'var(--warning)' : 'var(--primary-dark)', color: isEditing ? '#000' : 'var(--text-main)', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                  {isEditing ? 'Guardar Alterações' : 'Emparelhar Sensores IoT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE TELEMETRIA IOT */}
      {modalIoT && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: 'var(--bg-card)', width: '500px', borderRadius: '16px',
            border: '1px solid var(--primary-light)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <div style={{ backgroundColor: 'var(--bg-main)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-light)' }}>router</span>
                <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Gateway IoT | Diagnóstico</h3>
              </div>
              <button onClick={() => setModalIoT(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <h4 style={{ color: 'var(--primary-light)', marginBottom: '4px' }}>{modalIoT.nome}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>ID: {modalIoT.id}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Protocolo</p>
                  <p style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '15px' }}>MQTT (QoS 1)</p>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>IPv4 Local</p>
                  <p style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '15px', fontFamily: 'monospace' }}>192.168.10.{Math.floor(Math.random() * 50) + 100}</p>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>Latência API</p>
                  <p style={{ color: modalIoT.status === 'Offline' ? 'var(--danger)' : '#10B981', fontWeight: 'bold', fontSize: '15px' }}>
                    {modalIoT.status === 'Offline' ? 'Timeout' : `${ping} ms`}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#000', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px', color: '#10B981' }}>
                <p style={{ color: '#555', marginBottom: '8px' }}>// Payload JSON Recebido</p>
                {modalIoT.status === 'Offline' ? (
                  <p style={{ color: 'var(--danger)' }}>Error: Connection refused. Sensor not responding.</p>
                ) : (
                  <>
                    <p>{"{"}</p>
                    <p style={{ paddingLeft: '16px' }}>"device_id": "{modalIoT.id}",</p>
                    <p style={{ paddingLeft: '16px' }}>"temp_celsius": {modalIoT.temperatura.replace('ºC', '')},</p>
                    <p style={{ paddingLeft: '16px' }}>"timestamp": "{new Date().toISOString()}"</p>
                    <p>{"}"}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notificações */}
      {toastMsg && (
        <div className="animate-fade-in" style={{ position: 'fixed', bottom: '32px', right: '32px', backgroundColor: '#10B981', color: '#ffffff', padding: '16px 24px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999, fontWeight: '500' }}>
          <span className="material-symbols-outlined">check_circle</span> {toastMsg}
        </div>
      )}
    </div>
  );
};

export default Equipamentos;