import React, { useState } from 'react';
import { parseDebtFromText } from '../services/geminiService';
import { Debt, DebtStatus } from '../types';
import { SparklesIcon, PlusIcon } from './Icons';
import { v4 as uuidv4 } from 'uuid';

interface SmartInputProps {
  onAddDebt: (debt: Debt) => void;
}

export const SmartInput: React.FC<SmartInputProps> = ({ onAddDebt }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSmartAdd = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    const analysis = await parseDebtFromText(text);

    if (analysis && analysis.confidenceScore > 0.5) {
      const newDebt: Debt = {
        id: uuidv4(),
        personName: analysis.personName,
        amount: analysis.amount,
        description: analysis.description,
        date: new Date().toISOString(),
        dueDate: analysis.dueDate,
        status: DebtStatus.PENDING,
        category: analysis.category
      };
      onAddDebt(newDebt);
      setText('');
    } else {
      setError("Não consegui entender. Tente: 'Nome' me deve 'Valor' por 'Motivo'.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSmartAdd();
    }
  };

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-xl border border-gray-700 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-yellow-400" />
        <h2 className="text-lg font-semibold text-white">Adição Rápida com IA</h2>
      </div>
      <p className="text-sm text-muted mb-4">
        Digite como se estivesse falando com um amigo. <br/>
        Ex: <span className="italic text-primary">"Carlos me deve 50 do almoço de ontem"</span>
      </p>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva a dívida aqui..."
          disabled={loading}
          className="w-full bg-background text-text rounded-xl p-4 pr-12 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24"
        />
        <button
          onClick={handleSmartAdd}
          disabled={loading || !text.trim()}
          className="absolute right-3 bottom-3 p-2 bg-primary hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <PlusIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
};