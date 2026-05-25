// src/pages/Login/Login.jsx
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEntrar = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula o tempo de resposta do servidor
    setTimeout(() => {
      setIsLoading(false);
      onLogin(); // Entra no sistema
    }, 1200);
  };

  const handleCadastrar = (e) => {
    e.preventDefault();
    alert("Função de cadastro conectada! Agora é só ligar com o Back-end.");
    setIsSignUp(false); // Volta para a tela de login
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      
      {/* O React controla a classe 'active' baseada no botão clicado */}
      <div className={`container-login ${isSignUp ? 'active' : ''}`}>
        
        {/* --- FORMULÁRIO DE CADASTRO (ESCONDIDO INICIALMENTE) --- */}
        <div className="form-container sign-up">
          <form onSubmit={handleCadastrar}>
            <h1 style={{ color: 'var(--text-main)', marginBottom: '16px' }}>Criar Conta</h1>
            <span style={{ color: 'var(--text-muted)' }}>Use seu email corporativo para registro</span>
            <input type="text" placeholder="Nome Completo" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Senha" required />
            <button type="submit">Cadastrar</button>
          </form>
        </div>

        {/* --- FORMULÁRIO DE LOGIN (VISÍVEL INICIALMENTE) --- */}
        <div className="form-container sign-in">
          <form onSubmit={handleEntrar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-light)', fontSize: '32px' }}>bolt</span>
              <h1 style={{ color: 'var(--text-main)' }}>EnerGest</h1>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>Acesse o painel da planta industrial</span>
            <input type="email" placeholder="Email Corporativo" defaultValue="gestor@industria.com" required />
            <input type="password" placeholder="Senha" defaultValue="123456" required />
            <a href="#">Esqueceu sua senha?</a>
            <button type="submit" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isLoading ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>sync</span> : 'Entrar na Plataforma'}
            </button>
          </form>
        </div>

        {/* --- PAINEL DESLIZANTE (A MÁGICA ACONTECE AQUI) --- */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Bem-vindo de volta!</h1>
              <p>Mantenha-se conectado com a sua planta industrial para acessar os dados preditivos da IA.</p>
              <button className="hidden" onClick={() => setIsSignUp(false)}>Fazer Login</button>
            </div>
            
            {/* O SEU SVG SUBSTITUI O ÍCONE AQUI 👇 */}
            <div className="toggle-panel toggle-right">
              <img src="/Processing-bro.svg" alt="Processamento de Dados" style={{ width: '500px', maxWidth: '75%', marginBottom: '16px' }} />
              <h1>Nova Planta?</h1>
              <p>Registre seus dados corporativos para começar a monitorar suas máquinas com o EnerGest.</p>
              <button className="hidden" onClick={() => setIsSignUp(true)}>Cadastre-se</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ESTILOS ADAPTADOS PARA O TEMA ENERGEST --- */}
      <style>{`
        .container-login {
          background-color: var(--bg-card);
          border-radius: 30px;
          border: 1px solid var(--bg-border);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .container-login p {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
          color: rgba(255, 255, 255, 0.8);
        }

        .container-login span {
          font-size: 12px;
        }

        .container-login a {
          color: var(--primary-light);
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }

        .container-login button {
          background-color: var(--primary);
          color: #fff;
          font-size: 13px;
          padding: 12px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .container-login button:hover {
          background-color: var(--primary-dark);
        }

        .container-login button.hidden {
          background-color: transparent;
          border-color: #fff;
        }

        .container-login button.hidden:hover {
          background-color: rgba(255,255,255,0.1);
        }

        .container-login form {
          background-color: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }

        .container-login input {
          background-color: var(--bg-main);
          color: var(--text-main);
          border: 1px solid var(--bg-border);
          margin: 8px 0;
          padding: 12px 15px;
          font-size: 14px;
          border-radius: 8px;
          width: 100%;
          outline: none;
          transition: 0.3s;
        }

        .container-login input:focus {
          border-color: var(--primary);
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .container-login.active .sign-in {
          transform: translateX(100%);
        }

        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .container-login.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }

        @keyframes move {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }

        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }

        .container-login.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }

        .toggle {
          background-color: var(--primary);
          background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-dark) 100%);
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .container-login.active .toggle {
          transform: translateX(50%);
        }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .toggle-left {
          transform: translateX(-200%);
        }

        .container-login.active .toggle-left {
          transform: translateX(0);
        }

        .toggle-right {
          right: 0;
          transform: translateX(0);
        }

        .container-login.active .toggle-right {
          transform: translateX(200%);
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;