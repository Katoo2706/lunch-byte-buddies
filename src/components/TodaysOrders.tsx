import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Users, History, Filter } from 'lucide-react';
import { Person, LunchOrder, Balance } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { formatCurrency } from '@/utils/calculations';

interface TodaysOrdersProps {
  date: string;
  orders: LunchOrder[];
  people: Person[];
  balances: Balance[];
  onDeleteOrder: (orderId: string) => void;
}

export const TodaysOrders = ({ date, orders, people, balances, onDeleteOrder }: TodaysOrdersProps) => {
  const [showUnsettledOnly, setShowUnsettledOnly] = useState(false);
  
  const todaysOrders = orders.filter(order => order.date === date);

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  const getPersonBalance = (personId: string) => {
    const balance = balances.find(b => b.personId === personId);
    return balance ? balance.amount : 0;
  };

  const isUnsettled = (order: LunchOrder) => {
    if (order.personId === order.payerId) return false;
    const balance = getPersonBalance(order.personId);
    return balance < 0;
  };

  const getHistoricalOrders = () => {
    let historicalOrders = orders.filter(order => order.date !== date);
    
    if (showUnsettledOnly) {
      historicalOrders = historicalOrders.filter(isUnsettled);
    }
    
    return historicalOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const groupOrdersByTeam = () => {
    const grouped: { [key: string]: LunchOrder[] } = {};
    const individual: LunchOrder[] = [];

    todaysOrders.forEach(order => {
      if (order.isTeamOrder && order.teamMembers) {
        const key = `${order.payerId}-${order.date}-${order.note || ''}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(order);
      } else {
        individual.push(order);
      }
    });

    return { grouped, individual };
  };

  const { grouped, individual } = groupOrdersByTeam();

  return (
    <Card className="lunch-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Orders Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today ({date})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-4">
            {todaysOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders for this date</p>
            ) : (
              <div className="space-y-4">
                {/* Team Orders */}
                {Object.entries(grouped).map(([key, teamOrders]) => {
                  const totalAmount = teamOrders.reduce((sum, order) => sum + order.price, 0);
                  const payer = teamOrders[0];
                  
                  return (
                    <div key={key} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium">Team Order</span>
                          <span className="text-sm text-muted-foreground">
                            ({teamOrders.length} people)
                          </span>
                        </div>
                        <div className="font-semibold text-primary">
                          {formatCurrency(totalAmount)} total
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        Paid by: {getPersonName(payer.payerId)}
                      </div>
                      
                      <div className="space-y-2">
                        {teamOrders.map(order => (
                          <div key={order.id} className="flex items-center justify-between p-2 bg-background rounded">
                            <div className="flex items-center gap-2">
                              <GenderIcon gender={people.find(p => p.id === order.personId)?.gender || 'male'} />
                              <span>{getPersonName(order.personId)}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="font-medium">{formatCurrency(order.price)}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteOrder(order.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {payer.note && (
                        <div className="text-xs text-muted-foreground mt-2 italic">
                          Note: {payer.note}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Individual Orders */}
                <div className="space-y-2">
                  {individual.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <GenderIcon gender={people.find(p => p.id === order.personId)?.gender || 'male'} />
                        <div>
                          <p className="font-medium">{getPersonName(order.personId)}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid by: {getPersonName(order.payerId)} • {formatCurrency(order.price)}
                          </p>
                          {order.note && <p className="text-xs text-muted-foreground">{order.note}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteOrder(order.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Order History</h3>
              <Button
                variant={showUnsettledOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUnsettledOnly(!showUnsettledOnly)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {showUnsettledOnly ? "Show All" : "Unsettled Only"}
              </Button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getHistoricalOrders().length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {showUnsettledOnly ? "No unsettled orders found" : "No historical orders"}
                </p>
              ) : (
                getHistoricalOrders().map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-xs text-muted-foreground min-w-20">
                        {order.date}
                      </div>
                      <GenderIcon gender={people.find(p => p.id === order.personId)?.gender || 'male'} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getPersonName(order.personId)}</span>
                          {order.isTeamOrder && (
                            <Badge variant="secondary" className="text-xs">Team</Badge>
                          )}
                          {isUnsettled(order) && (
                            <Badge variant="destructive" className="text-xs">Unsettled</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.note || "Lunch order"} • Paid by: {getPersonName(order.payerId)}
                        </div>
                      </div>
                      <div className="font-semibold text-primary">
                        {formatCurrency(order.price)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteOrder(order.id)}
                      className="text-destructive hover:text-destructive ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};