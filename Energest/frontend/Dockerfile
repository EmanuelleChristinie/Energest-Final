# Usa uma imagem Node.js leve e moderna
FROM node:20-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia arquivos de dependências
COPY package.json package-lock.json* ./

# Instala dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta do Vite dev server
EXPOSE 5173

# Inicia o servidor Vite escutando em todas as interfaces de rede para permitir conexões externas
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
