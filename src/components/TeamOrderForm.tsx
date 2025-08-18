import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, UserPlus, CalendarIcon } from 'lucide-react';
import { Person, LunchOrder } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { TeamOrderLine, TeamOrderLineData } from './TeamOrderLine';
import { getDefaultPayer } from '@/utils/calculations';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const teamOrderSchema = z.object({
  personId: z.string({
    required_error: 'Please select a team member',
  }),
  dish: z.string().min(2, {
    message: 'Dish must be at least 2 characters',
  }),
  price: z.coerce
    .number()
    .min(1000, { message: 'Price must be at least 1,000 VND' }),
  notes: z.string().optional(),
});

type TeamOrderFormValues = z.infer<typeof teamOrderSchema>;

interface TeamOrderFormProps {
  people: Person[];
  date: string;
  onDateChange: (date: string) => void;
  onAddOrder: (order: Omit<LunchOrder, 'id'>) => void;
}

export function TeamOrderForm({
  people,
  date,
  onDateChange,
  onAddOrder
}: TeamOrderFormProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [teamLines, setTeamLines] = useState<TeamOrderLineData[]>([]);
  const [selectedPayer, setSelectedPayer] = useState('');
  const [note, setNote] = useState('');

  // Parse date string to Date object for display purposes only
  const dateObject = date ? new Date(date) : new Date();
  // Ensure proper timezone handling by setting hours to noon
  dateObject.setHours(12, 0, 0, 0);

  const defaultPayer = getDefaultPayer(people);

  useEffect(() => {
    // Initialize payer when component mounts or people changes
    if (defaultPayer && !selectedPayer) {
      setSelectedPayer(defaultPayer.id);
    }
  }, [defaultPayer, people]);

  // Handle date changes from the calendar
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Fix timezone issues by setting to noon before formatting
      newDate.setHours(12, 0, 0, 0);

      // Format date as YYYY-MM-DD, ensuring local timezone is respected
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      onDateChange(formattedDate);
    }
  };

  const form = useForm<TeamOrderFormValues>({
    resolver: zodResolver(teamOrderSchema),
    defaultValues: {
      dish: '',
      price: 0,
      notes: '',
    },
  });

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
    
    if (!selectedPayer || teamLines.length === 0 || !date) return;

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

  const handlePersonChange = (personId: string) => {
    const person = people.find((p) => p.id === personId);
    setSelectedPerson(person || null);
    form.setValue('personId', personId);
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
          {/* Date Picker */}
          <div>
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(dateObject, "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateObject}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

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
            disabled={teamLines.length === 0 || !selectedPayer || !date}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Order ({teamLines.length} people)
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
