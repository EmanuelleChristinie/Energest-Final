import os
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Imports das suas classes de lógica
from app.service.analytics import EnergyAnalyzer
from app.service.visualizer import EnergyVisualizer

# ==========================================
# CONFIGURAÇÕES DE CAMINHO
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

possible_model_paths = [
    os.path.join(BASE_DIR, "..", "model.pkl"),
    os.path.join(BASE_DIR, "models", "model.pkl"),
    os.path.join(BASE_DIR, "..", "model.joblib")
]

model_path = None
for path in possible_model_paths:
    if os.path.exists(path):
        model_path = path
        break

model = joblib.load(model_path) if model_path else None

# ==========================================
# CONFIGURAÇÃO DO APP
# ==========================================
app = FastAPI(title="EnerGest API - Executive Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

static_path = os.path.join(BASE_DIR, "static")
os.makedirs(static_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_path), name="static")

class EnergyData(BaseModel):
    temperature: float
    load_percentage: float
    operating_hours: float
    maintenance_status: int
    machine_age_years: float

# ==========================================
# ROTAS DA API
# ==========================================

@app.get("/")
async def root():
    return {"status": "online", "message": "API EnerGest Operacional"}

# --- ROTA PARA A PRIMEIRA PÁGINA (VISÃO GERAL) ---
# No seu main.py
@app.get("/api/dashboard/kpis")
async def get_dashboard_summary():
    try:
        csv_path = os.path.join(BASE_DIR, "models", "energy_data.csv")
        analyzer = EnergyAnalyzer(model_path, csv_path)
        analyzer.load_data()
        results = analyzer.perform_analysis()

        # AJUSTE: Nomes das chaves idênticos ao Dashboard.jsx
        return {
            "consumo_atual_kwh": results['kpis']['consumo_total_kwh'],
            "meta_diaria_kwh": results['kpis']['media_diaria_kwh'],
            "economia_acumulada_mes_brl": results['kpis']['custo_total_brl'],
            "status_planta": "Operacional" if results['alertas']['manutencao_critica'] == 0 else "Atenção"
        }
    except Exception as e:
        print(f"❌ Erro na Visão Geral: {e}")
        return JSONResponse(status_code=500, content={"erro": str(e)})
# --- ROTA PARA A SEGUNDA PÁGINA (RELATÓRIOS ANALÍTICOS) ---
@app.get("/api/relatorio/gerar")
async def rota_relatorio():
    try:
        csv_path = os.path.join(BASE_DIR, "models", "energy_data.csv")
        output_dir = os.path.join(BASE_DIR, "static", "charts")
        pdf_output = os.path.join(BASE_DIR, "static", "Relatorio_EnerGest.pdf")
        
        os.makedirs(output_dir, exist_ok=True)

        analyzer = EnergyAnalyzer(model_path, csv_path)
        analyzer.load_data()
        results = analyzer.perform_analysis()
        df = analyzer.get_df()

        try:
            visualizer = EnergyVisualizer(df, results, output_dir)
            visualizer.create_charts()
            visualizer.generate_pdf(pdf_output)
        except Exception as visual_err:
            print(f"⚠️ Erro Visualização: {visual_err}")

        return {
            "consumo_total": results['kpis']['consumo_total_kwh'],
            "custo_total": results['kpis']['custo_total_brl'],
            "alertas": results['alertas']['anomalias_detectadas'],
            "eficiencia": results['kpis']['eficiencia_media'],
            "dados_grafico": results['dados_grafico'],
            "pdf_url": "http://127.0.0.1:8000/static/Relatorio_EnerGest.pdf"
        }
    except Exception as e:
        print(f"❌ Erro Relatório: {e}")
        return JSONResponse(status_code=500, content={"erro": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)