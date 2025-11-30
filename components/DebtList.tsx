import React from 'react';
import { Debt, DebtStatus } from '../types';
import { CheckIcon, TrashIcon } from './Icons';

interface DebtListProps {
  debts: Debt[];
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DebtList: React.FC<DebtListProps> = ({ debts, onMarkPaid, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (debts.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-2xl border border-gray-700 opacity-80">
        <p className="text-muted text-lg">Nenhuma dívida registrada.</p>
        <p className="text-sm text-gray-500 mt-2">Você está livre de cobranças!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <div
          key={debt.id}
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
            debt.status === DebtStatus.PAID
              ? 'bg-surface/50 border-gray-800 opacity-60'
              : 'bg-surface border-gray-700 hover:border-gray-600 shadow-md'
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
               <h3 className={`font-bold text-lg truncate ${debt.status === DebtStatus.PAID ? 'line-through text-muted' : 'text-white'}`}>
                  {debt.personName}
               </h3>
               {debt.category && (
                   <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                       {debt.category}
                   </span>
               )}
            </div>

            <p className="text-sm text-muted truncate">{debt.description}</p>
            {debt.dueDate && debt.status !== DebtStatus.PAID && (
              <p className="text-xs text-secondary mt-1">
                Vence: {formatDate(debt.dueDate)}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 ml-4">
            <span className={`font-mono font-bold text-lg ${debt.status === DebtStatus.PAID ? 'text-muted' : 'text-primary'}`}>
              {formatCurrency(debt.amount)}
            </span>
            <div className="flex gap-2 mt-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {debt.status === DebtStatus.PENDING && (
                <button
                  onClick={() => onMarkPaid(debt.id)}
                  title="Marcar como pago"
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onDelete(debt.id)}
                title="Excluir"
                className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};