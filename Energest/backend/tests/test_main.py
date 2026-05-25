import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. CENÁRIO DE USO CORRETO ("Caminho Feliz")
# Verifica se a IA recebe dados industriais e devolve a predição de energia
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
    # Garante que o resultado é um número (a predição da IA)
    assert isinstance(response.json()["previsao"], (int, float))

# 2. ENTRADA INVÁLIDA (Comportamento indevido)
# Verifica se o sistema trava e avisa quando enviamos dados errados (ex: texto em vez de número)
def test_predict_invalid_data():
    payload = {
        "temperature": "muito quente", # Erro: deveria ser número
        "load_percentage": 85.0
    }
    response = client.post("/predict", json=payload)
    # O código 422 é o padrão do FastAPI para "Dados Inválidos"
    assert response.status_code == 422

# 3. CASO LIMITE / VARIAÇÃO IMPORTANTE
# Testa a rota que lista os equipamentos para garantir que o banco/CSV está integrado
def test_get_equipamentos_list():
    response = client.get("/api/equipamentos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # Se houver itens, verifica se eles têm o formato esperado
    if len(response.json()) > 0:
        assert "id" in response.json()[0]