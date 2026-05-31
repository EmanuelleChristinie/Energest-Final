import os
import joblib
import pandas as pd
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.openapi.docs import get_swagger_ui_html

# Importações locais do projeto com tratamento de exceções customizadas
# ==========================================
# IMPORTAÇÕES LOCAIS (CORRIGIDAS)
# ==========================================
from app import models, database 
from app.exceptions import DataMissingError, ModelNotTrainedError, EquipmentLimitException, registrar_handlers_de_erro

# Imports das classes de lógica
from app.service.analytics import EnergyAnalyzer
from app.service.visualizer import EnergyVisualizer
from app.api.predict import router as predict_router

# ==========================================
# CONFIGURAÇÕES DE CAMINHO 
# ==========================================
APP_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(APP_DIR)

model_path = os.path.join(BACKEND_DIR, "model.pkl")

# ==========================================
# SCHEMAS DE VALIDAÇÃO
# ==========================================
class EquipamentoCreate(BaseModel):
    nome: str
    setor: str
    consumo: float

class LoginSchema(BaseModel):
    username: str
    password: str

# ==========================================
# CONFIGURAÇÃO DO APP
# ==========================================
app = FastAPI(title="EnerGest API - Executive Edition", docs_url=None)

# Ativa as mensagens de erro personalizadas que criamos no Passo 1
registrar_handlers_de_erro(app)

# Fix visual para o Swagger
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
    )

models.Base.metadata.create_all(bind=database.engine)
app.include_router(predict_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

static_path = os.path.join(APP_DIR, "static")
os.makedirs(static_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_path), name="static")

# ==========================================
# AUXILIAR: BUSCA DE CSV
# ==========================================
def get_csv_path():
    paths = [
        os.path.join(APP_DIR, "data", "energy_data.csv"),
        os.path.join(BACKEND_DIR, "app", "data", "energy_data.csv"),
        os.path.join(BACKEND_DIR, "app", "models", "energy_data.csv")
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    return None

# ==========================================
# ROTAS DA API
# ==========================================

@app.get("/")
async def root():
    return {"status": "online", "message": "API EnerGest Operacional"}

# --- EQUIPAMENTOS ---

@app.post("/api/equipamentos")
async def criar_equipamento(data: EquipamentoCreate, db: Session = Depends(database.get_db)):
    # CASO DE ERRO 1: Validação de segurança de sobrecarga elétrica
    if data.consumo > 5000.0:
        raise EquipmentLimitException(f"Carga de {data.consumo}kW rejeitada. O limite crítico do setor é 5000kW.")

    novo_item = models.Equipamento(
        nome=data.nome, 
        setor=data.setor, 
        consumo_nominal=data.consumo,
        temperatura=25.0, 
        vibracao=0.05,
        status_operacional="Operacional"
    )
    db.add(novo_item)
    db.commit()
    db.refresh(novo_item)
    return novo_item

@app.get("/api/equipamentos")
@app.get("/api/equipamentos/lista")
async def listar_equipamentos(db: Session = Depends(database.get_db)):
    return db.query(models.Equipamento).all()

# --- ANÁLISES E DASHBOARD ---

@app.get("/api/dashboard/kpis")
async def get_dashboard_summary():
    try:
        path = get_csv_path()
        # CASO DE ERRO 2: Se o CSV de telemetria sumir da aplicação
        if not path: 
            raise DataMissingError()

        # CASO DE ERRO 3: Se o arquivo de inteligência artificial sumir
        if not os.path.exists(model_path):
            raise ModelNotTrainedError("O arquivo 'model.pkl' não foi encontrado na raiz do backend.")

        analyzer = EnergyAnalyzer(model_path, path)
        analyzer.load_data()
        results = analyzer.perform_analysis()

        return {
            "consumo_atual_kwh": results['kpis']['consumo_total_kwh'],
            "meta_diaria_kwh": results['kpis']['media_diaria_kwh'],
            "economia_acumulada_mes_brl": results['kpis']['custo_total_brl'],
            "status_planta": "Operacional" if results['alertas']['manutencao_critica'] == 0 else "Atenção"
        }
    except (DataMissingError, ModelNotTrainedError) as erro_customizado:
        raise erro_customizado
    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro inesperado: {str(e)}"})

@app.get("/api/relatorio/gerar")
async def gerar_relatorio_completo():
    try:
        path = get_csv_path()
        if not path: 
            raise DataMissingError()
            
        if not os.path.exists(model_path):
            raise ModelNotTrainedError("O arquivo 'model.pkl' não foi encontrado na raiz do backend.")

        output_dir = os.path.join(APP_DIR, "static", "charts")
        pdf_output = os.path.join(APP_DIR, "static", "Relatorio_EnerGest.pdf")
        os.makedirs(output_dir, exist_ok=True)

        analyzer = EnergyAnalyzer(model_path, path)
        analyzer.load_data()
        results = analyzer.perform_analysis()
        
        visualizer = EnergyVisualizer(analyzer.get_df(), results, output_dir)
        visualizer.create_charts()
        visualizer.generate_pdf(pdf_output)

        return {
            "status": "success",
            "pdf_url": "http://127.0.0.1:8001/static/Relatorio_EnerGest.pdf",
            "dados_grafico": results['dados_grafico']
        }
    except (DataMissingError, ModelNotTrainedError) as erro_customizado:
        raise erro_customizado
    except Exception as e:
        return JSONResponse(status_code=500, content={"erro": f"Erro inesperado no relatório: {str(e)}"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)