import { LunchData } from '@/types/lunch';

const STORAGE_KEY = 'lunch-app-data';

const defaultData: LunchData = {
  people: [],
  orders: [],
  settlements: []
};

export const loadData = (): LunchData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return defaultData;
};

export const saveData = (data: LunchData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    // Validate the data structure
    if (data && typeof data === 'object' && 
        Array.isArray(data.people) && 
        Array.isArray(data.orders) && 
        Array.isArray(data.settlements)) {
      saveData(data);
      return true;
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
  return false;
};