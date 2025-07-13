export const LocalStorageService = {
  // Generic method to set item in local storage
  setItem: <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  // Generic method to get item from local storage
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return defaultValue;
    }
  },

  // Remove item from local storage
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  // Clear all local storage
  clear: () => {
    localStorage.clear();
  }
};