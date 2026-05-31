# Usa uma imagem oficial do Python leve
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema para evitar erros comuns com pandas/numpy
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia o arquivo de requisitos e instala as dependências reais do backend
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia o seu código local para dentro do container
COPY . .

# Porta padrão do FastAPI do EnerGest
EXPOSE 8001

# Comando para treinar a IA (se necessário) e iniciar o backend
CMD ["sh", "-c", "python fix_ia.py && uvicorn app.main:app --host 0.0.0.0 --port 8001"]