import React from 'react';
import { Transaction } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface Props {
  transactions: Transaction[];
}

const COLORS_CHART = ['#6b21a8', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export const StatsView: React.FC<Props> = ({ transactions }) => {
  // Process data for charts
  const expensesByEntity = transactions
    .filter(t => t.isExpense)
    .reduce((acc, curr) => {
      acc[curr.entity] = (acc[curr.entity] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByEntity).map(key => ({
    name: key,
    value: expensesByEntity[key]
  }));

  const income = transactions.filter(t => !t.isExpense).reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.isExpense).reduce((sum, t) => sum + t.amount, 0);

  const barData = [
    { name: 'Ingresos', amount: income },
    { name: 'Gastos', amount: expense }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen Mensual</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="amount" fill="#6b21a8" radius={[0, 4, 4, 0]} barSize={40}>
                 {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Gastos por Entidad</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};