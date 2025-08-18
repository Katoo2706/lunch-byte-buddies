import { Person, LunchOrder, Settlement, Balance } from '@/types/lunch';

export const calculateBalances = (
  people: Person[], 
  orders: LunchOrder[], 
  settlements: Settlement[]
): Balance[] => {
  const balances: { [personId: string]: number } = {};
  
  // Initialize balances for all people
  people.forEach(person => {
    balances[person.id] = 0;
  });
  
  // Calculate from orders
  orders.forEach(order => {
    const unsettledAmount = order.price - (order.settledAmount || 0);
    
    if (order.isTeamOrder && order.teamMembers) {
      // For team orders, the person ordering owes money (negative)
      balances[order.personId] -= unsettledAmount;
      // Person who paid should receive money (positive)
      balances[order.payerId] += unsettledAmount;
    } else {
      // Regular order: person who ordered owes money (negative)
      balances[order.personId] -= unsettledAmount;
      // Person who paid should receive money (positive)  
      balances[order.payerId] += unsettledAmount;
    }
  });
  
  // Apply settlements
  settlements.forEach(settlement => {
    // Person who paid reduces their balance
    balances[settlement.fromPersonId] -= settlement.amount;
    // Person who received increases their balance
    balances[settlement.toPersonId] += settlement.amount;
  });
  
  return Object.entries(balances).map(([personId, amount]) => ({
    personId,
    amount
  }));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const getPersonById = (people: Person[], id: string): Person | undefined => {
  return people.find(person => person.id === id);
};

export const getDefaultPayer = (people: Person[]): Person | undefined => {
  return people.find(person => person.isDefaultPayer);
};