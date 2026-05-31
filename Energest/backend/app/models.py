from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class Equipamento(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    setor = Column(String, nullable=False)
    consumo_nominal = Column(Float, default=0.0)
    temperatura = Column(Float, default=0.0)
    vibracao = Column(Float, default=0.0)
    status_operacional = Column(String, default="Operacional")