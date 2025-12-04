import React, { useState, useEffect } from 'react';
import { Smartphone, Check, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { BANK_APPS } from '../constants';

interface Props {
  onComplete: (selectedIds: string[]) => void;
}

export const AppSetupWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<'scan' | 'select' | 'finish'>('scan');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Simulate scanning effect
  useEffect(() => {
    if (step === 'scan') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Default to selecting all "popular" ones
            setSelectedApps(BANK_APPS.map(app => app.id));
            setStep('select');
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  const toggleApp = (id: string) => {
    if (selectedApps.includes(id)) {
      setSelectedApps(selectedApps.filter(a => a !== id));
    } else {
      setSelectedApps([...selectedApps, id]);
    }
  };

  if (step === 'scan') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-purple-900 z-50 flex flex-col items-center justify-center p-8 text-white">
        <div className="w-24 h-24 mb-8 relative">
           <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full animate-ping"></div>
           <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
           <Smartphone className="absolute inset-0 m-auto w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Escaneando dispositivo...</h2>
        <p className="text-white/60 mb-8 text-center">Buscando billeteras digitales y apps bancarias instaladas</p>
        
        <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-purple-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-purple-200">{progress}% completado</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-6 pt-12 bg-gray-50 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Apps Detectadas</h1>
        <p className="text-gray-500 mt-2">
          Hemos encontrado estas aplicaciones financieras compatibles. Selecciona las que deseas monitorear.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {BANK_APPS.map(app => (
            <div 
              key={app.id}
              onClick={() => toggleApp(app.id)}
              className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedApps.includes(app.id) 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                style={{ backgroundColor: app.color }}
              >
                {app.name.substring(0, 1)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-900">{app.name}</h3>
                <p className="text-xs text-gray-500">
                  {selectedApps.includes(app.id) ? 'Reconocimiento activo' : 'Ignorar notificaciones'}
                </p>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selectedApps.includes(app.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}>
                {selectedApps.includes(app.id) && <Check size={14} className="text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button 
          onClick={() => onComplete(selectedApps)}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
        >
          Confirmar y Continuar
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};