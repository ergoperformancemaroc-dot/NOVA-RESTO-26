
/**
 * Persistence Service - Gère la transition entre Local (LocalStorage) et SaaS (Supabase/API)
 */

export const STORAGE_KEYS = {
  ORDERS: 'nova_orders',
  TABLES: 'nova_tables',
  CURRENCY: 'nova_currency',
  USERS: 'nova_users',
  AUTH: 'nova_auth_user',
  CLOUD_CONFIG: 'nova_cloud_config'
};

export const persistence = {
  save: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    // Ici, on pourrait ajouter un appel fetch vers Supabase si le mode Cloud est actif
  },
  
  load: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    try {
      return JSON.parse(saved) as T;
    } catch {
      return defaultValue;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  isCloudEnabled: (): boolean => {
    const config = persistence.load(STORAGE_KEYS.CLOUD_CONFIG, { enabled: false });
    return config.enabled;
  }
};
