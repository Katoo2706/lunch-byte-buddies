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
    if (order.isTeamOrder && order.teamMembers) {
      // For team orders, split the cost among team members
      const costPerPerson = order.price / order.teamMembers.length;
      order.teamMembers.forEach(memberId => {
        balances[memberId] -= costPerPerson;
      });
      // Person who paid should receive money (positive)
      balances[order.payerId] += order.price;
    } else {
      // Regular order: person who ordered owes money (negative)
      balances[order.personId] -= order.price;
      // Person who paid should receive money (positive)  
      balances[order.payerId] += order.price;
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