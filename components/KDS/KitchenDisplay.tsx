
import React from 'react';
import { Order, OrderItem } from '../../types';

interface KDSProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const KitchenDisplay: React.FC<KDSProps> = ({ orders, setOrders }) => {
  const activeOrders = orders.filter(o => o.status === 'OPEN');

  const updateItemStatus = (orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          items: o.items.map(i => i.id === itemId ? { ...i, status } : i)
        };
      }
      return o;
    }));
  };

  const getStatusColor = (status: OrderItem['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'COOKING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'READY': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Kitchen Display System</h2>
          <p className="text-slate-500">Flux de production en temps réel</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 shadow-sm">
          {activeOrders.length} Commandes en attente
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-black text-lg tracking-widest uppercase">Table {order.tableId.replace('t', '')}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="flex-1 p-4 space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 leading-tight">
                      <span className="text-blue-600 mr-2">{item.quantity}x</span>
                      {item.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {item.status === 'PENDING' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, item.id, 'COOKING')}
                        className="flex-1 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        PRÉPARER
                      </button>
                    )}
                    {item.status === 'COOKING' && (
                      <button 
                        onClick={() => updateItemStatus(order.id, item.id, 'READY')}
                        className="flex-1 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        PRÊT !
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button className="w-full py-2 border-2 border-slate-200 text-slate-400 font-bold text-xs rounded-xl hover:bg-white hover:text-slate-600 transition-all">
                VOIR TOUT LE TICKET
              </button>
            </div>
          </div>
        ))}
        {activeOrders.length === 0 && (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span className="text-6xl mb-4">💤</span>
            <p className="text-xl font-medium italic">Aucune commande active. Calme plat en cuisine.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
