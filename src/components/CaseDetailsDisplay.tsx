import { CaseDetails } from '@/types/court';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Calendar, Users, FileText, Clock, Scale } from 'lucide-react';
import { CourtDataService } from '@/services/courtService';

interface CaseDetailsDisplayProps {
  caseDetails: CaseDetails;
}

export const CaseDetailsDisplay = ({ caseDetails }: CaseDetailsDisplayProps) => {
  const courtService = CourtDataService.getInstance();

  const handleDownload = async (url: string, title: string) => {
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    await courtService.downloadDocument(url, filename);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'secondary';
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'disposed': return 'success';
      case 'dismissed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getOrderTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'primary';
      case 'judgment': return 'success';
      case 'notice': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Case Header */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-legal-accent" />
              <div>
                <CardTitle className="text-2xl text-legal-accent">
                  Case No. {caseDetails.caseNumber}
                </CardTitle>
                <p className="text-muted-foreground">
                  {caseDetails.caseType} • {caseDetails.court}
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(caseDetails.status) as any} className="text-sm">
              {caseDetails.status || 'Unknown Status'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Filing Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {caseDetails.filingDate || 'Not available'}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Next Hearing</p>
                <p className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {caseDetails.nextHearingDate || 'Not scheduled'}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Last Order</p>
                <p className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {caseDetails.lastOrderDate || 'Not available'}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Case Type</p>
                <p>{caseDetails.caseType}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parties */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Parties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                Petitioner(s)/Plaintiff(s)
              </h4>
              <div className="space-y-1">
                {caseDetails.parties.petitioner.map((party, index) => (
                  <p key={index} className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    {party}
                  </p>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                Respondent(s)/Defendant(s)
              </h4>
              <div className="space-y-1">
                {caseDetails.parties.respondent.map((party, index) => (
                  <p key={index} className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                    {party}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders and Judgments */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Orders & Judgments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {caseDetails.orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No orders or judgments available for this case.
            </p>
          ) : (
            <div className="space-y-3">
              {caseDetails.orders.map((order, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    order.isLatest 
                      ? 'bg-accent/10 border-accent/30 ring-1 ring-accent/20' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={getOrderTypeColor(order.type) as any}
                          className="text-xs"
                        >
                          {order.type.toUpperCase()}
                        </Badge>
                        {order.isLatest && (
                          <Badge variant="accent" className="text-xs">
                            LATEST
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{order.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Date: {order.date}
                      </p>
                    </div>
                    
                    {order.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(order.url!, order.title)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Data Preview (for development) */}
      {caseDetails.rawData && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Source URL:</p>
                  <p className="text-muted-foreground break-all">
                    {caseDetails.rawData.source_url}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Scraped At:</p>
                  <p className="text-muted-foreground">
                    {new Date(caseDetails.rawData.scraped_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};