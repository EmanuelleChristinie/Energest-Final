# ⚡ EnerGest - Inteligência Artificial para o Chão de Fábrica

## 🚨 Problema Abordado
As indústrias modernas enfrentam dois grandes gargalos financeiros e operacionais: **o alto custo do consumo energético** no horário de ponta e as **paradas não programadas (downtime)** por falha de maquinário. Atualmente, a gestão de fábrica atua de forma *reativa* — o problema acontece, a máquina quebra, a multa da concessionária chega, e só então a equipe toma uma atitude. Falta previsibilidade e cruzamento inteligente de dados de telemetria.

## 💡 Descrição da Solução
O **EnerGest** é uma plataforma Full-Stack de gestão preditiva que transforma a fábrica reativa em uma operação proativa. Atuando como o "cérebro" da planta industrial, o sistema realiza:
* **Monitoramento Ativo:** Dashboard com telemetria simulada em tempo real (Consumo, Metas, Economia).
* **Previsão de Consumo (What-If):** Um simulador integrado que permite ao gestor testar variáveis (Temperatura, Carga, Idade da Máquina) e prever o consumo exato da máquina antes de tomar uma decisão.
* **Centro de Decisões Preditivas:** A IA analisa padrões de erro, cruza com uma biblioteca de diagnósticos de alta engenharia e sugere ações de otimização, entregando um cálculo exato de **Nível de Confiança** e **Impacto Financeiro**. O gestor pode aprovar (aplicando a rota de economia) ou recusar (treinando o modelo com justificativas).

## 🏗️ Arquitetura da Aplicação
O projeto foi desenvolvido em uma arquitetura Cliente-Servidor (Client-Server) baseada em microsserviços rápidos, ideal para telemetria IoT e processamento de Machine Learning:

1. **Camada de Dados (Simulação IoT):** Geração de base de dados industrial realista em formato `.csv` contendo dezenas de variáveis mecânicas.
2. **Back-end (Motor Preditivo):** Uma API RESTful construída em Python recebe os chamados. O modelo de Regressão Linear do Scikit-Learn processa os dados dos sensores e devolve os cálculos preditivos via JSON.
3. **Front-end (Interface de Gestão):** Uma aplicação Single Page Application (SPA) consome a API. O painel reage aos dados com oscilações em tempo real, fornecendo controle de status em massa para os equipamentos e Modais de UX avançada (Glassmorphism).

## 🛠️ Tecnologias Utilizadas

**Front-end (Interface do Usuário):**
* React.js (Componentização e Estados Dinâmicos)
* Vite (Build tool ultrarrápido)
* Recharts (Visualização gráfica de dados)
* CSS3 / Glassmorphism (UI/UX corporativa de alto impacto)

**Back-end (API & Inteligência Artificial):**
* Python 3
* FastAPI (Criação de rotas assíncronas e rápidas de API)
* Uvicorn (Servidor ASGI de alta performance)
* Scikit-Learn (Treinamento de modelo de Machine Learning)
* Pandas & Numpy (Estruturação e manipulação de DataFrames)
* Joblib (Exportação do cérebro da IA para o formato `.pkl`)

## 🚀 Instruções para Execução do Projeto

Siga os passos abaixo para rodar a aplicação completa localmente.

### 1. Configurando o Back-end (Motor Python)
Abra o seu terminal, navegue até a pasta raiz do back-end (`backend/`) e execute:

```bash
# 1. Instale as dependências essenciais
pip install fastapi uvicorn pandas scikit-learn pydantic joblib

# 2. Gere os dados falsos de IoT e treine a IA localmente
python fix_ia.py

# 3. Inicie o servidor da API
uvicorn app.main:app --reload

A API estará escutando na porta http://127.0.0.1:8000.

2. Configurando o Front-end (Painel React)
Abra um novo terminal, navegue até a pasta raiz do front-end (energest-front/) e execute:

Bash
# 1. Baixe as dependências do projeto (Node Modules)
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
O sistema estará disponível no seu navegador no endereço http://localhost:5173.

Dica de Avaliação: Acesse a tela "Recomendações IA" e utilize o Simulador What-If. Clique em "Auto-Preencher Anomalia" para ver a comunicação instantânea entre o painel e o motor preditivo do Back-end.
