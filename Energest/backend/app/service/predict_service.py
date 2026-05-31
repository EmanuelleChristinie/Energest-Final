import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(MODEL_PATH)

def predict_energy(*, consumo: float | None = None, features: np.ndarray | None = None):
    """Compatível com versões do modelo:
    - modelo atual (train_model.py) espera 5 features (temperature, load_percentage, operating_hours, maintenance_status, machine_age_years)
    - rota antiga usava um único valor "consumo"

    Passa preferencialmente "features".
    """
    if features is not None:
        prediction = model.predict(features)
        return float(prediction[0])

    if consumo is None:
        raise ValueError("Informe consumo ou features")


    features = np.array([[consumo, consumo, consumo, 0.0, consumo]], dtype=float)
    prediction = model.predict(features)
    return float(prediction[0])
