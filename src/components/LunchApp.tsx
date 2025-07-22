import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, Users, Receipt } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { OrderLunch } from './OrderLunch';
import { People } from './People';
import { Settlements } from './Settlements';
import { Footer } from './Footer';
import { useLunchData } from '@/hooks/useLunchData';

export const LunchApp = () => {
  const {
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
  } = useLunchData();

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