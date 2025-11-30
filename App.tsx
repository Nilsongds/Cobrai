import React, { useState, useEffect } from 'react';
import { Debt, DebtStatus } from './types';
import { SmartInput } from './components/SmartInput';
import { DebtList } from './components/DebtList';
import { Stats } from './components/Stats';
import { ListIcon, ChartIcon } from './components/Icons';

function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('cobraai_debts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cobraai_debts', JSON.stringify(debts));
  }, [debts]);

  const addDebt = (debt: Debt) => {
    setDebts((prev) => [debt, ...prev]);
  };

  const markAsPaid = (id: string) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: DebtStatus.PAID } : d))
    );
  };

  const deleteDebt = (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar este registro?")) {
        setDebts((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 py-8 pb-24">
        
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Cobra<span className="text-primary">Aí</span>
                </h1>
                <p className="text-muted text-sm">Controle de dívidas inteligente</p>
            </div>
            <div className="hidden sm:block">
                 <span className="text-xs bg-gray-800 px-3 py-1 rounded-full text-gray-400 border border-gray-700">v1.0.0</span>
            </div>
        </header>

        <main>
          {activeTab === 'list' && (
            <>
              <SmartInput onAddDebt={addDebt} />
              
              <div className="flex items-center justify-between mb-4 mt-8">
                <h2 className="text-xl font-bold text-white">Últimos Registros</h2>
                <span className="text-xs text-muted font-mono bg-surface px-2 py-1 rounded-md border border-gray-700">
                    {debts.length} itens
                </span>
              </div>
              
              <DebtList 
                debts={debts} 
                onMarkPaid={markAsPaid} 
                onDelete={deleteDebt} 
              />
            </>
          )}

          {activeTab === 'stats' && (
            <>
               <h2 className="text-xl font-bold text-white mb-6">Panorama Financeiro</h2>
               <Stats debts={debts} />
               <div className="mt-8">
                   <h3 className="text-lg font-semibold mb-4 text-white">Histórico Completo</h3>
                   <DebtList 
                    debts={debts} 
                    onMarkPaid={markAsPaid} 
                    onDelete={deleteDebt} 
                  />
               </div>
            </>
          )}
        </main>
      </div>

      {/* Mobile/Sticky Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-gray-700 rounded-full px-6 py-3 shadow-2xl flex gap-8 z-50">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'list' ? 'text-primary' : 'text-muted hover:text-white'
          }`}
        >
          <ListIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Lista</span>
        </button>
        <div className="w-px bg-gray-700 h-8"></div>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'stats' ? 'text-primary' : 'text-muted hover:text-white'
          }`}
        >
          <ChartIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Dados</span>
        </button>
      </nav>
    </div>
  );
}

export default App;