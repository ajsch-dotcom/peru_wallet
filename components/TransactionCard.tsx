import React from 'react';
import { Transaction, Currency } from '../types';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone } from 'lucide-react';

interface Props {
  transaction: Transaction;
}

export const TransactionCard: React.FC<Props> = ({ transaction }) => {
  const isIncome = !transaction.isExpense;
  
  const getIcon = () => {
    if (transaction.entity.toLowerCase().includes('yape') || transaction.entity.toLowerCase().includes('plin')) {
      return <Smartphone className="w-5 h-5 text-white" />;
    }
    return <CreditCard className="w-5 h-5 text-white" />;
  };

  const getBgColor = () => {
    const ent = transaction.entity.toLowerCase();
    if (ent.includes('yape')) return 'bg-purple-600';
    if (ent.includes('plin')) return 'bg-sky-500';
    if (ent.includes('bcp')) return 'bg-blue-800';
    if (ent.includes('interbank')) return 'bg-green-600';
    return 'bg-gray-600';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBgColor()}`}>
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 line-clamp-1">{transaction.senderOrReceiver}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {new Date(transaction.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            <span>•</span>
            <span className="capitalize">{transaction.entity}</span>
          </p>
          {transaction.operationCode && (
            <p className="text-[10px] text-gray-400">Op: {transaction.operationCode}</p>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className={`font-bold text-lg flex items-center justify-end gap-1 ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
          {transaction.currency} {transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 capitalize">{transaction.type}</p>
      </div>
    </div>
  );
};