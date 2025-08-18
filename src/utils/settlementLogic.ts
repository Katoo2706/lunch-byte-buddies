import { LunchOrder, Person, Settlement } from '@/types/lunch';

export interface SettlementResult {
  updatedOrders: LunchOrder[];
  remainingAmount: number;
}

export const applySettlementToOrders = (
  orders: LunchOrder[],
  settlement: Omit<Settlement, 'id'>,
  people: Person[]
): SettlementResult => {
  const { fromPersonId, toPersonId, amount } = settlement;
  let remainingAmount = amount;
  const updatedOrders = [...orders];

  // Find orders where fromPerson owes money to toPerson
  const relevantOrders = updatedOrders.filter(order => {
    // Check if this order creates a debt from fromPerson to toPerson
    if (order.personId === fromPersonId && order.payerId === toPersonId) {
      // fromPerson ordered, toPerson paid - direct debt
      return true;
    }
    
    // For team orders, check if fromPerson was in the team and toPerson paid
    if (order.isTeamOrder && order.teamMembers?.includes(fromPersonId) && order.payerId === toPersonId) {
      return true;
    }
    
    return false;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Settle oldest orders first

  // Apply settlement to relevant orders
  for (const order of relevantOrders) {
    if (remainingAmount <= 0) break;
    
    const currentSettled = order.settledAmount || 0;
    const unsettledAmount = order.price - currentSettled;
    
    if (unsettledAmount > 0) {
      const amountToSettle = Math.min(remainingAmount, unsettledAmount);
      
      // Update the order in the array
      const orderIndex = updatedOrders.findIndex(o => o.id === order.id);
      if (orderIndex !== -1) {
        updatedOrders[orderIndex] = {
          ...updatedOrders[orderIndex],
          settledAmount: currentSettled + amountToSettle
        };
      }
      
      remainingAmount -= amountToSettle;
    }
  }

  return {
    updatedOrders,
    remainingAmount
  };
};

export const getOrderSettlementStatus = (order: LunchOrder): 'unsettled' | 'partial' | 'settled' => {
  const settledAmount = order.settledAmount || 0;
  
  if (settledAmount === 0) return 'unsettled';
  if (settledAmount >= order.price) return 'settled';
  return 'partial';
};