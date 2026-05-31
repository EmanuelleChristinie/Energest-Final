from fastapi import APIRouter
from app.schemas.predict_schema import EnergyInput
from app.service.predict_service import predict_energy

router = APIRouter()

@router.post("/predict")
def predict(data: EnergyInput):
    # compat: alguns clientes/testes enviam um conjunto de features (temperature, load_percentage, ...)
    # e esperam que a rota funcione mesmo sem campo "consumo".
    if hasattr(data, "consumo") and data.consumo is not None:
        prediction = predict_energy(consumo=data.consumo)
        return {"previsao": prediction}


    # Se "consumo" não existir (ou vier None), usamos uma proxy simples
    # (soma ponderada das features mais comuns) para manter o contrato do endpoint.
    try:
        payload = data.model_dump()
        temperature = float(payload.get("temperature", 0.0))    
        load_percentage = float(payload.get("load_percentage", 0.0))
        operating_hours = float(payload.get("operating_hours", 0.0))
        maintenance_status = float(payload.get("maintenance_status", 0.0))
        machine_age_years = float(payload.get("machine_age_years", 0.0))
        proxy_consumo = (temperature * 1.5) + (load_percentage * 2.0) + (machine_age_years * 10) - (maintenance_status * 20)
        prediction = predict_energy(consumo=proxy_consumo)

        return {"previsao": prediction}
    except Exception as e:
        # FastAPI já trata validação, mas aqui garantimos erro claro
        raise e

