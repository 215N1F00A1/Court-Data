import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DatabaseService, QueryLog } from '@/services/databaseService';
import { BarChart3, History, TrendingUp, Trash2, FileText, Calendar, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QueryHistoryDashboard = () => {
  const { toast } = useToast();
  const [queryHistory, setQueryHistory] = useState<QueryLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const databaseService = DatabaseService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [history, statistics] = await Promise.all([
        databaseService.getQueryHistory(20),
        databaseService.getQueryStats()
      ]);
      
      setQueryHistory(history);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await databaseService.clearHistory();
      await loadData();
      toast({
        title: "History Cleared",
        description: "All query history has been cleared successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl space-y-6">
        <div className="animate-pulse space-y-4">
          <Card className="h-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-48" />
            <Card className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Dashboard Header */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-legal-accent" />
              <div>
                <CardTitle className="text-2xl text-legal-accent">
                  Query Dashboard
                </CardTitle>
                <p className="text-muted-foreground">
                  Track your case search history and statistics
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Queries</p>
                  <p className="text-2xl font-bold">{stats.totalQueries}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-success">{stats.successfulQueries}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courts Used</p>
                  <p className="text-2xl font-bold">{stats.popularCourts.length}</p>
                </div>
                <Scale className="h-8 w-8 text-legal-accent" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Courts */}
        {stats && stats.popularCourts.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Popular Courts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularCourts.map((court: any, index: number) => (
                  <div key={court.court} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{court.court}</span>
                    </div>
                    <Badge variant="secondary">{court.count} queries</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Case Types */}
        {stats && stats.popularCaseTypes.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Popular Case Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.popularCaseTypes.map((caseType: any, index: number) => (
                  <div key={caseType.caseType} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="text-sm">{caseType.caseType}</span>
                    </div>
                    <Badge variant="secondary">{caseType.count} queries</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Query History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Query History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queryHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No queries found</p>
              <p className="text-sm text-muted-foreground">
                Start searching for cases to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {queryHistory.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={(log.success ? 'success' : 'destructive') as any}
                        className="text-xs"
                      >
                        {log.success ? 'SUCCESS' : 'FAILED'}
                      </Badge>
                      <span className="text-sm font-medium">
                        {log.caseType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Case No.</p>
                      <p className="font-mono">{log.caseNumber}/{log.filingYear}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Court</p>
                      <p className="truncate">{log.court}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="truncate">{log.caseType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className={log.success ? 'text-success' : 'text-destructive'}>
                        {log.success ? 'Retrieved' : 'Failed'}
                      </p>
                    </div>
                  </div>
                  
                  {log.error && (
                    <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      {log.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};