
import React from 'react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  userRole: UserRole;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, userRole, onLogout }) => {
  const allMenuItems = [
    { view: AppView.DASHBOARD, label: 'Tableau de bord', icon: '📊', roles: [UserRole.ADMIN, UserRole.GERANT, UserRole.CUISINIER, UserRole.SERVEUR] },
    { view: AppView.POS, label: 'Service (POS)', icon: '🍽️', roles: [UserRole.ADMIN, UserRole.GERANT, UserRole.SERVEUR] },
    { view: AppView.KITCHEN, label: 'Cuisine (KDS)', icon: '🍳', roles: [UserRole.ADMIN, UserRole.GERANT, UserRole.CUISINIER] },
    { view: AppView.INVENTORY, label: 'Stocks', icon: '📦', roles: [UserRole.ADMIN, UserRole.GERANT, UserRole.CUISINIER] },
    { view: AppView.AI_ASSISTANT, label: 'Nova AI Assistant', icon: '✨', roles: [UserRole.ADMIN, UserRole.GERANT] },
    { view: AppView.SETTINGS, label: 'Réglages', icon: '⚙️', roles: [UserRole.ADMIN] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-20 md:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">N</div>
        <span className="hidden md:block font-bold text-xl tracking-tight italic">NovaResto</span>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.view 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:block font-medium truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
        >
          <span className="text-xl">🚪</span>
          <span className="hidden md:block font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
