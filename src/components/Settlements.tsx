import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Plus, Trash2, Receipt, DollarSign } from 'lucide-react';
import { Person, Settlement, Balance } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { formatCurrency, getPersonById } from '@/utils/calculations';

interface SettlementsProps {
  people: Person[];
  settlements: Settlement[];
  balances: Balance[];
  onAddSettlement: (settlement: Omit<Settlement, 'id'>) => void;
  onDeleteSettlement: (settlementId: string) => void;
}

export const Settlements = ({ 
  people, 
  settlements, 
  balances, 
  onAddSettlement, 
  onDeleteSettlement 
}: SettlementsProps) => {
  const [fromPersonId, setFromPersonId] = useState('');
  const [toPersonId, setToPersonId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Calculate default amount based on balances
  const getDefaultAmount = () => {
    if (!fromPersonId || !toPersonId) return 0;
    
    const fromBalance = balances.find(b => b.personId === fromPersonId);
    const toBalance = balances.find(b => b.personId === toPersonId);
    
    if (fromBalance && toBalance) {
      // If fromPerson owes money (negative balance) and toPerson is owed money (positive balance)
      if (fromBalance.amount < 0 && toBalance.amount > 0) {
        return Math.min(Math.abs(fromBalance.amount), toBalance.amount);
      }
    }
    
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromPersonId || !toPersonId || !amount) return;
    
    const amountNum = parseInt(amount);
    if (amountNum <= 0) return;
    
    onAddSettlement({
      fromPersonId,
      toPersonId,
      amount: amountNum,
      date: new Date().toISOString().split('T')[0],
      note: note.trim() || undefined
    });
    
    // Reset form
    setFromPersonId('');
    setToPersonId('');
    setAmount('');
    setNote('');
  };

  // Update amount when person selection changes
  const handlePersonChange = (type: 'from' | 'to', personId: string) => {
    if (type === 'from') {
      setFromPersonId(personId);
    } else {
      setToPersonId(personId);
    }
    
    // Auto-fill amount after both people are selected
    setTimeout(() => {
      const defaultAmount = getDefaultAmount();
      if (defaultAmount > 0) {
        setAmount(defaultAmount.toString());
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Record Settlement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="fromPerson">From (Person Paying)</Label>
                <Select value={fromPersonId} onValueChange={(value) => handlePersonChange('from', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <GenderIcon gender={person.gender} />
                          {person.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-primary mt-6" />
              </div>

              <div>
                <Label htmlFor="toPerson">To (Person Receiving)</Label>
                <Select value={toPersonId} onValueChange={(value) => handlePersonChange('to', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {people.map(person => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <GenderIcon gender={person.gender} />
                          {person.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (VND)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
              {fromPersonId && toPersonId && (
                <p className="text-sm text-muted-foreground mt-1">
                  Suggested: {formatCurrency(getDefaultAmount())}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any notes about the settlement..."
              />
            </div>

            <Button type="submit" className="hero-button w-full">
              <Receipt className="w-4 h-4 mr-2" />
              Record Settlement
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Settlement History ({settlements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {settlements.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No settlements recorded yet</p>
          ) : (
            <div className="space-y-3">
              {settlements
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(settlement => {
                  const fromPerson = getPersonById(people, settlement.fromPersonId);
                  const toPerson = getPersonById(people, settlement.toPersonId);
                  
                  return (
                    <div key={settlement.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {fromPerson && <GenderIcon gender={fromPerson.gender} />}
                          <span className="font-medium">{fromPerson?.name || 'Unknown'}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          {toPerson && <GenderIcon gender={toPerson.gender} />}
                          <span className="font-medium">{toPerson?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">{formatCurrency(settlement.amount)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteSettlement(settlement.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Date: {new Date(settlement.date).toLocaleDateString('vi-VN')}</p>
                        {settlement.note && <p>Note: {settlement.note}</p>}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};