import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, DollarSign, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Person, LunchOrder } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { formatCurrency, getDefaultPayer } from '@/utils/calculations';

interface OrderLunchProps {
  people: Person[];
  orders: LunchOrder[];
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderLunch = ({ people, orders, onAddOrder, onDeleteOrder }: OrderLunchProps) => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [price, setPrice] = useState(40000);
  const [customPrice, setCustomPrice] = useState('');
  const [selectedPayer, setSelectedPayer] = useState('');
  const [note, setNote] = useState('');
  const [isTeamOrder, setIsTeamOrder] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);

  const defaultPayer = getDefaultPayer(people);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isTeamOrder) {
      if (!selectedPayer || selectedTeamMembers.length === 0) return;
    } else {
      if (!selectedPerson || !selectedPayer) return;
    }
    
    const finalPrice = price === 0 ? parseInt(customPrice) || 0 : price;
    
    onAddOrder({
      personId: isTeamOrder ? selectedTeamMembers[0] : selectedPerson, // Use first team member as primary person for team orders
      date,
      price: finalPrice,
      payerId: selectedPayer,
      note: note.trim() || undefined,
      isTeamOrder,
      teamMembers: isTeamOrder ? selectedTeamMembers : undefined
    });
    
    // Reset form
    setSelectedPerson('');
    setSelectedTeamMembers([]);
    setPrice(40000);
    setCustomPrice('');
    setNote('');
    // Keep date and payer for convenience
  };

  const handleTeamMemberToggle = (personId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  const todaysOrders = orders.filter(order => order.date === date);

  return (
    <div className="space-y-6">
      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Order Lunch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Team Order Toggle */}
            <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
              <Checkbox
                id="team-order"
                checked={isTeamOrder}
                onCheckedChange={(checked) => setIsTeamOrder(checked === true)}
              />
              <Label htmlFor="team-order" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Order (One payer for multiple people)
              </Label>
            </div>

            {isTeamOrder ? (
              <div>
                <Label>Select Team Members</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 p-4 border rounded-lg">
                  {people.map(person => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`team-${person.id}`}
                        checked={selectedTeamMembers.includes(person.id)}
                        onCheckedChange={() => handleTeamMemberToggle(person.id)}
                      />
                      <Label htmlFor={`team-${person.id}`} className="flex items-center gap-2 cursor-pointer">
                        <GenderIcon gender={person.gender} />
                        {person.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="person">Person Ordering</Label>
                <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <GenderIcon gender={person.gender} />
                          {person.name}
                          {person.isDefaultPayer && <span className="text-xs text-muted-foreground">(Default Payer)</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label>Lunch Price</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  type="button"
                  variant={price === 40000 ? "default" : "outline"}
                  onClick={() => setPrice(40000)}
                  className="h-12"
                >
                  40,000 VND
                </Button>
                <Button
                  type="button"
                  variant={price === 45000 ? "default" : "outline"}
                  onClick={() => setPrice(45000)}
                  className="h-12"
                >
                  45,000 VND
                </Button>
                <div>
                  <Button
                    type="button"
                    variant={price === 0 ? "default" : "outline"}
                    onClick={() => setPrice(0)}
                    className="w-full h-12 mb-2"
                  >
                    Custom
                  </Button>
                  {price === 0 && (
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="payer">Who's Paying?</Label>
              <Select 
                value={selectedPayer} 
                onValueChange={setSelectedPayer}
                defaultValue={defaultPayer?.id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payer" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      <div className="flex items-center gap-2">
                        <GenderIcon gender={person.gender} />
                        {person.name}
                        {person.isDefaultPayer && <span className="text-xs text-muted-foreground">(Default)</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any notes about the order..."
              />
            </div>

            <Button type="submit" className="hero-button w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Today's Orders ({date})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todaysOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No orders for this date</p>
          ) : (
            <div className="space-y-2">
              {todaysOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <GenderIcon gender={people.find(p => p.id === order.personId)?.gender || 'male'} />
                    <div>
                      {order.isTeamOrder ? (
                        <>
                          <p className="font-medium flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Team Order ({order.teamMembers?.length} people)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.teamMembers?.map(id => getPersonName(id)).join(', ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Paid by: {getPersonName(order.payerId)} • {formatCurrency(order.price)} total • {formatCurrency(order.price / (order.teamMembers?.length || 1))} per person
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium">{getPersonName(order.personId)}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid by: {getPersonName(order.payerId)} • {formatCurrency(order.price)}
                          </p>
                        </>
                      )}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
