import pytest
from httpx import AsyncClient, ASGITransport # Importamos o transport
from .main import app

# Configuração para o pytest-asyncio
pytestmark = pytest.mark.asyncio

BASE_URL = "http://127.0.0.1:8001"

@pytest.mark.asyncio
async def test_read_root():
    """Teste 1: Verificar se a API está online"""
    # Mudança aqui: usamos transport em vez de app diretamente
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

@pytest.mark.asyncio
async def test_get_kpis():
    """Teste 2: Verificar se os KPIs da IA estão retornando dados"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/api/dashboard/kpis")
    assert response.status_code == 200
    assert "consumo_atual_kwh" in response.json()

@pytest.mark.asyncio
async def test_create_equipment():
    """Teste 3: Verificar o 'C' do CRUD (Criar equipamento no Banco)"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.post(
            "/api/equipamentos", 
            params={"nome": "Teste Automatizado", "setor": "Lab", "consumo": 100.0}
        )
    assert response.status_code == 200
    assert response.json()["nome"] == "Teste Automatizado"

@pytest.mark.asyncio
async def test_list_equipments():
    """Teste 4: Verificar o 'R' do CRUD (Listar dados do Banco)"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/api/equipamentos/lista")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_generate_report_status():
    """Teste 5: Verificar se a rota de relatório responde corretamente"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL) as ac:
        response = await ac.get("/api/relatorio/gerar")
    assert response.status_code == 200
    assert "pdf_url" in response.json()