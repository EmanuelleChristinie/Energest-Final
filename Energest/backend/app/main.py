import os
import joblib
import pandas as pd
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Importações do nosso banco de dados
from . import models, database 

# Imports das classes de lógica (IA e Gráficos)
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

# CRIA AS TABELAS NO BANCO (Aqui usamos 'models' e 'database' corretamente)
models.Base.metadata.create_all(bind=database.engine)

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

@app.get("/api/dashboard/kpis")
async def get_dashboard_summary():
    try:
        # Ajuste o caminho do CSV conforme sua nova pasta 'data' se necessário
        csv_path = os.path.join(BASE_DIR, "data", "energy_data.csv")
        if not os.path.exists(csv_path):
             csv_path = os.path.join(BASE_DIR, "models", "energy_data.csv")

        analyzer = EnergyAnalyzer(model_path, csv_path)
        analyzer.load_data()
        results = analyzer.perform_analysis()

        return {
            "consumo_atual_kwh": results['kpis']['consumo_total_kwh'],
            "meta_diaria_kwh": results['kpis']['media_diaria_kwh'],
            "economia_acumulada_mes_brl": results['kpis']['custo_total_brl'],
            "status_planta": "Operacional" if results['alertas']['manutencao_critica'] == 0 else "Atenção"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": str(e)})

@app.get("/api/relatorio/gerar")
async def rota_relatorio():
    try:
        csv_path = os.path.join(BASE_DIR, "data", "energy_data.csv")
        if not os.path.exists(csv_path):
             csv_path = os.path.join(BASE_DIR, "models", "energy_data.csv")
             
        output_dir = os.path.join(BASE_DIR, "static", "charts")
        pdf_output = os.path.join(BASE_DIR, "static", "Relatorio_EnerGest.pdf")
        
        os.makedirs(output_dir, exist_ok=True)

        analyzer = EnergyAnalyzer(model_path, csv_path)
        analyzer.load_data()
        results = analyzer.perform_analysis()
        df = analyzer.get_df()

        visualizer = EnergyVisualizer(df, results, output_dir)
        visualizer.create_charts()
        visualizer.generate_pdf(pdf_output)

        return {
            "consumo_total": results['kpis']['consumo_total_kwh'],
            "custo_total": results['kpis']['custo_total_brl'],
            "pdf_url": "http://127.0.0.1:8001/static/Relatorio_EnerGest.pdf"
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": str(e)})

# --- CRUD DE EQUIPAMENTOS (BANCO DE DADOS) ---

@app.post("/api/equipamentos")
async def criar_equipamento(nome: str, setor: str, consumo: float, db: Session = Depends(database.get_db)):
    # Corrigido de 'data.Equipamento' para 'models.Equipamento'
    novo_item = models.Equipamento(nome=nome, setor=setor, consumo_nominal=consumo)
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    return novo_item

@app.get("/api/equipamentos/lista")
async def listar_equipamentos(db: Session = Depends(database.get_db)):
    # Corrigido aqui também
    return db.query(models.Equipamento).all()

@app.delete("/api/equipamentos/{id}")
async def deletar_equipamento(id: int, db: Session = Depends(database.get_db)):
    item = db.query(models.Equipamento).filter(models.Equipamento.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipamento não encontrado")
    db.delete(item)
    db.commit()
    return {"message": "Removido com sucesso"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)