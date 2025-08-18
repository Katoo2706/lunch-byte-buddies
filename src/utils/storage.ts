import { LunchData } from '@/types/lunch';

const defaultData: LunchData = {
  people: [],
  orders: [],
  settlements: []
};

// Storage key for localStorage
const STORAGE_KEY = 'lunch-data';

// Load data from localStorage or return default data
export const loadData = (): LunchData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (
        parsedData &&
        typeof parsedData === 'object' &&
        Array.isArray(parsedData.people) &&
        Array.isArray(parsedData.orders) &&
        Array.isArray(parsedData.settlements)
      ) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return { ...defaultData };
};

// Save data to localStorage
export const saveData = (data: LunchData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Export data as JSON string
export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

// Import data from JSON string
export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    // Validate the data structure
    if (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.people) &&
      Array.isArray(data.orders) &&
      Array.isArray(data.settlements)
    ) {
      saveData(data);
      return true;
    }
  } catch (error) {
    console.error('Error importing data:', error);
  }
  return false;
};

// Download data as JSON file
export const downloadDataAsFile = (filename: string = 'lunch-data.json'): void => {
  const jsonString = exportData();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Load data from uploaded file
export const loadDataFromFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string;
        const success = importData(jsonString);
        resolve(success);
      } catch (error) {
        console.error('Error reading file:', error);
        resolve(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      resolve(false);
    };

    reader.readAsText(file);
  });
};