import React, { useMemo, useEffect, useState } from 'react';
import { Debt, DebtStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';

interface StatsProps {
  debts: Debt[];
}

const COLORS = ['#10b981', '#3b82f6', '#94a3b8']; // Emerald, Blue, Gray

export const Stats: React.FC<StatsProps> = ({ debts }) => {
  const [advice, setAdvice] = useState<string>('');

  const stats = useMemo(() => {
    const total = debts.reduce((acc, curr) => acc + curr.amount, 0);
    const received = debts
      .filter(d => d.status === DebtStatus.PAID)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const pending = total - received;

    return { total, received, pending };
  }, [debts]);

  const data = useMemo(() => [
    { name: 'Recebido', value: stats.received },
    { name: 'Pendente', value: stats.pending },
  ], [stats]);

  useEffect(() => {
    // Generate simple advice based on data, debounced or just on mount/significant change
    if (debts.length > 0) {
        const summary = `Total owed: ${stats.total}, pending: ${stats.pending}. Count: ${debts.length}`;
        getFinancialAdvice(summary).then(setAdvice);
    }
  }, [debts.length, stats.pending]); // Only re-run if count or pending amount changes dramatically

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (debts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Cards */}
      <div className="space-y-4">
        <div className="bg-surface p-5 rounded-2xl border border-gray-700 flex justify-between items-center">
            <div>
                <p className="text-muted text-sm uppercase tracking-wide">A Receber</p>
                <p className="text-3xl font-bold text-white mt-1">{formatCurrency(stats.pending)}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-gray-700 flex justify-between items-center">
             <div>
                <p className="text-muted text-sm uppercase tracking-wide">Recebido</p>
                <p className="text-3xl font-bold text-emerald-500 mt-1">{formatCurrency(stats.received)}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
            </div>
        </div>
        
        {advice && (
           <div className="bg-gradient-to-r from-surface to-slate-800 p-4 rounded-xl border border-gray-700 text-sm italic text-gray-300">
             " {advice} "
           </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-surface p-4 rounded-2xl border border-gray-700 flex flex-col items-center justify-center min-h-[250px]">
         <h3 className="text-white font-medium mb-4 self-start">Distribuição</h3>
         <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
};