
import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { getSmartStockPrediction } from '../../services/geminiService';

interface InventoryProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManager: React.FC<InventoryProps> = ({ inventory, setInventory }) => {
  const [prediction, setPrediction] = useState<{ summary: string; alerts: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    const result = await getSmartStockPrediction(inventory);
    setPrediction(result);
    setLoading(false);
  };

  const updateStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + amount) } : i));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Stocks</h2>
          <p className="text-slate-500">Inventaire en temps réel et prévisions AI</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Calcul...' : '✨ Prédictions Smart AI'}
        </button>
      </div>

      {prediction && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm animate-in zoom-in-95">
          <h3 className="text-indigo-900 font-bold mb-3 flex items-center gap-2">
            🤖 Analyse Prédictive Nova AI
          </h3>
          <p className="text-indigo-700 text-sm mb-4 leading-relaxed">{prediction.summary}</p>
          <div className="flex flex-wrap gap-2">
            {prediction.alerts.map((alert, idx) => (
              <span key={idx} className="bg-white/80 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold text-indigo-600">
                ⚠️ {alert}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Article</th>
              <th className="px-6 py-4">Stock Actuel</th>
              <th className="px-6 py-4">Seuil Min</th>
              <th className="px-6 py-4">Actions</th>
              <th className="px-6 py-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">Dernière commande : {item.lastOrdered}</p>
                </td>
                <td className="px-6 py-5 font-black text-slate-700">
                  {item.stock} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                </td>
                <td className="px-6 py-5 text-slate-500 font-medium">{item.minStock} {item.unit}</td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button onClick={() => updateStock(item.id, -1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600">-</button>
                    <button onClick={() => updateStock(item.id, 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600">+</button>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  {item.stock < item.minStock ? (
                    <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Critique</span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;
