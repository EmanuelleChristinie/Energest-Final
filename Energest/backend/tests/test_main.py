import os
import joblib
from sklearn.linear_model import LinearRegression

# ==============================================================================
# SEÇÃO 0: GERADOR DE MODELO ADAPTADO PARA 5 VARIÁVEIS (FEATURES)
# ==============================================================================
caminhos_modelo = [
    "model.pkl", 
    "../model.pkl", 
    "backend/model.pkl", 
    "backend/app/model.pkl",
    "/home/runner/work/Energest-Final/Energest-Final/Energest/backend/model.pkl"
]

for caminho in caminhos_modelo:
    try:
        diretorio = os.path.dirname(caminho)
        if diretorio and not os.path.exists(diretorio):
            os.makedirs(diretorio, exist_ok=True)
        if not os.path.exists(caminho):
            model_falso = LinearRegression()
            # Treina com 5 colunas fictícias para bater com o payload do teste (5 features)
            model_falso.fit([[1.0, 1.0, 1.0, 1.0, 1.0]], [1.0])
            joblib.dump(model_falso, caminho)
    except Exception:
        pass
# ==============================================================================

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

# Força a criação de todas as tabelas e colunas atualizadas antes do teste rodar
Base.metadata.create_all(bind=engine)

client = TestClient(app)

# 1. CENÁRIO DE USO CORRETO ("Caminho Feliz")
def test_predict_success():
    payload = {
        "temperature": 28.5,
        "load_percentage": 85.0,
        "operating_hours": 12.0,
        "maintenance_status": 1,
        "machine_age_years": 3.0
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert "previsao" in response.json()
    assert isinstance(response.json()["previsao"], (int, float))

# 2. ENTRADA INVÁLIDA
def test_predict_invalid_data():
    payload = {
        "temperature": "muito quente",
        "load_percentage": 85.0
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422

# 3. CASO LIMITE
def test_get_equipamentos_list():
    response = client.get("/api/equipamentos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert "id" in response.json()[0]