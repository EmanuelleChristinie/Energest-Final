from fastapi import Request
from fastapi.responses import JSONResponse

# Exceções de negócio do EnerGest
class DataMissingError(Exception):
    """Disparado quando o arquivo CSV de energia sumiu ou está inacessível."""
    def __init__(self, detail: str = "O arquivo histórico de energia (CSV) não foi encontrado no servidor."):
        self.detail = detail

class ModelNotTrainedError(Exception):
    """Disparado quando o arquivo .pkl da IA falha ou não existe."""
    def __init__(self, detail: str = "O modelo preditivo de IA (.pkl) está ausente ou corrompido."):
        self.detail = detail

class EquipmentLimitException(Exception):
    """Disparado quando tentam cadastrar um equipamento com carga acima do limite."""
    def __init__(self, detail: str = "Limite de carga excedido! O consumo ultrapassa a capacidade segura do setor."):
        self.detail = detail

# 2. Função para registrar os Handlers no app FastAPI
def registrar_handlers_de_erro(app):
    @app.exception_handler(DataMissingError)
    async def data_missing_handler(request: Request, exc: DataMissingError):
        return JSONResponse(
            status_code=404,
            content={"status": "error", "code": "ERR_CSV_MISSING", "mensagem": exc.detail}
        )

    @app.exception_handler(ModelNotTrainedError)
    async def model_not_trained_handler(request: Request, exc: ModelNotTrainedError):
        return JSONResponse(
            status_code=422,
            content={"status": "error", "code": "ERR_AI_MODEL_BROKEN", "mensagem": exc.detail}
        )

    @app.exception_handler(EquipmentLimitException)
    async def equipment_limit_handler(request: Request, exc: EquipmentLimitException):
        return JSONResponse(
            status_code=400,
            content={"status": "error", "code": "ERR_SUBSTATION_OVERLOAD", "mensagem": exc.detail}
        )