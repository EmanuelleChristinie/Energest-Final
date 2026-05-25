// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';

const Header = ({ onLogout }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [modalConfig, setModalConfig] = useState(false);
  const [modalSupport, setModalSupport] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);

  // Estados FUNCIONAIS para os Modais
  const [configSync, setConfigSync] = useState(true);
  const [configEmail, setConfigEmail] = useState(false);
  const [supportText, setSupportText] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  const headerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setShowNotif(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificacoes = [
    { id: 1, texto: 'Anomalia detectada: Motor Principal (Temperatura alta).', tipo: 'critico', tempo: 'Há 5 min', icone: 'warning' },
    { id: 2, texto: 'Recomendação aplicada: Redução de carga.', tipo: 'info', tempo: 'Há 2 horas', icone: 'memory' },
    { id: 3, texto: 'Economia de R$ 120,50 atingida neste turno.', tipo: 'sucesso', tempo: 'Há 5 horas', icone: 'savings' }
  ];

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  };

  const modalStyle = {
    backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '500px',
    borderRadius: '16px', border: '1px solid var(--bg-border)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
  };

  const dropdownStyle = {
    position: 'absolute', top: '56px', right: '0', backgroundColor: 'rgba(21, 32, 43, 0.85)',
    backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', overflow: 'hidden', zIndex: 100, transformOrigin: 'top right'
  };

  const handleSendSupport = () => {
    if(supportText.length > 5) {
      setSupportSent(true);
      setTimeout(() => { setModalSupport(false); setSupportSent(false); setSupportText(""); }, 3000);
    }
  };

  return (
    <>
      <header ref={headerRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--bg-border)', position: 'relative', zIndex: 50 }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Visão Geral</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Monitoramento ativo por IA</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* NOTIFICAÇÕES */}
          <div style={{ position: 'relative' }}>
            <div style={{ cursor: 'pointer', position: 'relative', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: showNotif ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '50%', transition: 'all 0.2s ease', border: '1px solid transparent', borderColor: showNotif ? 'rgba(255,255,255,0.1)' : 'transparent' }} onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
              <span className="material-symbols-outlined" style={{ color: showNotif ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '24px' }}>notifications</span>
              <span style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg-main)' }}></span>
            </div>

            {showNotif && (
              <div className="animate-fade-in" style={{ ...dropdownStyle, width: '380px' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '600' }}>Notificações</h4>
                  <span onClick={() => setShowNotif(false)} style={{ fontSize: '13px', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: '500' }}>Marcar lidas</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '320px', overflowY: 'auto' }}>
                  {notificacoes.map(notif => (
                    <div key={notif.id} style={{ display: 'flex', gap: '16px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: notif.tipo === 'critico' ? 'rgba(255, 61, 61, 0.15)' : notif.tipo === 'sucesso' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(74, 157, 156, 0.15)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: notif.tipo === 'critico' ? 'var(--danger)' : notif.tipo === 'sucesso' ? '#10B981' : 'var(--primary-light)' }}>{notif.icone}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.4', marginBottom: '6px' }}>{notif.texto}</p>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span> {notif.tempo}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div onClick={() => { setShowNotif(false); setModalHistory(true); }} style={{ padding: '16px', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)', cursor: 'pointer', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500' }}>Ver histórico completo</div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>

          {/* PERFIL */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 12px 6px 6px', borderRadius: '30px', transition: 'all 0.2s ease', backgroundColor: showProfile ? 'rgba(255,255,255,0.05)' : 'transparent', border: '1px solid transparent', borderColor: showProfile ? 'rgba(255,255,255,0.1)' : 'transparent' }} onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' }}>GI</div>
              <div className="hide-mobile" style={{ textAlign: 'left' }}>
                <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: '600' }}>Gestor Industrial</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Administrador da Planta</div>
              </div>
            </div>

            {showProfile && (
              <div className="animate-fade-in" style={{ ...dropdownStyle, width: '260px' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '18px' }}>GI</div>
                   <div>
                      <div style={{ color: 'var(--text-main)', fontSize: '16px', fontWeight: '600' }}>Gestor Industrial</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>admin@energest.com</div>
                   </div>
                </div>
                <div style={{ padding: '8px' }}>
                  <div onClick={() => { setShowProfile(false); setModalConfig(true); }} style={{ padding: '12px 16px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', borderRadius: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>settings</span> Configurações</div>
                  <div onClick={() => { setShowProfile(false); setModalSupport(true); }} style={{ padding: '12px 16px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', borderRadius: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>support_agent</span> Suporte Técnico</div>
                </div>
                <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <div onClick={onLogout} style={{ padding: '12px 16px', color: '#ef4444', cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', fontWeight: '600', borderRadius: '8px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span> Encerrar Sessão</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MODAL HISTÓRICO */}
      {modalHistory && (
        <div className="animate-fade-in" style={overlayStyle} onClick={() => setModalHistory(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ color: 'var(--primary-light)' }}>history</span> Histórico de Alertas</h3>
              <span className="material-symbols-outlined" onClick={() => setModalHistory(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>close</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
              {[...notificacoes, {id: 4, texto: 'Manutenção preventiva concluída.', tipo: 'sucesso', tempo: 'Ontem', icone: 'check_circle'}].map(n => (
                <div key={n.id} style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '8px', border: '1px solid var(--bg-border)' }}>
                  <span className="material-symbols-outlined" style={{ color: n.tipo === 'critico' ? 'var(--danger)' : n.tipo === 'sucesso' ? '#10B981' : 'var(--primary-light)' }}>{n.icone}</span>
                  <div><p style={{ color: 'var(--text-main)', fontSize: '14px' }}>{n.texto}</p><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{n.tempo}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURAÇÕES (AGORA FUNCIONAL) */}
      {modalConfig && (
        <div className="animate-fade-in" style={overlayStyle} onClick={() => setModalConfig(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>settings</span> Configurações da Planta</h3>
              <span className="material-symbols-outlined" onClick={() => setModalConfig(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>close</span>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h4 style={{ color: 'var(--text-main)', fontSize: '15px' }}>Sincronização Automática (IoT)</h4><p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Atualiza o painel em tempo real.</p></div>
                <div onClick={() => setConfigSync(!configSync)} style={{ width: '44px', height: '24px', backgroundColor: configSync ? '#10B981' : 'var(--bg-main)', border: configSync ? 'none' : '1px solid var(--bg-border)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: configSync ? '#fff' : 'var(--text-muted)', borderRadius: '50%', position: 'absolute', top: configSync ? '2px' : '1px', left: configSync ? '22px' : '2px', transition: '0.3s' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h4 style={{ color: 'var(--text-main)', fontSize: '15px' }}>Notificações por E-mail</h4><p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Receber alertas críticos no e-mail.</p></div>
                <div onClick={() => setConfigEmail(!configEmail)} style={{ width: '44px', height: '24px', backgroundColor: configEmail ? '#10B981' : 'var(--bg-main)', border: configEmail ? 'none' : '1px solid var(--bg-border)', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: configEmail ? '#fff' : 'var(--text-muted)', borderRadius: '50%', position: 'absolute', top: configEmail ? '2px' : '1px', left: configEmail ? '22px' : '2px', transition: '0.3s' }}></div>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'flex-end' }}><button onClick={() => setModalConfig(false)} style={{ backgroundColor: 'var(--primary-dark)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Salvar Preferências</button></div>
          </div>
        </div>
      )}

      {/* MODAL SUPORTE TÉCNICO (AGORA FUNCIONAL) */}
      {modalSupport && (
        <div className="animate-fade-in" style={overlayStyle} onClick={() => setModalSupport(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><span className="material-symbols-outlined" style={{ color: 'var(--primary-light)' }}>support_agent</span> Central de Suporte</h3>
              <span className="material-symbols-outlined" onClick={() => setModalSupport(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>close</span>
            </div>
            <div style={{ padding: '24px' }}>
              {supportSent ? (
                <div className="animate-fade-in" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: '#10B981', fontSize: '48px', marginBottom: '12px' }}>check_circle</span>
                  <h4 style={{ color: 'var(--text-main)', fontSize: '18px', marginBottom: '8px' }}>Solicitação Enviada!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Nossa equipe de engenharia foi notificada e entrará em contato em breve.</p>
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--text-main)', fontSize: '14px', marginBottom: '16px' }}>Descreva o problema ou a anomalia identificada no sistema preditivo.</p>
                  <textarea value={supportText} onChange={(e) => setSupportText(e.target.value)} placeholder="Ex: A máquina MAQ-005 não está sincronizando..." style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--bg-border)', color: 'var(--text-main)', outline: 'none', resize: 'none', marginBottom: '16px' }}></textarea>
                  <button onClick={handleSendSupport} disabled={supportText.length < 5} style={{ width: '100%', backgroundColor: supportText.length < 5 ? 'var(--bg-border)' : 'var(--primary)', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', cursor: supportText.length < 5 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                    <span className="material-symbols-outlined">send</span> Enviar Solicitação
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;