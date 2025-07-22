export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female';
  isDefaultPayer: boolean;
}

export interface LunchOrder {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD format
  price: number;
  payerId: string; // who paid for this order
  note?: string;
  isTeamOrder?: boolean;
  teamMembers?: string[]; // array of person IDs for team orders
}

export interface Settlement {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface LunchData {
  people: Person[];
  orders: LunchOrder[];
  settlements: Settlement[];
}

export interface Balance {
  personId: string;
  amount: number; // positive = owed to them, negative = they owe
}