import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression
import os

print("Iniciando a criação do modelo de IA...")

# 1. Garante que a pasta existe para não dar erro
os.makedirs("app/models", exist_ok=True)

# 2. Gera 500 linhas de dados industriais simulados
np.random.seed(42)
data = {
    "temperature": np.random.uniform(40, 90, 500),
    "load_percentage": np.random.uniform(50, 100, 500),
    "operating_hours": np.random.uniform(100, 5000, 500),
    "maintenance_status": np.random.randint(0, 2, 500),
    "machine_age_years": np.random.uniform(1, 15, 500),
}
df = pd.DataFrame(data)

# Fórmula fictícia para o consumo (quanto mais velha e mais quente, mais consome)
df["consumo"] = (df["temperature"] * 1.5) + (df["load_percentage"] * 2.0) + (df["machine_age_years"] * 10) - (df["maintenance_status"] * 20)

# Salva o CSV só para cumprir a exigência da estrutura
df.to_csv("app/models/energy_data.csv", index=False)
print("Base de dados gerada com sucesso!")

# 3. Treina o Modelo
X = df[["temperature", "load_percentage", "operating_hours", "maintenance_status", "machine_age_years"]]
y = df["consumo"]

model = LinearRegression()
model.fit(X, y)

# 4. Salva o cérebro final na raiz do backend
joblib.dump(model, "model.pkl")
print("✅ SUCESSO! 'model.pkl' criado. O motor de IA está pronto!")