from pydantic import BaseModel


class EnergyInput(BaseModel):
    temperature: float | None = None
    load_percentage: float | None = None
    operating_hours: float | None = None
    maintenance_status: float | None = None
    machine_age_years: float | None = None

    # Outros clientes/testes enviam apenas "consumo".
    consumo: float | None = None

