
import React from 'react';
import { Table, Order, InventoryItem, TableStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  tables: Table[];
  orders: Order[];
  inventory: InventoryItem[];
  onTableClick: (table: Table) => void;
  currency?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tables, orders, inventory, onTableClick, currency = '€' }) => {
  const stats = [
    { label: 'Chiffre d\'Affaires', value: `${orders.filter(o => o.status === 'PAID').reduce((s, o) => s + o.total, 0).toFixed(2)} ${currency}`, icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Tables Occupées', value: tables.filter(t => t.status === TableStatus.OCCUPIED).length, icon: '🏠', color: 'bg-blue-100 text-blue-700' },
    { label: 'Alertes Stock', value: inventory.filter(i => i.stock < i.minStock).length, icon: '⚠️', color: 'bg-amber-100 text-amber-700' },
    { label: 'Commandes en cours', value: orders.filter(o => o.status === 'OPEN').length, icon: '🥘', color: 'bg-indigo-100 text-indigo-700' },
  ];

  const salesData = [
    { name: '10:00', sales: 120 },
    { name: '12:00', sales: 450 },
    { name: '14:00', sales: 300 },
    { name: '16:00', sales: 150 },
    { name: '18:00', sales: 600 },
    { name: '20:00', sales: 850 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`p-3 rounded-xl text-2xl ${stat.color}`}>{stat.icon}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aujourd'hui</span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            📈 Performance des ventes
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Plan de salle rapide</h3>
          <div className="grid grid-cols-2 gap-4">
            {tables.map(table => (
              <button
                key={table.id}
                onClick={() => onTableClick(table)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${
                  table.status === TableStatus.AVAILABLE ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' :
                  table.status === TableStatus.OCCUPIED ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' :
                  table.status === TableStatus.DIRTY ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' :
                  'bg-slate-50 border-slate-300 text-slate-500'
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider">T-{table.number}</span>
                <span className="text-xl">🪑</span>
                <span className="text-[10px] font-medium truncate w-full text-center">{table.status}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-6">Alertes Stock Critiques</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="pb-4">Article</th>
                <th className="pb-4 text-center">Stock Actuel</th>
                <th className="pb-4 text-center">Seuil Min</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.filter(i => i.stock < i.minStock).map(item => (
                <tr key={item.id} className="text-sm">
                  <td className="py-4 font-medium text-slate-700">{item.name}</td>
                  <td className="py-4 text-center font-bold text-red-500">{item.stock} {item.unit}</td>
                  <td className="py-4 text-center text-slate-400">{item.minStock} {item.unit}</td>
                  <td className="py-4 text-right">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wide">Commander</span>
                  </td>
                </tr>
              ))}
              {inventory.filter(i => i.stock < i.minStock).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic">Tout est en ordre pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
