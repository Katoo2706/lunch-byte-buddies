import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Users } from 'lucide-react';
import { Person, LunchOrder } from '@/types/lunch';
import { GlobalDateSelector } from './GlobalDateSelector';
import { IndividualOrderForm } from './IndividualOrderForm';
import { TeamOrderForm } from './TeamOrderForm';
import { TodaysOrders } from './TodaysOrders';

interface OrderLunchProps {
  people: Person[];
  orders: LunchOrder[];
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderLunch = ({ people, orders, onAddOrder, onDeleteOrder }: OrderLunchProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <GlobalDateSelector date={date} onDateChange={setDate} />
      
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Individual Order
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Order
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <IndividualOrderForm
            people={people}
            date={date}
            onAddOrder={onAddOrder}
          />
        </TabsContent>

        <TabsContent value="team">
          <TeamOrderForm
            people={people}
            date={date}
            onAddOrder={onAddOrder}
          />
        </TabsContent>
      </Tabs>

      <TodaysOrders
        date={date}
        orders={orders}
        people={people}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
};
