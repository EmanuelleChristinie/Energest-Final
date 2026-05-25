// src/components/ui/SimuladorIAReal.jsx
import React, { useState } from "react";
import { simularPrevisaoIA } from "../../services/api";

const SimuladorIAReal = () => {
  const [formData, setFormData] = useState({
    temperature: 65.0, load_percentage: 80.0, operating_hours: 1200.0, maintenance_status: 1, machine_age_years: 5.5,
  });

  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // UX de Tradução: Dicionário amigável para o Gestor de Fábrica
  const labelsPT = {
    temperature: "Temperatura (°C)",
    load_percentage: "Carga Aplicada (%)",
    operating_hours: "Horas de Operação",
    maintenance_status: "Manutenção (1=OK, 0=Ruim)",
    machine_age_years: "Idade da Máquina (Anos)"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const autoPreencher = () => {
    setFormData({ temperature: 95.5, load_percentage: 98.0, operating_hours: 4500.0, maintenance_status: 0, machine_age_years: 12.0 });
    setResultado(null);
  };

  const executarIA = async () => {
    setIsLoading(true); setResultado(null);
    const res = await simularPrevisaoIA(formData);
    setIsLoading(false); setResultado(res);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--primary)", padding: "24px", marginTop: "16px", boxShadow: "0 0 30px rgba(74, 157, 156, 0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: '16px', marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(74, 157, 156, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: "var(--primary-light)", fontSize: "28px" }}>science</span>
          </div>
          <div>
            <h3 style={{ color: "var(--text-main)", fontSize: "20px" }}>Simulador What-If (Ao Vivo)</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Conectado ao motor preditivo Scikit-Learn via API.</p>
          </div>
        </div>
        <button onClick={autoPreencher} style={{ background: 'transparent', color: 'var(--primary-light)', border: '1px dashed var(--primary-light)', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>magic_button</span> Auto-Preencher Anomalia
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label style={{ display: "block", color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>
              {labelsPT[key]} {/* <-- Agora usa os textos em Português */}
            </label>
            <input type="number" step="0.1" name={key} value={value} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "var(--bg-main)", border: "1px solid var(--bg-border)", color: "var(--text-main)", outline: "none" }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--bg-border)'} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderTop: '1px solid var(--bg-border)', paddingTop: '20px' }}>
        <button onClick={executarIA} disabled={isLoading} style={{ backgroundColor: "var(--primary-dark)", color: "#fff", border: "none", padding: "14px 24px", borderRadius: "8px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", cursor: isLoading ? "not-allowed" : "pointer", transition: "0.2s" }}>
          {isLoading ? <><span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite" }}>sync</span> Processando Modelo...</> : <><span className="material-symbols-outlined">query_stats</span> Executar Previsão</>}
        </button>

        {resultado && !resultado.erro && (
          <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'var(--bg-main)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--bg-border)' }}>
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "4px" }}>Consumo Previsto</p>
              <span style={{ color: "var(--text-main)", fontSize: "24px", fontWeight: "800" }}>{resultado.previsao} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'normal' }}>kWh</span></span>
            </div>
            <div style={{ paddingLeft: '24px', borderLeft: '1px solid var(--bg-border)' }}>
               <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: resultado.previsao > 300 ? 'rgba(255, 61, 61, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: resultado.previsao > 300 ? 'var(--danger)' : '#10B981' }}>
                 <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{resultado.previsao > 300 ? 'warning' : 'check_circle'}</span>
                 {resultado.previsao > 300 ? 'Risco Crítico' : 'Operação Ideal'}
               </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimuladorIAReal;