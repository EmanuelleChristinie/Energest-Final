# ⚡ EnerGest - Otimizador de Eficiência e Manutenção Elétrica

Este é o repositório Front-end do projeto EnerGest, desenvolvido para o Hackathon InovSpin. O sistema é focado no monitoramento industrial, eficiência energética e recomendações de manutenção baseadas em Inteligência Artificial.

## 🛠 Tecnologias Utilizadas
* **Front-end:** React.js construído com Vite (para máxima performance).
* **Estilização:** CSS nativo com Design System baseado em variáveis globais.
* **Ícones:** Material Symbols (Google M3).

## 🚀 Como rodar o projeto localmente (Para o Back-end)

Se você vai integrar a API (Flask/FastAPI/Node) com este front-end, siga os passos abaixo para rodar a interface na sua máquina (IDE como VS Code, PyCharm, etc.):

**Pré-requisitos:**
* Ter o [Node.js](https://nodejs.org/) instalado.

**Passo a Passo:**
1. Clone este repositório.
2. Abra o terminal na pasta raiz do projeto.
3. Instale as dependências executando:
   \`\`\`bash
   npm install
   \`\`\`
4. Inicie o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   \`\`\`
5. O terminal mostrará uma URL (geralmente `http://localhost:5173/`). Abra no navegador.

## 🔌 Como fazer a Integração com o Back-end e DB

Todo o consumo de dados está isolado na pasta `/src/services/api.js`. 
Atualmente, o sistema está consumindo dados **Mockados (JSON local)** para fins de prototipação. 

Para integrar com o banco de dados real e sua API:
1. Vá até `src/services/api.js`.
2. Altere a variável `BASE_URL` de `'mock'` para a URL da sua API local (ex: `http://localhost:5000/api`).
3. Certifique-se de que os endpoints do seu back-end retornem o JSON na mesma estrutura mapeada no contrato do arquivo `api.js`.