import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Search, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { CaseSearchForm } from './CaseSearchForm';
import { CaseDetailsDisplay } from './CaseDetailsDisplay';
import { CaptchaDialog } from './CaptchaDialog';
import { QueryHistoryDashboard } from './QueryHistoryDashboard';

import { CaseQuery, CaseDetails, ScrapingResult } from '@/types/court';
import { CourtDataService } from '@/services/courtService';
import { DatabaseService } from '@/services/databaseService';
import heroImage from '@/assets/hero-court-data.jpg';

export const CourtDataFetcher = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<CaseQuery | null>(null);
  const [caseDetails, setCaseDetails] = useState<CaseDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // CAPTCHA state
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaImageUrl, setCaptchaImageUrl] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const courtService = CourtDataService.getInstance();
  const databaseService = DatabaseService.getInstance();

  const handleSearch = async (query: CaseQuery, captchaSolution?: string) => {
    setLoading(true);
    setError(null);
    setCurrentQuery(query);
    setCaseDetails(null);

    try {
      console.log('🔍 Starting case search...', query);
      
      const result: ScrapingResult = await courtService.searchCase(query, captchaSolution);
      
      if (result.captchaRequired) {
        console.log('🔐 CAPTCHA required');
        setCaptchaImageUrl(result.captchaImageUrl || '');
        setShowCaptcha(true);
        setLoading(false);
        
        toast({
          title: "CAPTCHA Required",
          description: "Please complete the CAPTCHA verification to continue.",
        });
        return;
      }

      if (result.success && result.data) {
        console.log('✅ Case search successful');
        setCaseDetails(result.data);
        setShowCaptcha(false);
        
        // Log successful query
        await databaseService.logQuery(query, true, result.data);
        
        toast({
          title: "Case Found",
          description: `Successfully retrieved details for case ${query.caseNumber}/${query.filingYear}`,
        });
      } else {
        console.log('❌ Case search failed:', result.error);
        setError(result.error || 'Failed to fetch case details');
        
        // Log failed query
        await databaseService.logQuery(query, false, undefined, result.error);
        
        toast({
          title: "Search Failed",
          description: result.error || "Unable to retrieve case details. Please check the case number and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      if (currentQuery) {
        await databaseService.logQuery(currentQuery, false, undefined, errorMessage);
      }
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaSubmit = async (solution: string) => {
    if (!currentQuery) return;
    
    setCaptchaLoading(true);
    await handleSearch(currentQuery, solution);
    setCaptchaLoading(false);
  };

  const handleCaptchaRefresh = () => {
    // In a real implementation, this would request a new CAPTCHA
    toast({
      title: "CAPTCHA Refreshed",
      description: "A new CAPTCHA has been generated. Please try again.",
    });
  };

  const handleNewSearch = () => {
    setCaseDetails(null);
    setError(null);
    setCurrentQuery(null);
    setShowCaptcha(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative border-b bg-gradient-card overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Scale className="h-10 w-10 text-legal-accent" />
              <h1 className="text-4xl md:text-5xl font-bold text-legal-accent">
                Court Data Fetcher
              </h1>
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              Professional Case Search & Management System
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search case details from Indian courts with CAPTCHA handling, 
              comprehensive error management, and detailed query analytics.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-success" />
                Delhi High Court Support
              </div>
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-success" />
                CAPTCHA Handling
              </div>
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4 text-success" />
                Query Analytics
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Case Search
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-8 space-y-8">
            <div className="flex justify-center">
              {!caseDetails ? (
                <CaseSearchForm onSearch={handleSearch} loading={loading} />
              ) : (
                <div className="w-full max-w-4xl space-y-6">
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={handleNewSearch}
                      className="flex items-center gap-2"
                    >
                      <Search className="h-4 w-4" />
                      Search Another Case
                    </Button>
                  </div>
                  <CaseDetailsDisplay caseDetails={caseDetails} />
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex justify-center">
                <Alert className="max-w-2xl border-destructive/50 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Search Failed:</strong> {error}
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNewSearch}
                        className="mr-2"
                      >
                        Try Again
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Info Section */}
            <div className="flex justify-center">
              <Card className="max-w-4xl w-full shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-accent" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Supported Courts</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Delhi High Court
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Faridabad District Court
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        CAPTCHA Handling
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        PDF Downloads
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Query History Tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Comprehensive Error Handling
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-8">
            <div className="flex justify-center">
              <QueryHistoryDashboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CAPTCHA Dialog */}
      <CaptchaDialog
        open={showCaptcha}
        onOpenChange={setShowCaptcha}
        captchaImageUrl={captchaImageUrl}
        onSubmit={handleCaptchaSubmit}
        onRefresh={handleCaptchaRefresh}
        loading={captchaLoading}
      />
    </div>
  );
};