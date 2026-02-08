
import React from 'react';
import { AppView, UserRole } from '../types';

interface HeaderProps {
  onNavigate?: (view: AppView) => void;
  userRole?: UserRole;
  userName?: string;
  onLogout?: () => void;
  isCloudMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, userRole, userName, onLogout, isCloudMode = false }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">NovaResto <span className="text-slate-400 font-medium hidden sm:inline">| Management</span></h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className={`hidden sm:flex items-center px-4 py-2 rounded-full border ${
          isCloudMode ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${isCloudMode ? 'bg-blue-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isCloudMode ? 'Cloud SaaS Active' : 'Mode Local'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
           <div className="text-right hidden md:block">
            <p className="text-sm font-black text-slate-800 leading-none">{userName}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">{userRole}</p>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <span className="text-lg">🚪</span>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
