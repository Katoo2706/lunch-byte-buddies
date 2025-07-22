import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { Person } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';

export interface TeamOrderLineData {
  id: string;
  personId: string;
  price: number;
  customPrice: string;
}

interface TeamOrderLineProps {
  data: TeamOrderLineData;
  people: Person[];
  onUpdate: (id: string, updates: Partial<TeamOrderLineData>) => void;
  onDelete: (id: string) => void;
}

export const TeamOrderLine = ({ data, people, onUpdate, onDelete }: TeamOrderLineProps) => {
  const handlePriceSelect = (price: number) => {
    onUpdate(data.id, { price, customPrice: '' });
  };

  const handleCustomPriceChange = (customPrice: string) => {
    onUpdate(data.id, { customPrice, price: 0 });
  };

  return (
    <div className="grid grid-cols-12 gap-3 items-center p-3 bg-muted rounded-lg">
      {/* Person Selection - 4 columns */}
      <div className="col-span-4">
        <Select 
          value={data.personId} 
          onValueChange={(personId) => onUpdate(data.id, { personId })}
        >
          <SelectTrigger className="h-9">
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

      {/* Price Buttons - 6 columns */}
      <div className="col-span-6 grid grid-cols-3 gap-1">
        <Button
          type="button"
          variant={data.price === 40000 ? "default" : "outline"}
          onClick={() => handlePriceSelect(40000)}
          className="h-9 text-xs px-2"
        >
          40k
        </Button>
        <Button
          type="button"
          variant={data.price === 45000 ? "default" : "outline"}
          onClick={() => handlePriceSelect(45000)}
          className="h-9 text-xs px-2"
        >
          45k
        </Button>
        <div className="relative">
          <Button
            type="button"
            variant={data.price === 0 ? "default" : "outline"}
            onClick={() => handlePriceSelect(0)}
            className="h-9 text-xs px-2 w-full"
          >
            Custom
          </Button>
          {data.price === 0 && (
            <Input
              type="number"
              placeholder="Amount"
              value={data.customPrice}
              onChange={(e) => handleCustomPriceChange(e.target.value)}
              className="h-9 mt-1 text-sm"
            />
          )}
        </div>
      </div>

      {/* Delete Button - 2 columns */}
      <div className="col-span-2 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(data.id)}
          className="text-destructive hover:text-destructive h-9 w-9 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};