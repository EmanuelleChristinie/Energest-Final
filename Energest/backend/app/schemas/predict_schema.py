from pydantic import BaseModel

class EnergyInput(BaseModel):
    consumo: float
