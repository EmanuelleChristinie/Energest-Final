from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Equipamento(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    setor = Column(String)
    consumo_nominal = Column(Float)
    status = Column(String, default="Operacional")