from fastapi import APIRouter
from app.schemas.predict_schema import EnergyInput
from app.service.predict_service import predict_energy

router = APIRouter()

@router.post("/predict")
def predict(data: EnergyInput):
    prediction = predict_energy(data.consumo)
    return {"previsao": prediction}