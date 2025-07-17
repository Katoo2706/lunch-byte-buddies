import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Users, Crown } from 'lucide-react';
import { Person } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';

interface PeopleProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onDeletePerson: (personId: string) => void;
  onUpdatePerson: (personId: string, updates: Partial<Person>) => void;
}

export const People = ({ people, onAddPerson, onDeletePerson, onUpdatePerson }: PeopleProps) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isDefaultPayer, setIsDefaultPayer] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    // If setting as default payer, remove default from others
    let shouldBeDefaultPayer = isDefaultPayer;
    if (isDefaultPayer && people.some(p => p.isDefaultPayer)) {
      // Remove default from current default payer
      const currentDefault = people.find(p => p.isDefaultPayer);
      if (currentDefault) {
        onUpdatePerson(currentDefault.id, { isDefaultPayer: false });
      }
    }
    
    onAddPerson({
      name: name.trim(),
      gender,
      isDefaultPayer: shouldBeDefaultPayer
    });
    
    // Reset form
    setName('');
    setGender('male');
    setIsDefaultPayer(false);
  };

  const handleSetDefaultPayer = (personId: string) => {
    // Remove default from current default payer
    const currentDefault = people.find(p => p.isDefaultPayer);
    if (currentDefault && currentDefault.id !== personId) {
      onUpdatePerson(currentDefault.id, { isDefaultPayer: false });
    }
    
    // Set new default payer
    onUpdatePerson(personId, { isDefaultPayer: true });
  };

  return (
    <div className="space-y-6">
      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Person
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter person's name"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(value: 'male' | 'female') => setGender(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    <div className="flex items-center gap-2">
                      <GenderIcon gender="male" />
                      Male
                    </div>
                  </SelectItem>
                  <SelectItem value="female">
                    <div className="flex items-center gap-2">
                      <GenderIcon gender="female" />
                      Female
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultPayer"
                checked={isDefaultPayer}
                onCheckedChange={(checked) => setIsDefaultPayer(checked as boolean)}
              />
              <Label htmlFor="defaultPayer" className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-accent" />
                Set as default payer
              </Label>
            </div>

            <Button type="submit" className="hero-button w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Person
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lunch-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            People ({people.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {people.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No people added yet</p>
          ) : (
            <div className="space-y-2">
              {people.map(person => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <GenderIcon gender={person.gender} />
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {person.name}
                        {person.isDefaultPayer && (
                          <Crown className="w-4 h-4 text-accent" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">{person.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!person.isDefaultPayer && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefaultPayer(person.id)}
                        title="Set as default payer"
                      >
                        <Crown className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePerson(person.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};