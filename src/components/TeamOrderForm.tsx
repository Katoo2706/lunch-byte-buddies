import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, UserPlus } from 'lucide-react';
import { Person, LunchOrder } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { TeamOrderLine, TeamOrderLineData } from './TeamOrderLine';
import { getDefaultPayer } from '@/utils/calculations';

interface TeamOrderFormProps {
  people: Person[];
  date: string;
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
}

export const TeamOrderForm = ({ people, date, onAddOrder }: TeamOrderFormProps) => {
  const [teamLines, setTeamLines] = useState<TeamOrderLineData[]>([]);
  const [selectedPayer, setSelectedPayer] = useState('');
  const [note, setNote] = useState('');

  const defaultPayer = getDefaultPayer(people);

  const generateLineId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addTeamLine = () => {
    setTeamLines(prev => [...prev, {
      id: generateLineId(),
      personId: '',
      price: 40000,
      customPrice: ''
    }]);
  };

  const updateTeamLine = (id: string, updates: Partial<TeamOrderLineData>) => {
    setTeamLines(prev => prev.map(line => 
      line.id === id ? { ...line, ...updates } : line
    ));
  };

  const deleteTeamLine = (id: string) => {
    setTeamLines(prev => prev.filter(line => line.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayer || teamLines.length === 0) return;
    
    // Validate all lines have person and valid price
    const validLines = teamLines.filter(line => {
      const finalPrice = line.price === 0 ? parseInt(line.customPrice) || 0 : line.price;
      return line.personId && finalPrice > 0;
    });

    if (validLines.length === 0) return;

    // Create individual orders for each team member
    validLines.forEach(line => {
      const finalPrice = line.price === 0 ? parseInt(line.customPrice) || 0 : line.price;
      
      onAddOrder({
        personId: line.personId,
        date,
        price: finalPrice,
        payerId: selectedPayer,
        note: note.trim() || undefined,
        isTeamOrder: true,
        teamMembers: validLines.map(l => l.personId)
      });
    });
    
    // Reset form
    setTeamLines([]);
    setNote('');
    // Keep payer for convenience
  };

  const totalAmount = teamLines.reduce((sum, line) => {
    const finalPrice = line.price === 0 ? parseInt(line.customPrice) || 0 : line.price;
    return sum + finalPrice;
  }, 0);

  return (
    <Card className="lunch-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Members Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTeamLine}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Person
              </Button>
            </div>
            
            {teamLines.length === 0 ? (
              <div className="text-center p-6 bg-muted rounded-lg text-muted-foreground">
                No team members added yet. Click "Add Person" to start.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 items-center text-sm font-medium text-muted-foreground px-3">
                  <div className="col-span-4">Person</div>
                  <div className="col-span-6">Price</div>
                  <div className="col-span-2">Action</div>
                </div>
                
                {/* Team Lines */}
                {teamLines.map(line => (
                  <TeamOrderLine
                    key={line.id}
                    data={line}
                    people={people}
                    onUpdate={updateTeamLine}
                    onDelete={deleteTeamLine}
                  />
                ))}
                
                {/* Total */}
                <div className="flex justify-end p-3 bg-primary/5 rounded-lg">
                  <div className="font-semibold">
                    Total: {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(totalAmount)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payer Selection */}
          <div>
            <Label htmlFor="team-payer">Who's Paying?</Label>
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

          {/* Note */}
          <div>
            <Label htmlFor="team-note">Note (Optional)</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about the team order..."
            />
          </div>

          <Button 
            type="submit" 
            className="hero-button w-full" 
            disabled={teamLines.length === 0 || !selectedPayer}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Order ({teamLines.length} people)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
