
import React from 'react';
import { Table, TableStatus } from '../../types';

interface TableMapProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

const TableMap: React.FC<TableMapProps> = ({ tables, onTableClick }) => {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Plan de Salle</h2>
          <p className="text-slate-500">Sélectionnez une table pour commencer une commande</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-600">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-600">Occupé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-600">Sale</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-3xl border-4 border-dashed border-slate-100 min-h-[500px] flex flex-wrap gap-8 justify-center items-center">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => onTableClick(table)}
            className={`relative group flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              table.capacity > 4 ? 'w-48 h-32' : 'w-32 h-32'
            }`}
          >
            <div className={`absolute inset-0 rounded-2xl shadow-sm border-2 transition-colors ${
              table.status === TableStatus.AVAILABLE ? 'bg-white border-green-500 shadow-green-100' :
              table.status === TableStatus.OCCUPIED ? 'bg-blue-50 border-blue-500 shadow-blue-100' :
              table.status === TableStatus.DIRTY ? 'bg-amber-50 border-amber-500 shadow-amber-100' :
              'bg-slate-50 border-slate-300'
            }`}></div>
            
            <div className="relative z-10 text-center">
              <span className={`text-xl font-black mb-1 block ${
                table.status === TableStatus.AVAILABLE ? 'text-green-600' :
                table.status === TableStatus.OCCUPIED ? 'text-blue-600' :
                table.status === TableStatus.DIRTY ? 'text-amber-600' :
                'text-slate-400'
              }`}>
                {table.number}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {table.capacity} Personnes
              </span>
            </div>
            
            <div className="absolute -top-2 -right-2 flex gap-1">
              {[...Array(table.capacity)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${table.status === TableStatus.OCCUPIED ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableMap;
