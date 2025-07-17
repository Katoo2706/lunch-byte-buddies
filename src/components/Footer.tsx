import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { exportData, importData } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

interface FooterProps {
  onDataImport: () => void;
}

export const Footer = ({ onDataImport }: FooterProps) => {
  const { toast } = useToast();

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
    <footer className="mt-12 border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
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
    </footer>
  );
};