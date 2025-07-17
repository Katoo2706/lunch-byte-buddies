import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Receipt } from 'lucide-react';
import { Person, Balance } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { formatCurrency, getPersonById } from '@/utils/calculations';

interface DashboardProps {
  people: Person[];
  balances: Balance[];
  totalOrders: number;
  totalSettlements: number;
}

export const Dashboard = ({ 
  people, 
  balances, 
  totalOrders, 
  totalSettlements
}: DashboardProps) => {
  const positiveBalances = balances.filter(b => b.amount > 0);
  const negativeBalances = balances.filter(b => b.amount < 0);
  
  const totalOwed = positiveBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalOwing = Math.abs(negativeBalances.reduce((sum, b) => sum + b.amount, 0));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="lunch-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total People</p>
                <p className="text-2xl font-bold text-primary">{people.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="lunch-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
              </div>
              <Receipt className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="lunch-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Settlements</p>
                <p className="text-2xl font-bold text-primary">{totalSettlements}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="lunch-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(totalOwing)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lunch-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <TrendingUp className="w-5 h-5" />
              People Owed Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            {positiveBalances.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No one is owed money</p>
            ) : (
              <div className="space-y-3">
                {positiveBalances
                  .sort((a, b) => b.amount - a.amount)
                  .map(balance => {
                    const person = getPersonById(people, balance.personId);
                    return (
                      <div key={balance.personId} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          {person && <GenderIcon gender={person.gender} />}
                          <span className="font-medium">{person?.name || 'Unknown'}</span>
                        </div>
                        <span className="balance-positive">{formatCurrency(balance.amount)}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lunch-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TrendingDown className="w-5 h-5" />
              People Owing Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            {negativeBalances.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No one owes money</p>
            ) : (
              <div className="space-y-3">
                {negativeBalances
                  .sort((a, b) => a.amount - b.amount)
                  .map(balance => {
                    const person = getPersonById(people, balance.personId);
                    return (
                      <div key={balance.personId} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          {person && <GenderIcon gender={person.gender} />}
                          <span className="font-medium">{person?.name || 'Unknown'}</span>
                        </div>
                        <span className="balance-negative">{formatCurrency(Math.abs(balance.amount))}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
};