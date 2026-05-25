// src/components/ui/AlertBadge.jsx
import React from 'react';

const AlertBadge = ({ type = 'info', icon, label }) => {
  // Encapsulamento da lógica de cores baseada no tipo (Clean Code)
  const getStyle = () => {
    switch (type) {
      case 'danger':
        return { bg: 'rgba(255, 61, 61, 0.1)', color: 'var(--danger)', border: 'var(--danger)' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '#10B981' };
      case 'warning':
        return { bg: 'rgba(255, 166, 0, 0.1)', color: 'orange', border: 'orange' };
      case 'offline':
        return { bg: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', border: 'var(--bg-border)' };
      default: // info / padrao
        return { bg: 'rgba(74, 157, 156, 0.1)', color: 'var(--primary-light)', border: 'var(--primary-light)' };
    }
  };

  const style = getStyle();

  return (
    <span 
      title={`Status Operacional: ${label}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{icon}</span>}
      {label}
    </span>
  );
};

export default AlertBadge;