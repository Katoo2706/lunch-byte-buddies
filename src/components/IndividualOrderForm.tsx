import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Person, LunchOrder } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { getDefaultPayer } from '@/utils/calculations';

interface IndividualOrderFormProps {
  people: Person[];
  date: string;
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
}

export const IndividualOrderForm = ({ people, date, onAddOrder }: IndividualOrderFormProps) => {
  const [selectedPerson, setSelectedPerson] = useState('');
  const [price, setPrice] = useState(40000);
  const [customPrice, setCustomPrice] = useState('');
  const [selectedPayer, setSelectedPayer] = useState('');
  const [note, setNote] = useState('');

  const defaultPayer = getDefaultPayer(people);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPerson || !selectedPayer) return;
    
    const finalPrice = price === 0 ? parseInt(customPrice) || 0 : price;
    
    onAddOrder({
      personId: selectedPerson,
      date,
      price: finalPrice,
      payerId: selectedPayer,
      note: note.trim() || undefined,
      isTeamOrder: false
    });
    
    // Reset form
    setSelectedPerson('');
    setPrice(40000);
    setCustomPrice('');
    setNote('');
    // Keep payer for convenience
  };

  return (
    <Card className="lunch-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Individual Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Add Individual Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
