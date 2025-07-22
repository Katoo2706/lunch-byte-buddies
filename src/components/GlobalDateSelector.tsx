import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

interface GlobalDateSelectorProps {
  date: string;
  onDateChange: (date: string) => void;
}

export const GlobalDateSelector = ({ date, onDateChange }: GlobalDateSelectorProps) => {
  return (
    <Card className="lunch-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Select Date for Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="global-date">Date</Label>
          <Input
            id="global-date"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};