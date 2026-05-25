// src/components/ui/KpiCard.jsx
import React from 'react';

const KpiCard = ({ titulo, valor, icone, corDestaque }) => {
  return (
    <div className="glow-card" style={{
      background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-main) 100%)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid var(--bg-border)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      cursor: 'default'
    }}>
      {/* Círculo do Ícone com Brilho Dinâmico */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '68px',
        height: '68px',
        borderRadius: '16px', // Quadrado arredondado fica mais moderno que círculo
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${corDestaque}`,
        boxShadow: `inset 0 0 15px ${corDestaque}33` // Sombra interna usando a cor com transparência
      }}>
        <span className="material-symbols-outlined" style={{ color: corDestaque, fontSize: '36px' }}>
          {icone}
        </span>
      </div>
      
      {/* Textos */}
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          {titulo}
        </p>
        <h3 style={{ color: 'var(--text-main)', fontSize: '32px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {valor}
        </h3>
      </div>
    </div>
  );
};

export default KpiCard;