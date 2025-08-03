import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Scale, FileText, Calendar } from 'lucide-react';
import { CaseQuery } from '@/types/court';
import { SUPPORTED_COURTS } from '@/services/courtService';

interface CaseSearchFormProps {
  onSearch: (query: CaseQuery) => void;
  loading?: boolean;
}

export const CaseSearchForm = ({ onSearch, loading = false }: CaseSearchFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CaseQuery>({
    caseType: '',
    caseNumber: '',
    filingYear: '',
    court: ''
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);
  
  const selectedCourt = SUPPORTED_COURTS.find(court => court.name === formData.court);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.caseType || !formData.caseNumber || !formData.filingYear || !formData.court) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields to search for case details.",
        variant: "destructive"
      });
      return;
    }

    // Validate case number format
    if (!/^\d+$/.test(formData.caseNumber)) {
      toast({
        title: "Invalid Case Number",
        description: "Case number should contain only numeric digits.",
        variant: "destructive"
      });
      return;
    }

    onSearch(formData);
  };

  const handleCourtChange = (court: string) => {
    setFormData(prev => ({ ...prev, court, caseType: '' }));
  };

  return (
    <Card className="w-full max-w-2xl shadow-card bg-gradient-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Scale className="h-6 w-6 text-legal-accent" />
          <CardTitle className="text-2xl font-bold text-legal-accent">
            Court Case Search
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Search for case details from Indian courts. Enter the case information below.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Court Selection */}
          <div className="space-y-2">
            <Label htmlFor="court" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Select Court
            </Label>
            <Select value={formData.court} onValueChange={handleCourtChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a court to search" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_COURTS.map((court) => (
                  <SelectItem key={court.name} value={court.name}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="caseType" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Case Type
            </Label>
            <Select 
              value={formData.caseType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, caseType: value }))}
              disabled={!selectedCourt}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedCourt ? "Select case type" : "Select a court first"} />
              </SelectTrigger>
              <SelectContent>
                {selectedCourt?.caseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Case Number */}
            <div className="space-y-2">
              <Label htmlFor="caseNumber" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Case Number
              </Label>
              <Input
                id="caseNumber"
                type="text"
                value={formData.caseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                placeholder="e.g., 1234"
                className="font-mono"
              />
            </div>

            {/* Filing Year */}
            <div className="space-y-2">
              <Label htmlFor="filingYear" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Filing Year
              </Label>
              <Select 
                value={formData.filingYear} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, filingYear: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="legal"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Search className="h-4 w-4 animate-spin" />
                Searching Case...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search Case Details
              </>
            )}
          </Button>

          {/* Case Format Preview */}
          {formData.caseNumber && formData.filingYear && (
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Case Reference:</p>
              <p className="font-mono font-semibold text-lg">
                {formData.caseNumber}/{formData.filingYear}
              </p>
            </div>
          )}
        </form>

        {/* Court Information */}
        {selectedCourt && (
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-accent-foreground mb-2">Court Information</h4>
            <div className="text-sm space-y-1">
              <p><strong>Selected Court:</strong> {selectedCourt.name}</p>
              <p><strong>CAPTCHA Strategy:</strong> {selectedCourt.captchaStrategy === 'manual' ? 'Manual Verification' : 'Automated'}</p>
              <p><strong>Available Case Types:</strong> {selectedCourt.caseTypes.length} types</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};