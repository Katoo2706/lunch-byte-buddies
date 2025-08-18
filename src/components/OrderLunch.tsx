import { useState } from 'react';
import { Users } from 'lucide-react';
import { Person, LunchOrder, Balance } from '@/types/lunch';
import { TeamOrderForm } from './TeamOrderForm';
import { TodaysOrders } from './TodaysOrders';

interface OrderLunchProps {
  people: Person[];
  orders: LunchOrder[];
  balances: Balance[];
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderLunch = ({ people, orders, balances, onAddOrder, onDeleteOrder }: OrderLunchProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 font-medium">
        <Users className="w-5 h-5" />
        <h2 className="text-xl">Team Order</h2>
      </div>

      <TeamOrderForm
        people={people}
        date={date}
        onDateChange={setDate}
        onAddOrder={onAddOrder}
      />

      <TodaysOrders
        date={date}
        orders={orders}
        people={people}
        balances={balances}
        onDeleteOrder={onDeleteOrder}
      />
    </div>
  );
};
