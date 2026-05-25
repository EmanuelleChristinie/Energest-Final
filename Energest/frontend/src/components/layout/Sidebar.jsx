// src/components/layout/Sidebar.jsx
import React from 'react';

const Sidebar = ({ currentPage, setCurrentPage, onLogout }) => {
  // 1. Adicionamos o novo item "Relatórios IA" na lista
  const menuItems = [
    { id: 'dashboard', nome: 'Dashboard', icone: 'dashboard' },
    { id: 'ia', nome: 'Recomendações IA', icone: 'memory' },
    { id: 'equipamentos', nome: 'Equipamentos', icone: 'conveyor_belt' },
    { id: 'relatorios', nome: 'Relatórios IA', icone: 'monitoring' }, // Novo Item
  ];

  return (
    <aside className="sidebar" style={{
      width: '260px', height: '100vh', backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--bg-border)', padding: '24px',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary-light)', fontSize: '32px' }}>bolt</span>
        <h2 className="sidebar-text" style={{ color: 'var(--primary-light)', fontSize: '24px', fontWeight: 'bold' }}>EnerGest</h2>
      </div>

      {/* Navegação */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const ativo = currentPage === item.id;
          return (
            <div 
              key={item.id}
              className="sidebar-item"
              onClick={() => setCurrentPage(item.id)}
              title={item.nome}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '8px', cursor: 'pointer',
                backgroundColor: ativo ? 'var(--primary-dark)' : 'transparent',
                color: ativo ? 'var(--text-main)' : 'var(--text-muted)',
                transition: 'background 0.2s'
              }}
            >
              <span className="material-symbols-outlined">{item.icone}</span>
              <span className="sidebar-text" style={{ fontSize: '15px', fontWeight: ativo ? '600' : '400', whiteSpace: 'nowrap' }}>
                {item.nome}
              </span>
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <div 
        className="sidebar-item" 
        title="Sair do Sistema" 
        onClick={onLogout}
        style={{ 
          marginTop: 'auto', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          color: 'var(--danger)', 
          cursor: 'pointer', 
          padding: '12px 16px' 
        }}
      >
        <span className="material-symbols-outlined">logout</span>
        <span className="sidebar-text" style={{ fontWeight: '500', whiteSpace: 'nowrap' }}>Sair do Sistema</span>
      </div>
    </aside>
  );
};

export default Sidebar;