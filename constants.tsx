
import { Table, TableStatus, MenuItem, InventoryItem } from './types';

export const INITIAL_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: TableStatus.AVAILABLE },
  { id: 't2', number: 2, capacity: 4, status: TableStatus.OCCUPIED, currentOrderId: 'o1' },
  { id: 't3', number: 3, capacity: 4, status: TableStatus.AVAILABLE },
  { id: 't4', number: 4, capacity: 6, status: TableStatus.RESERVED },
  { id: 't5', number: 5, capacity: 2, status: TableStatus.DIRTY },
  { id: 't6', number: 6, capacity: 8, status: TableStatus.AVAILABLE },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 'm1', name: 'Margherita Pizza', price: 12.50, category: 'Main', image: 'https://picsum.photos/200/200?random=1' },
  { id: 'm2', name: 'Caesar Salad', price: 8.90, category: 'Starter', image: 'https://picsum.photos/200/200?random=2' },
  { id: 'm3', name: 'Ribeye Steak', price: 28.00, category: 'Main', image: 'https://picsum.photos/200/200?random=3' },
  { id: 'm4', name: 'Tiramisu', price: 7.50, category: 'Dessert', image: 'https://picsum.photos/200/200?random=4' },
  { id: 'm5', name: 'Red Wine (Glass)', price: 6.00, category: 'Drinks', image: 'https://picsum.photos/200/200?random=5' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Flour', stock: 50, unit: 'kg', minStock: 10, lastOrdered: '2023-10-01' },
  { id: 'i2', name: 'Tomatoes', stock: 5, unit: 'kg', minStock: 15, lastOrdered: '2023-10-25' },
  { id: 'i3', name: 'Beef Strips', stock: 12, unit: 'kg', minStock: 5, lastOrdered: '2023-10-20' },
  { id: 'i4', name: 'Red Wine', stock: 24, unit: 'bottles', minStock: 12, lastOrdered: '2023-09-15' },
];
