import { useState, useEffect, useCallback } from 'react';
import { Person, LunchOrder, Settlement, LunchData } from '@/types/lunch';
import { calculateBalances } from '@/utils/calculations';
import { loadData, saveData } from '@/utils/storage';

export const useLunchData = () => {
  const [data, setData] = useState<LunchData>({
    people: [],
    orders: [],
    settlements: []
  });

  // Load data on component mount
  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const balances = calculateBalances(data.people, data.orders, data.settlements);

  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  // Person management
  const addPerson = useCallback((person: Omit<Person, 'id'>) => {
    setData(prev => ({
      ...prev,
      people: [...prev.people, { ...person, id: generateId() }]
    }));
  }, [generateId]);

  const deletePerson = useCallback((personId: string) => {
    setData(prev => ({
      ...prev,
      people: prev.people.filter(p => p.id !== personId),
      orders: prev.orders.filter(o => o.personId !== personId && o.payerId !== personId),
      settlements: prev.settlements.filter(s => s.fromPersonId !== personId && s.toPersonId !== personId)
    }));
  }, []);

  const updatePerson = useCallback((personId: string, updates: Partial<Person>) => {
    setData(prev => ({
      ...prev,
      people: prev.people.map(p => 
        p.id === personId ? { ...p, ...updates } : p
      )
    }));
  }, []);

  // Order management
  const addOrder = useCallback((order: Omit<LunchOrder, 'id'>) => {
    setData(prev => ({
      ...prev,
      orders: [...prev.orders, { ...order, id: generateId() }]
    }));
  }, [generateId]);

  const deleteOrder = useCallback((orderId: string) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== orderId)
    }));
  }, []);

  // Settlement management
  const addSettlement = useCallback((settlement: Omit<Settlement, 'id'>) => {
    setData(prev => ({
      ...prev,
      settlements: [...prev.settlements, { ...settlement, id: generateId() }]
    }));
  }, [generateId]);

  const deleteSettlement = useCallback((settlementId: string) => {
    setData(prev => ({
      ...prev,
      settlements: prev.settlements.filter(s => s.id !== settlementId)
    }));
  }, []);

  const handleDataImport = useCallback(() => {
    const loadedData = loadData();
    setData(loadedData);
  }, []);

  return {
    data,
    balances,
    addPerson,
    deletePerson,
    updatePerson,
    addOrder,
    deleteOrder,
    addSettlement,
    deleteSettlement,
    handleDataImport
  };
};