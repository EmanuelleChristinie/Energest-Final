import pandas as pd
import numpy as np
import joblib
import os

class EnergyAnalyzer:
    def __init__(self, model_path, csv_path):
        self.model_path = model_path
        self.csv_path = csv_path
        self.df = None
        self.model = None
        self.results = {}

    def load_data(self):
        self.model = joblib.load(self.model_path)
        self.df = pd.read_csv(self.csv_path)
        if 'timestamp' not in self.df.columns:
            self.df['timestamp'] = pd.date_range(start='2024-01-01', periods=len(self.df), freq='h')
        else:
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
        return self.df

    def perform_analysis(self):
        features = ["temperature", "load_percentage", "operating_hours", "maintenance_status", "machine_age_years"]
        
        # Predições e Cálculos
        self.df["consumo_estimado"] = self.model.predict(self.df[features])
        media_consumo = self.df["consumo_estimado"].mean()
        
        # Cálculo de Custos (Baseado no seu Visualizer)
        custo_base = float(self.df[self.df["consumo_estimado"] <= media_consumo]["consumo_estimado"].sum() * 0.85)
        custo_sobretaxa = float(self.df[self.df["consumo_estimado"] > media_consumo]["consumo_estimado"].sum() * 0.95)

        # Formatação para o gráfico do Frontend (Recharts)
        dados_grafico = self.df.tail(20).apply(lambda x: {
            "name": x['timestamp'].strftime('%d/%m'),
            "consumo": round(float(x['consumo_estimado']), 2)
        }, axis=1).tolist()

        # Estrutura completa exigida pelo EnergyVisualizer e Frontend
        self.results = {
            "periodo": f"{self.df['timestamp'].min().strftime('%d/%m/%Y')} - {self.df['timestamp'].max().strftime('%d/%m/%Y')}",
            "kpis": {
                "consumo_total_kwh": round(float(self.df["consumo_estimado"].sum()), 2),
                "custo_total_brl": round(custo_base + custo_sobretaxa, 2),
                "media_diaria_kwh": round(float(self.df["consumo_estimado"].mean() * 24), 2),
                "eficiencia_media": round(float(self.df["consumo_estimado"].mean() / 100), 3)
            },
            "alertas": {
                "manutencao_critica": int(self.df["maintenance_status"].eq(0).sum()),
                "anomalias_detectadas": int(self.df["load_percentage"].gt(90).sum()),
                "maquina_maior_risco": "Equipamento Industrial 012"
            },
            "distribuicao_custo": {
                "base": round(custo_base, 2),
                "sobretaxa": round(custo_sobretaxa, 2)
            },
            "dados_grafico": dados_grafico
        }
        return self.results

    def get_df(self):
        """ESSENCIAL: Resolve o erro 'object has no attribute get_df'"""
        return self.df