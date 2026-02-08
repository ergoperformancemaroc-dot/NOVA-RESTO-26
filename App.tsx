
import React, { useState, useEffect } from 'react';
import { AppView, Table, TableStatus, Order, OrderItem, MenuItem, InventoryItem, UserRole, User } from './types';
import { INITIAL_TABLES, MENU_ITEMS, INITIAL_INVENTORY } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TableMap from './components/POS/TableMap';
import OrderPanel from './components/POS/OrderPanel';
import KitchenDisplay from './components/KDS/KitchenDisplay';
import InventoryManager from './components/Inventory/InventoryManager';
import AIAssistant from './components/AI/AIAssistant';
import SettingsPanel from './components/Settings/SettingsPanel';
import Login from './components/Auth/Login';
import { persistence, STORAGE_KEYS } from './services/persistenceService';

const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Admin Principal', username: 'admin', password: '1234', role: UserRole.ADMIN, email: 'admin@novaresto.com', active: true },
  { id: 'u2', name: 'Jean Manager', username: 'jmanager', password: '456', role: UserRole.GERANT, email: 'jean@novaresto.com', active: true },
  { id: 'u3', name: 'Chef Bernard', username: 'chefbernie', password: '789', role: UserRole.CUISINIER, email: 'bernard@novaresto.com', active: true },
  { id: 'u4', name: 'Sara Service', username: 'saraservice', password: '000', role: UserRole.SERVEUR, email: 'sara@novaresto.com', active: true },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [tables, setTables] = useState<Table[]>(() => persistence.load(STORAGE_KEYS.TABLES, INITIAL_TABLES));
  const [orders, setOrders] = useState<Order[]>(() => persistence.load(STORAGE_KEYS.ORDERS, []));
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [currency, setCurrency] = useState<string>(() => persistence.load(STORAGE_KEYS.CURRENCY, '€'));
  const [users, setUsers] = useState<User[]>(() => persistence.load(STORAGE_KEYS.USERS, DEFAULT_USERS));
  const [isCloudMode, setIsCloudMode] = useState<boolean>(persistence.isCloudEnabled());

  // Gestion de la session au démarrage
  useEffect(() => {
    const savedAuth = persistence.load<User | null>(STORAGE_KEYS.AUTH, null);
    if (savedAuth) {
      setCurrentUser(savedAuth);
      setIsAuthenticated(true);
    }
  }, []);

  // Persistance automatique
  useEffect(() => { persistence.save(STORAGE_KEYS.ORDERS, orders); }, [orders]);
  useEffect(() => { persistence.save(STORAGE_KEYS.TABLES, tables); }, [tables]);
  useEffect(() => { persistence.save(STORAGE_KEYS.CURRENCY, currency); }, [currency]);
  useEffect(() => { 
    persistence.save(STORAGE_KEYS.USERS, users);
    if (currentUser) {
      const updatedMe = users.find(u => u.id === currentUser.id);
      if (updatedMe && JSON.stringify(updatedMe) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedMe);
        persistence.save(STORAGE_KEYS.AUTH, updatedMe);
      }
    }
  }, [users, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    persistence.save(STORAGE_KEYS.AUTH, user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    persistence.remove(STORAGE_KEYS.AUTH);
  };

  const handleTableClick = (table: Table) => {
    if (currentUser?.role === UserRole.CUISINIER) return; 
    setSelectedTable(table);
    setCurrentView(AppView.POS);
  };

  const handleCreateOrder = (tableId: string, items: OrderItem[]) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      tableId,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'OPEN',
      timestamp: new Date()
    };
    
    setOrders([...orders, newOrder]);
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status: TableStatus.OCCUPIED, currentOrderId: newOrder.id } : t
    ));
    setCurrentView(AppView.DASHBOARD);
    setSelectedTable(null);
  };

  if (!isAuthenticated) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  const renderView = () => {
    const canAccessView = (view: AppView) => {
      if (!currentUser) return false;
      switch (currentUser.role) {
        case UserRole.ADMIN: return true;
        case UserRole.GERANT: return view !== AppView.SETTINGS;
        case UserRole.CUISINIER: return view === AppView.KITCHEN || view === AppView.DASHBOARD || view === AppView.INVENTORY;
        case UserRole.SERVEUR: return view === AppView.POS || view === AppView.DASHBOARD;
        default: return false;
      }
    };

    if (!canAccessView(currentView)) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <span className="text-6xl mb-4">🚫</span>
          <h2 className="text-xl font-bold">Accès Refusé</h2>
          <p>Votre profil ({currentUser?.role}) n'a pas les droits pour accéder à cette section.</p>
          <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mt-4 text-blue-500 font-bold underline">Retour au Tableau de bord</button>
        </div>
      );
    }

    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard tables={tables} orders={orders} inventory={inventory} onTableClick={handleTableClick} currency={currency} />;
      case AppView.POS:
        return selectedTable ? (
          <OrderPanel 
            table={selectedTable} 
            menuItems={MENU_ITEMS} 
            onSubmitOrder={(items) => handleCreateOrder(selectedTable.id, items)} 
            onBack={() => setCurrentView(AppView.DASHBOARD)}
            currency={currency}
          />
        ) : (
          <TableMap tables={tables} onTableClick={handleTableClick} />
        );
      case AppView.KITCHEN:
        return <KitchenDisplay orders={orders} setOrders={setOrders} />;
      case AppView.INVENTORY:
        return <InventoryManager inventory={inventory} setInventory={setInventory} />;
      case AppView.AI_ASSISTANT:
        return <AIAssistant context={{ tables, orders, inventory }} />;
      case AppView.SETTINGS:
        return (
          <SettingsPanel 
            tables={tables} 
            setTables={setTables} 
            currency={currency} 
            setCurrency={setCurrency} 
            users={users} 
            setUsers={setUsers}
            currentUser={currentUser}
            isCloudMode={isCloudMode}
            setCloudMode={setIsCloudMode}
          />
        );
      default:
        return <Dashboard tables={tables} orders={orders} inventory={inventory} onTableClick={handleTableClick} currency={currency} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 animate-in fade-in duration-700">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        userRole={currentUser?.role || UserRole.SERVEUR} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onNavigate={setCurrentView} 
          userRole={currentUser?.role || UserRole.SERVEUR} 
          userName={currentUser?.name || ''}
          onLogout={handleLogout}
          isCloudMode={isCloudMode}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
