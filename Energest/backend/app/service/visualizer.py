import matplotlib.pyplot as plt
import seaborn as sns
from fpdf import FPDF
import os

class EnergyVisualizer:
    def __init__(self, df, results, output_dir):
        self.df = df
        self.results = results
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        sns.set_theme(style="whitegrid")

    def create_charts(self):
        """Gera gráficos para o dashboard."""
        # 1. Gráfico de Linha: Tendência de Consumo
        plt.figure(figsize=(10, 4))
        plt.plot(self.df['timestamp'], self.df['consumo_estimado'], color='#2ecc71', linewidth=2)
        plt.title('Tendência de Consumo Energético (kWh)', fontsize=14, pad=15)
        plt.xlabel('Data/Hora')
        plt.ylabel('Consumo (kWh)')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'trend.png'))
        plt.close()

        # 2. Gráfico de Barras: Consumo vs Temperatura
        plt.figure(figsize=(8, 5))
        sns.scatterplot(data=self.df, x='temperature', y='consumo_estimado', hue='maintenance_status', palette='viridis')
        plt.title('Correlação: Temperatura vs Consumo', fontsize=14)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, 'corr.png'))
        plt.close()

        # 3. Pizza: Distribuição de Custo
        plt.figure(figsize=(6, 6))
        labels = ['Tarifa Base', 'Sobretaxa de Pico']
        sizes = [self.results['distribuicao_custo']['base'], self.results['distribuicao_custo']['sobretaxa']]
        plt.pie(sizes, labels=labels, autopct='%1.1f%%', colors=['#3498db', '#e74c3c'], startangle=140)
        plt.title('Composição dos Custos Mensais')
        plt.savefig(os.path.join(self.output_dir, 'costs.png'))
        plt.close()

    def generate_pdf(self, filename):
        """Gera o relatório PDF profissional."""
        pdf = FPDF()
        pdf.add_page()
        
        # Cabeçalho
        pdf.set_fill_color(44, 62, 80)
        pdf.rect(0, 0, 210, 40, 'F')
        pdf.set_font('Arial', 'B', 20)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 20, 'RELATÓRIO DE EFICIÊNCIA ENERGÉTICA', ln=True, align='C')
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 10, f"Período: {self.results['periodo']}", ln=True, align='C')
        
        pdf.ln(20)
        pdf.set_text_color(0, 0, 0)
        
        # Dashboard de KPIs
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, '1. Indicadores Chave de Desempenho (KPIs)', ln=True)
        pdf.set_font('Arial', '', 11)
        
        kpis = self.results['kpis']
        pdf.cell(95, 10, f"Consumo Total: {kpis['consumo_total_kwh']} kWh", border=1)
        pdf.cell(95, 10, f"Custo Estimado: R$ {kpis['custo_total_brl']}", border=1, ln=True)
        pdf.cell(95, 10, f"Média Diária: {kpis['media_diaria_kwh']} kWh", border=1)
        pdf.cell(95, 10, f"Eficiência Média: {kpis['eficiencia_media']} kWh/h", border=1, ln=True)
        
        pdf.ln(10)
        
        # Alertas
        pdf.set_font('Arial', 'B', 14)
        pdf.set_text_color(192, 57, 43)
        pdf.cell(0, 10, '2. Alertas e Manutenção', ln=True)
        pdf.set_font('Arial', '', 11)
        pdf.set_text_color(0, 0, 0)
        alertas = self.results['alertas']
        pdf.multi_cell(0, 10, f"- Máquinas necessitando manutenção: {alertas['manutencao_critica']}\n"
                             f"- Anomalias de consumo detectadas: {alertas['anomalias_detectadas']}\n"
                             f"- Equipamento com maior risco operacional: {alertas['maquina_maior_risco']}")
        
        # Inserir Gráficos
        pdf.add_page()
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, '3. Análise Visual e Tendências', ln=True)
        
        pdf.image(os.path.join(self.output_dir, 'trend.png'), x=10, y=30, w=190)
        pdf.image(os.path.join(self.output_dir, 'corr.png'), x=10, y=120, w=90)
        pdf.image(os.path.join(self.output_dir, 'costs.png'), x=110, y=120, w=90)
        
        # Conclusão
        pdf.set_y(220)
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Conclusão Técnica:', ln=True)
        pdf.set_font('Arial', '', 10)
        conclusao = (f"O sistema operou com uma eficiência média de {kpis['eficiencia_media']} kWh por hora de operação. "
                    f"Foram identificadas {alertas['anomalias_detectadas']} ocorrências fora do padrão estatístico, "
                    "sugerindo a necessidade de inspeção imediata nos circuitos do Equipamento 012.")
        pdf.multi_cell(0, 8, conclusao)
        
        pdf.output(filename)
        return filename