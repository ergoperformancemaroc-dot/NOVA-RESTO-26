
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  KITCHEN = 'KITCHEN',
  INVENTORY = 'INVENTORY',
  REPORTS = 'REPORTS',
  AI_ASSISTANT = 'AI_ASSISTANT',
  SETTINGS = 'SETTINGS'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERANT = 'GERANT',
  CUISINIER = 'CUISINIER',
  SERVEUR = 'SERVEUR'
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  DIRTY = 'DIRTY'
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  status: 'PENDING' | 'COOKING' | 'READY' | 'SERVED';
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: 'OPEN' | 'PAID' | 'CANCELLED';
  timestamp: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  lastOrdered: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  email: string;
  active: boolean;
}
