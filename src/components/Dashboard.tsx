import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, Receipt, Download, Upload } from 'lucide-react';
import { Person, Balance } from '@/types/lunch';
import { GenderIcon } from './GenderIcon';
import { formatCurrency, getPersonById } from '@/utils/calculations';
import { exportData, importData } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  people: Person[];
  balances: Balance[];
  totalOrders: number;
  totalSettlements: number;
  onDataImport: () => void;
}

export const Dashboard = ({ 
  people, 
  balances, 
  totalOrders, 
  totalSettlements,
  onDataImport 
}: DashboardProps) => {
  const { toast } = useToast();

  const positiveBalances = balances.filter(b => b.amount > 0);
  const negativeBalances = balances.filter(b => b.amount < 0);
  
  const totalOwed = positiveBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalOwing = Math.abs(negativeBalances.reduce((sum, b) => sum + b.amount, 0));

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lunch-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported successfully",
        description: "Your lunch data has been downloaded as a JSON file."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            if (importData(content)) {
              onDataImport();
              toast({
                title: "Data imported successfully",
                description: "Your lunch data has been imported."
              });
            } else {
              throw new Error('Invalid file format');
            }
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Please check that you've selected a valid JSON file.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

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

      {/* Data Management */}
      <Card className="lunch-card">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleExport}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button 
              onClick={handleImport}
              variant="outline"
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Export your data as a JSON file for backup or import data from a previous export.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};