
import React, { useState } from 'react';
import { Table, TableStatus, UserRole, User } from '../../types';
import { persistence, STORAGE_KEYS } from '../../services/persistenceService';

interface SettingsPanelProps {
  tables?: Table[];
  setTables?: React.Dispatch<React.SetStateAction<Table[]>>;
  currency?: string;
  setCurrency?: (currency: string) => void;
  users?: User[];
  setUsers?: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser?: User | null;
  isCloudMode?: boolean;
  setCloudMode?: (enabled: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  tables = [], 
  setTables, 
  currency = '€', 
  setCurrency,
  users = [],
  setUsers,
  currentUser,
  isCloudMode,
  setCloudMode
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const ROLES = Object.values(UserRole);

  const handleSave = () => {
    setSaveStatus('Sauvegarde en cours...');
    setTimeout(() => {
      setSaveStatus('Paramètres enregistrés avec succès !');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  const handleToggleCloud = () => {
    const newVal = !isCloudMode;
    setCloudMode?.(newVal);
    persistence.save(STORAGE_KEYS.CLOUD_CONFIG, { enabled: newVal });
  };

  const addTable = () => {
    if (!setTables) return;
    const nextNum = tables.length > 0 ? Math.max(...tables.map(t => t.number)) + 1 : 1;
    const newTable: Table = {
      id: `t${Date.now()}`,
      number: nextNum,
      capacity: 4,
      status: TableStatus.AVAILABLE
    };
    setTables(prev => [...prev, newTable]);
  };

  const removeTable = (id: string) => {
    if (!setTables) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      setTables(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTable = (id: string, field: keyof Table, value: any) => {
    if (!setTables) return;
    setTables(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!setCurrency) return;
    const value = e.target.value;
    const symbol = value.match(/\((.*?)\)/)?.[1] || '€';
    setCurrency(symbol);
  };

  const addUser = () => {
    if (!setUsers) return;
    const newUser: User = {
      id: `u${Date.now()}`,
      name: 'Nouvel Utilisateur',
      username: `user_${Date.now().toString().slice(-4)}`,
      password: '',
      role: UserRole.SERVEUR,
      email: 'nouveau@novaresto.com',
      active: true
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, field: keyof User, value: any) => {
    if (!setUsers) return;
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const deleteUser = (id: string) => {
    if (!setUsers) return;
    if (confirm('Supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: '⚙️' },
    { id: 'pos', label: 'Point de Vente', icon: '🛒' },
    { id: 'tables', label: 'Plan de Salle', icon: '🪑' },
    { id: 'ai', label: 'Nova AI', icon: '✨' },
    { id: 'team', label: 'Accès & Équipe', icon: '👥' },
    { id: 'cloud', label: 'SaaS & Cloud', icon: '☁️' },
  ];

  const currentCurrencyLabel = currency === '€' ? 'EUR (€)' : 
                               currency === '$' ? 'USD ($)' : 
                               currency === '£' ? 'GBP (£)' : 
                               currency === 'DH' ? 'MAD (DH)' : 'EUR (€)';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Réglages du Système</h2>
          <p className="text-slate-500">Configuration avancée NovaResto (ADMIN ONLY)</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2"
        >
          <span>💾</span> Enregistrer
        </button>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-bold animate-in slide-in-from-top-2 border ${
          saveStatus.includes('succès') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
          {saveStatus}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                🏠 Informations de l'établissement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nom du Restaurant</label>
                  <input type="text" defaultValue="NovaResto Premium" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Devise</label>
                  <select 
                    value={currentCurrencyLabel}
                    onChange={handleCurrencyChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                    <option>MAD (DH)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  🪑 Gestion du Plan de Salle
                </h3>
                <button 
                  onClick={addTable}
                  className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold hover:bg-emerald-100 transition-all flex items-center gap-2"
                >
                  <span>➕</span> Nouvelle Table
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {tables.map(table => (
                  <div key={table.id} className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white border border-slate-100 rounded-2xl group transition-all hover:shadow-lg">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0">
                      {table.number}
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">N° Table</label>
                        <input 
                          type="number" 
                          value={table.number} 
                          onChange={(e) => updateTable(table.id, 'number', parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacité</label>
                        <input 
                          type="number" 
                          value={table.capacity} 
                          onChange={(e) => updateTable(table.id, 'capacity', parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-1 flex flex-col justify-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Actuel</label>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-tight">{table.status}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <button 
                        onClick={() => removeTable(table.id)}
                        className="p-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                        title="Supprimer la table"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  👥 Gestion de l'Équipe & Accès
                </h3>
                <button 
                  onClick={addUser}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
                >
                  <span>👤➕</span> Ajouter un collaborateur
                </button>
              </div>

              <div className="space-y-4">
                {users.map((user) => {
                  const isMe = currentUser?.id === user.id;
                  return (
                    <div key={user.id} className={`p-6 border-2 rounded-2xl transition-all ${isMe ? 'bg-blue-50/50 border-blue-200 ring-2 ring-blue-100 shadow-md' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-1">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-md shrink-0 ${
                              user.role === UserRole.ADMIN ? 'bg-blue-600' :
                              user.role === UserRole.GERANT ? 'bg-purple-600' :
                              user.role === UserRole.CUISINIER ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                Nom Complet {isMe && <span className="text-blue-600 font-black ml-1">(MOI)</span>}
                              </label>
                              <input 
                                type="text" 
                                value={user.name} 
                                onChange={(e) => updateUser(user.id, 'name', e.target.value)}
                                className="font-bold text-slate-800 bg-transparent border-none p-0 outline-none focus:ring-0 w-full"
                              />
                            </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identifiant</label>
                          <input 
                            type="text" 
                            value={user.username} 
                            onChange={(e) => updateUser(user.id, 'username', e.target.value)}
                            className="w-full bg-slate-100/50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mot de passe</label>
                          <input 
                            type="text" 
                            value={user.password || ''} 
                            placeholder="Définir..."
                            onChange={(e) => updateUser(user.id, 'password', e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner"
                          />
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="flex flex-col flex-1 lg:flex-none">
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rôle</label>
                             <select 
                              value={user.role} 
                              disabled={isMe} // On ne change pas son propre rôle par sécurité ici
                              onChange={(e) => updateUser(user.id, 'role', e.target.value as UserRole)}
                              className={`text-xs font-black border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${isMe ? 'bg-slate-100 cursor-not-allowed' : 'bg-white'}`}
                            >
                              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                          </div>
                          {!isMe && (
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors mt-4 lg:mt-0"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  ☁️ Configuration SaaS & Cloud (Supabase)
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase ${isCloudMode ? 'text-blue-600' : 'text-slate-400'}`}>
                    {isCloudMode ? 'Activé' : 'Désactivé'}
                  </span>
                  <button 
                    onClick={handleToggleCloud}
                    className={`w-12 h-6 rounded-full transition-all relative ${isCloudMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isCloudMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className={`space-y-6 transition-opacity ${!isCloudMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supabase URL</label>
                    <input type="text" placeholder="https://xyz.supabase.co" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supabase Anon Key</label>
                    <input type="password" placeholder="eyJh..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2">🚀 Prêt pour le déploiement</h4>
                  <div className="space-y-3 text-xs opacity-80">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✅</span>
                      <p><strong>Vercel / Netlify :</strong> Le fichier <code>vercel.json</code> est prêt. Connectez votre dépôt Git et déployez en un clic.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400">✅</span>
                      <p><strong>Supabase :</strong> Activez le mode cloud pour synchroniser les commandes et les stocks en temps réel sur plusieurs terminaux.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {!isCloudMode && (
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                  <span className="text-4xl block mb-4">🏠</span>
                  <h4 className="font-bold text-slate-800">Mode Local Uniquement</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                    Vos données sont actuellement stockées sur ce navigateur uniquement (localStorage). Activez le Cloud pour une version SaaS multi-utilisateurs.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pos' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                🛒 Configuration Point de Vente
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-700">Taux de TVA standard</p>
                    <p className="text-xs text-slate-400">Appliqué lors de la création des commandes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue="20" className="w-20 text-center bg-white border border-slate-200 rounded-lg py-2 font-bold" />
                    <span className="font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
