// src/components/ui/ConsumoCustoChart.jsx
import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { chartData } from '../../services/mockData';

const ConsumoCustoChart = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '350px' }}>
      <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          {/* Grelha de fundo discreta */}
          <CartesianGrid strokeDasharray="3 3" stroke="#354656" vertical={false} />
          
          {/* Eixo X (Horas) */}
          <XAxis dataKey="hora" stroke="#e0e0e0" tick={{ fill: '#e0e0e0' }} />
          
          {/* Eixo Y Esquerdo (Consumo - Azul Ciano) */}
          <YAxis yAxisId="left" stroke="#afffff" tick={{ fill: '#afffff' }} />
          
          {/* Eixo Y Direito (Custo - Vermelho Alerta) */}
          <YAxis yAxisId="right" orientation="right" stroke="#FF3D3D" tick={{ fill: '#FF3D3D' }} />
          
          {/* Tooltip ao passar o rato */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1d2e3d', borderColor: '#354656', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Linha de Consumo */}
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="consumo_kwh" 
            name="Consumo (kWh)"
            stroke="#afffff" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#0D1F2D', stroke: '#afffff', strokeWidth: 2 }} 
            activeDot={{ r: 6, fill: '#afffff' }} 
          />
          
          {/* Linha de Custo */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="custo_brl" 
            name="Custo (R$)"
            stroke="#FF3D3D" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#0D1F2D', stroke: '#FF3D3D', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumoCustoChart;