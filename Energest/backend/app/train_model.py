import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib
import os

# 1. Ajuste de Caminhos Automático
# Pega a pasta onde este script (train_model.py) está
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define onde o CSV deve ser salvo (dentro de app/models para o main.py achar)
MODELS_DIR = os.path.join(BASE_DIR, "app", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

csv_path = os.path.join(MODELS_DIR, "energy_data.csv")
model_path = os.path.join(BASE_DIR, "model.pkl")

print("--- Iniciando Geração de Dados e Treino ---")

# 2. Gerar dados de exemplo
np.random.seed(42)
n_samples = 500
data = pd.DataFrame({
    "temperature": np.random.uniform(20, 50, n_samples),
    "load_percentage": np.random.uniform(30, 100, n_samples),
    "operating_hours": np.random.uniform(1, 24, n_samples),
    "maintenance_status": np.random.randint(0, 2, n_samples),
    "machine_age_years": np.random.uniform(1, 10, n_samples)
})

# Cálculo fictício para consumo
data["energy_consumption_kwh"] = (data["temperature"] * 0.5) + (data["load_percentage"] * 1.2)

# Salva o CSV exatamente onde o main.py vai procurar
data.to_csv(csv_path, index=False)
print(f"✅ CSV criado em: {csv_path}")

# 3. Treinar Modelo
X = data[["temperature", "load_percentage", "operating_hours", "maintenance_status", "machine_age_years"]]
y = data["energy_consumption_kwh"]

model = LinearRegression()
model.fit(X, y)

# 4. Salvar Modelo na raiz do backend
joblib.dump(model, model_path)
print(f"✅ Modelo salvo em: {model_path}")