// src/components/ui/DistribuicaoConsumoChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { distribuicaoData } from '../../services/mockData';

const DistribuicaoConsumoChart = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={distribuicaoData}
            cx="50%"
            cy="50%"
            innerRadius={80} // O innerRadius cria o efeito de "Rosca/Donut"
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {distribuicaoData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--bg-border)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => [`${value}%`, 'Consumo']}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistribuicaoConsumoChart;