# Data Schemas

This document defines the database schemas and validation rules for the lunch tracking application.

## Database Tables

### people
Stores information about team members who can place orders.

```sql
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  is_default_payer BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one default payer at a time
CREATE UNIQUE INDEX unique_default_payer 
ON people (is_default_payer) 
WHERE is_default_payer = true;

-- Index for efficient lookups
CREATE INDEX idx_people_name ON people(name);
```

### orders
Stores lunch order records.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  payer_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  note TEXT,
  is_team_order BOOLEAN NOT NULL DEFAULT false,
  team_members UUID[] DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_orders_date ON orders(date);
CREATE INDEX idx_orders_person_id ON orders(person_id);
CREATE INDEX idx_orders_payer_id ON orders(payer_id);
CREATE INDEX idx_orders_team ON orders(is_team_order);

-- Constraint to ensure team_members is only set for team orders
ALTER TABLE orders ADD CONSTRAINT check_team_members 
CHECK (
  (is_team_order = false AND team_members IS NULL) OR
  (is_team_order = true AND team_members IS NOT NULL AND array_length(team_members, 1) > 1)
);
```

### settlements
Tracks money settlements between people.

```sql
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  to_person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent self-settlements
ALTER TABLE settlements ADD CONSTRAINT check_different_people 
CHECK (from_person_id != to_person_id);

-- Indexes for efficient queries
CREATE INDEX idx_settlements_from_person ON settlements(from_person_id);
CREATE INDEX idx_settlements_to_person ON settlements(to_person_id);
CREATE INDEX idx_settlements_date ON settlements(date);
```

## Row Level Security (RLS)

Enable RLS on all tables and create policies for authenticated users:

```sql
-- Enable RLS
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can view all people" ON people
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert people" ON people
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update people" ON people
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete people" ON people
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all orders" ON orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert orders" ON orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update orders" ON orders
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete orders" ON orders
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Users can view all settlements" ON settlements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert settlements" ON settlements
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update settlements" ON settlements
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete settlements" ON settlements
  FOR DELETE TO authenticated USING (true);
```

## TypeScript Interfaces

### Core Data Types

```typescript
export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female';
  is_default_payer: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LunchOrder {
  id: string;
  person_id: string;
  date: string; // YYYY-MM-DD format
  price: number;
  payer_id: string;
  note?: string;
  is_team_order?: boolean;
  team_members?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Settlement {
  id: string;
  from_person_id: string;
  to_person_id: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Balance {
  person_id: string;
  amount: number; // positive = owed to them, negative = they owe
}

export interface LunchData {
  people: Person[];
  orders: LunchOrder[];
  settlements: Settlement[];
}
```

### API Request/Response Types

```typescript
// Request types
export interface CreatePersonRequest {
  name: string;
  gender: 'male' | 'female';
  is_default_payer: boolean;
}

export interface UpdatePersonRequest {
  name?: string;
  gender?: 'male' | 'female';
  is_default_payer?: boolean;
}

export interface CreateOrderRequest {
  person_id: string;
  date: string;
  price: number;
  payer_id: string;
  note?: string;
  is_team_order?: boolean;
  team_members?: string[];
}

export interface CreateSettlementRequest {
  from_person_id: string;
  to_person_id: string;
  amount: number;
  date: string;
  note?: string;
}

// Response types
export interface OrderStats {
  total_orders: number;
  total_amount: number;
  average_order_value: number;
  orders_by_person: Array<{
    person_id: string;
    order_count: number;
    total_amount: number;
  }>;
}

export interface ImportRequest {
  people: Person[];
  orders: LunchOrder[];
  settlements: Settlement[];
  merge?: boolean;
}

export interface ImportResponse {
  imported: {
    people: number;
    orders: number;
    settlements: number;
  };
  errors?: string[];
}
```

## Validation Rules

### Person Validation
- `name`: Required, 1-255 characters, trimmed
- `gender`: Required, must be 'male' or 'female'
- `is_default_payer`: Boolean, only one person can be default payer

### Order Validation
- `person_id`: Required, must exist in people table
- `date`: Required, valid date in YYYY-MM-DD format
- `price`: Required, positive decimal number
- `payer_id`: Required, must exist in people table
- `note`: Optional, max 1000 characters
- `is_team_order`: Boolean, defaults to false
- `team_members`: Required if is_team_order is true, must contain at least 2 valid person IDs

### Settlement Validation
- `from_person_id`: Required, must exist in people table
- `to_person_id`: Required, must exist in people table, cannot be same as from_person_id
- `amount`: Required, positive decimal number
- `date`: Required, valid date in YYYY-MM-DD format
- `note`: Optional, max 1000 characters

## Indexes and Performance

### Recommended Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_orders_date_person ON orders(date, person_id);
CREATE INDEX idx_orders_payer_date ON orders(payer_id, date);
CREATE INDEX idx_settlements_participants ON settlements(from_person_id, to_person_id);

-- Partial indexes for team orders
CREATE INDEX idx_team_orders ON orders(date) WHERE is_team_order = true;
```

### Query Optimization Tips
1. Use date range queries with proper indexes
2. Limit results with pagination for large datasets
3. Use prepared statements for repeated queries
4. Consider materialized views for complex balance calculations
5. Implement proper connection pooling

## Data Constraints

### Business Rules
1. A person cannot settle money with themselves
2. Settlement amounts must be positive
3. Order prices must be positive
4. Only one person can be the default payer
5. Team orders must have at least 2 team members
6. All referenced person IDs must exist

### Data Integrity
1. Foreign key constraints ensure referential integrity
2. Check constraints validate data ranges and values
3. Unique constraints prevent duplicate default payers
4. Cascade deletes maintain consistency when people are removed