import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Settings, TrendingUp, Download, Search } from 'lucide-react';
import { TransactionCard } from './components/TransactionCard';
import { StatsView } from './components/StatsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AppSetupWizard } from './components/AppSetupWizard';
import { MOCK_TRANSACTIONS, BANK_APPS } from './constants';
import { Transaction } from './types';

// Simple CSV Export function
const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['Fecha', 'Entidad', 'Tipo', 'Contacto/Desc', 'Monto', 'Moneda', 'Estado'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleString(),
    t.entity,
    t.isExpense ? 'Egreso' : 'Ingreso',
    `"${t.description || t.senderOrReceiver}"`,
    t.amount.toFixed(2),
    t.currency,
    t.status
  ]);
  
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `finanzas_peru_export_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const App: React.FC = () => {
  // Persistence state for setup
  const [setupComplete, setSetupComplete] = useState<boolean>(() => {
    return localStorage.getItem('setupComplete') === 'true';
  });
  const [myApps, setMyApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('myApps');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings'>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const handleSetupComplete = (selectedApps: string[]) => {
    setMyApps(selectedApps);
    setSetupComplete(true);
    localStorage.setItem('myApps', JSON.stringify(selectedApps));
    localStorage.setItem('setupComplete', 'true');
  };

  const handleSaveTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const filteredTransactions = transactions.filter(t => 
    t.senderOrReceiver.toLowerCase().includes(filterSearch.toLowerCase()) ||
    t.entity.toLowerCase().includes(filterSearch.toLowerCase())
  );

  // Calculate totals
  const totalIncome = transactions.filter(t => !t.isExpense).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.isExpense).reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Render Wizard if not set up
  if (!setupComplete) {
    return <AppSetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto bg-gray-50 shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 pb-12 rounded-b-[2rem] shadow-lg relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-sm font-medium opacity-80">Saldo Total</h1>
            <p className="text-3xl font-bold mt-1">S/ {balance.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => exportToCSV(transactions)}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" 
            title="Exportar a Excel/Sheets"
          >
            <Download size={20} />
          </button>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs">Ingresos</span>
            </div>
            <p className="font-semibold">S/ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-xs">Gastos</span>
            </div>
            <p className="font-semibold">S/ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 -mt-6 relative z-20">
        
        {/* Search Bar (Visible on Home) */}
        {activeTab === 'home' && (
          <div className="bg-white p-2 rounded-xl shadow-sm mb-4 flex items-center gap-2 border border-gray-100">
            <Search className="text-gray-400 ml-2" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, yape, banco..." 
              className="flex-1 p-1 outline-none text-sm text-gray-700"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'home' ? (
          <div className="space-y-1 pb-4">
            {filteredTransactions.length > 0 ? (
               filteredTransactions.map(t => (
                 <TransactionCard key={t.id} transaction={t} />
               ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No hay transacciones</p>
              </div>
            )}
          </div>
        ) : activeTab === 'stats' ? (
          <StatsView transactions={transactions} />
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg">Configuración</h2>
            
            <div className="space-y-2">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Apps Conectadas</h3>
               <div className="flex flex-wrap gap-2">
                 {myApps.map(appId => {
                    const app = BANK_APPS.find(a => a.id === appId);
                    if(!app) return null;
                    return (
                      <span key={appId} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{background: app.color}}></span>
                        {app.name}
                      </span>
                    )
                 })}
                 <button onClick={() => setSetupComplete(false)} className="px-2 py-1 text-purple-600 text-xs font-medium hover:bg-purple-50 rounded-md">
                   Gestionar
                 </button>
               </div>
            </div>

            <div className="h-px bg-gray-100 my-4"></div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Sincronizar Google Sheets</span>
              <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
               <span className="text-sm font-medium">Modo Oscuro</span>
               <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
               </div>
            </div>
            
            <p className="text-xs text-center text-gray-400 mt-8">Versión 1.1.0 • Hecho para Perú 🇵🇪</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-purple-600 rounded-full shadow-xl shadow-purple-600/30 flex items-center justify-center text-white hover:scale-105 transition-transform z-30"
      >
        <Plus size={28} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-40 max-w-lg mx-auto">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutDashboard size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Inicio</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <TrendingUp size={24} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Reportes</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-purple-700' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Ajustes</span>
        </button>
      </nav>

      {/* Modals */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTransaction} 
      />
    </div>
  );
};

export default App;