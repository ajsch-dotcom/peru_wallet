import React, { useState } from 'react';
import { X, Sparkles, Loader2, Save } from 'lucide-react';
import { parseNotificationText } from '../services/geminiService';
import { Transaction, TransactionType, Currency, TransactionStatus } from '../types';
import { ENTITIES } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (t: Transaction) => void;
}

export const AddTransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'smart'>('smart');
  const [smartText, setSmartText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Manual form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [entity, setEntity] = useState(ENTITIES[0]);
  const [type, setType] = useState(TransactionType.YAPE);
  const [isExpense, setIsExpense] = useState(true);

  if (!isOpen) return null;

  const handleSmartParse = async () => {
    if (!smartText.trim()) return;
    setIsAnalyzing(true);
    
    // Get active apps from storage to help the parser
    const saved = localStorage.getItem('myApps');
    const myApps = saved ? JSON.parse(saved) : [];

    const result = await parseNotificationText(smartText, myApps);
    setIsAnalyzing(false);

    if (result) {
      // Pre-fill manual form with result and switch to manual for review
      setAmount(result.amount?.toString() || '');
      setDescription(result.description || result.senderOrReceiver || '');
      setEntity(result.entity || ENTITIES[0]);
      setType((result.type as TransactionType) || TransactionType.UNKNOWN);
      setIsExpense(result.isExpense ?? true);
      setActiveTab('manual');
    } else {
      alert('No se pudo detectar información. Intenta ingresarlo manualmente.');
    }
  };

  const handleSave = () => {
    if (!amount) return;
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency: Currency.PEN, // Default to PEN for simplicity
      type,
      entity,
      senderOrReceiver: description,
      description,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      status: TransactionStatus.SUCCESS,
      isExpense
    };
    
    onSave(newTransaction);
    onClose();
    // Reset
    setSmartText('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Nueva Transacción</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'smart' ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('smart')}
          >
            <Sparkles size={16} className="inline mr-2" />
            Detector Inteligente
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'manual' ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'smart' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Pega el texto del SMS o notificación de Yape, Plin o tu banco. La IA reconocerá la app origen automáticamente.
              </p>
              <textarea 
                className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                placeholder='Ej: "Yapeaste S/ 15.00 a Juan Perez - 12 Ene 2025..."'
                value={smartText}
                onChange={(e) => setSmartText(e.target.value)}
              />
              <button 
                onClick={handleSmartParse}
                disabled={isAnalyzing || !smartText}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isAnalyzing ? 'Analizando...' : 'Procesar Texto'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Monto (S/)</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo</label>
                   <select 
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      value={isExpense ? 'expense' : 'income'}
                      onChange={(e) => setIsExpense(e.target.value === 'expense')}
                   >
                     <option value="expense">Gasto (-)</option>
                     <option value="income">Ingreso (+)</option>
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Entidad</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  value={entity}
                  onChange={(e) => setEntity(e.target.value)}
                >
                  {ENTITIES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción / Contacto</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-200 rounded-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Almuerzo, Juan Perez..."
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 mt-2"
              >
                <Save size={18} />
                Guardar Transacción
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};