import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(MODEL_PATH)

def predict_energy(consumo: float):
    input_data = np.array([[consumo]])
    prediction = model.predict(input_data)
    return float(prediction[0])