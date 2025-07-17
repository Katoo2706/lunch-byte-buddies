import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, Users, Receipt, BarChart3 } from 'lucide-react';
import { Person, LunchOrder, Settlement, LunchData } from '@/types/lunch';
import { calculateBalances } from '@/utils/calculations';
import { loadData, saveData } from '@/utils/storage';
import { Dashboard } from './Dashboard';
import { OrderLunch } from './OrderLunch';
import { People } from './People';
import { Settlements } from './Settlements';
import { Footer } from './Footer';

export const LunchApp = () => {
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

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Person management
  const addPerson = (person: Omit<Person, 'id'>) => {
    setData(prev => ({
      ...prev,
      people: [...prev.people, { ...person, id: generateId() }]
    }));
  };

  const deletePerson = (personId: string) => {
    setData(prev => ({
      ...prev,
      people: prev.people.filter(p => p.id !== personId),
      orders: prev.orders.filter(o => o.personId !== personId && o.payerId !== personId),
      settlements: prev.settlements.filter(s => s.fromPersonId !== personId && s.toPersonId !== personId)
    }));
  };

  const updatePerson = (personId: string, updates: Partial<Person>) => {
    setData(prev => ({
      ...prev,
      people: prev.people.map(p => 
        p.id === personId ? { ...p, ...updates } : p
      )
    }));
  };

  // Order management
  const addOrder = (order: Omit<LunchOrder, 'id'>) => {
    setData(prev => ({
      ...prev,
      orders: [...prev.orders, { ...order, id: generateId() }]
    }));
  };

  const deleteOrder = (orderId: string) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== orderId)
    }));
  };

  // Settlement management
  const addSettlement = (settlement: Omit<Settlement, 'id'>) => {
    setData(prev => ({
      ...prev,
      settlements: [...prev.settlements, { ...settlement, id: generateId() }]
    }));
  };

  const deleteSettlement = (settlementId: string) => {
    setData(prev => ({
      ...prev,
      settlements: prev.settlements.filter(s => s.id !== settlementId)
    }));
  };

  const handleDataImport = () => {
    const loadedData = loadData();
    setData(loadedData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-lunch bg-clip-text text-transparent mb-2">
            🍱 Lunch Tracker
          </h1>
          <p className="text-muted-foreground">
            Track lunch orders, payments, and settlements with your team
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Order Lunch
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              People
            </TabsTrigger>
            <TabsTrigger value="settlements" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Settlements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderLunch
              people={data.people}
              orders={data.orders}
              onAddOrder={addOrder}
              onDeleteOrder={deleteOrder}
            />
          </TabsContent>

          <TabsContent value="people">
            <People
              people={data.people}
              onAddPerson={addPerson}
              onDeletePerson={deletePerson}
              onUpdatePerson={updatePerson}
            />
          </TabsContent>

          <TabsContent value="settlements">
            <Settlements
              people={data.people}
              settlements={data.settlements}
              balances={balances}
              onAddSettlement={addSettlement}
              onDeleteSettlement={deleteSettlement}
            />
          </TabsContent>
        </Tabs>

        {/* Dashboard - Moved below tabs */}
        <div className="mt-8">
          <Dashboard
            people={data.people}
            balances={balances}
            totalOrders={data.orders.length}
            totalSettlements={data.settlements.length}
          />
        </div>
      </div>
      
      <Footer onDataImport={handleDataImport} />
    </div>
  );
};