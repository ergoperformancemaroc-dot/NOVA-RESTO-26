
import React, { useState } from 'react';
import { Table, MenuItem, OrderItem } from '../../types';

interface OrderPanelProps {
  table: Table;
  menuItems: MenuItem[];
  onSubmitOrder: (items: OrderItem[]) => void;
  onBack: () => void;
  currency?: string;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ table, menuItems, onSubmitOrder, onBack, currency = '€' }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  const filteredItems = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.id);
      if (existing) {
        return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: `oi-${Date.now()}`, 
        menuItemId: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        status: 'PENDING' 
      }];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(prev => prev.filter(i => i.menuItemId !== menuItemId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in slide-in-from-right-4 duration-500">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">←</button>
          <h2 className="text-2xl font-bold">Commande Table {table.number}</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pr-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group"
            >
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-xl mb-4 group-hover:brightness-110" />
              <h4 className="font-bold text-slate-800 leading-tight mb-1">{item.name}</h4>
              <p className="text-blue-600 font-bold">{item.price.toFixed(2)} {currency}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden h-full">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-bold flex items-center justify-between">
            Ticket
            <span className="text-xs bg-slate-200 px-2 py-1 rounded uppercase tracking-widest text-slate-600">Draft</span>
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <span className="text-4xl mb-2">🛒</span>
              <p>Le panier est vide</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.price.toFixed(2)} {currency} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600">{(item.price * item.quantity).toFixed(2)} {currency}</span>
                  <button onClick={() => removeFromCart(item.menuItemId)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Sous-total</span>
            <span>{(total * 0.8).toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between text-slate-400 text-sm">
            <span>TVA (20%)</span>
            <span>{(total * 0.2).toFixed(2)} {currency}</span>
          </div>
          <div className="flex justify-between text-2xl font-black border-t border-slate-100 pt-4">
            <span>TOTAL</span>
            <span className="text-blue-600">{total.toFixed(2)} {currency}</span>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => onSubmitOrder(cart)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            ENVOYER EN CUISINE
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPanel;
