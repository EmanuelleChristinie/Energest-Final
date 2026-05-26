import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 2000

data = pd.DataFrame({
    "temperature": np.random.uniform(18, 45, n_samples),
    "load_percentage": np.random.uniform(30, 100, n_samples),
    "operating_hours": np.random.uniform(4, 24, n_samples),
    "maintenance_status": np.random.randint(0, 2, n_samples),
    "machine_age_years": np.random.uniform(1, 15, n_samples)
})

# Cálculo do consumo baseado nas variáveis
data["energy_consumption_kwh"] = (
    0.6 * data["temperature"] +
    1.5 * data["load_percentage"] +
    0.9 * data["operating_hours"] +
    20 * data["maintenance_status"] +
    2 * data["machine_age_years"] +
    np.random.normal(0, 8, n_samples)
)

data.to_csv("energy_data.csv", index=False)
print("✅ Passo 1: Arquivo 'energy_data.csv' gerado!")