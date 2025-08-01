import { CaseQuery, CaseDetails } from '@/types/court';
import { v4 as uuidv4 } from 'uuid';

export interface QueryLog {
  id: string;
  caseType: string;
  caseNumber: string;
  filingYear: string;
  court: string;
  timestamp: Date;
  success: boolean;
  rawResponse?: any;
  error?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private queryLogs: QueryLog[] = [];

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async logQuery(query: CaseQuery, success: boolean, result?: CaseDetails, error?: string): Promise<void> {
    const logEntry: QueryLog = {
      id: uuidv4(),
      caseType: query.caseType,
      caseNumber: query.caseNumber,
      filingYear: query.filingYear,
      court: query.court,
      timestamp: new Date(),
      success,
      rawResponse: result,
      error,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // Would be set server-side in real implementation
    };

    // Store in localStorage for demo (in real app, use Supabase)
    this.queryLogs.push(logEntry);
    this.saveToLocalStorage();
    
    console.log('📊 Query logged:', logEntry);
  }

  async getQueryHistory(limit: number = 10): Promise<QueryLog[]> {
    this.loadFromLocalStorage();
    return this.queryLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getQueryStats(): Promise<{
    totalQueries: number;
    successfulQueries: number;
    successRate: number;
    popularCourts: { court: string; count: number }[];
    popularCaseTypes: { caseType: string; count: number }[];
  }> {
    this.loadFromLocalStorage();
    
    const totalQueries = this.queryLogs.length;
    const successfulQueries = this.queryLogs.filter(log => log.success).length;
    const successRate = totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;

    // Calculate popular courts
    const courtCounts: { [key: string]: number } = {};
    const caseTypeCounts: { [key: string]: number } = {};

    this.queryLogs.forEach(log => {
      courtCounts[log.court] = (courtCounts[log.court] || 0) + 1;
      caseTypeCounts[log.caseType] = (caseTypeCounts[log.caseType] || 0) + 1;
    });

    const popularCourts = Object.entries(courtCounts)
      .map(([court, count]) => ({ court, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const popularCaseTypes = Object.entries(caseTypeCounts)
      .map(([caseType, count]) => ({ caseType, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalQueries,
      successfulQueries,
      successRate,
      popularCourts,
      popularCaseTypes
    };
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('court_query_logs', JSON.stringify(this.queryLogs));
    } catch (error) {
      console.warn('Failed to save query logs to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('court_query_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.queryLogs = parsed.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load query logs from localStorage:', error);
      this.queryLogs = [];
    }
  }

  async clearHistory(): Promise<void> {
    this.queryLogs = [];
    localStorage.removeItem('court_query_logs');
    console.log('🗑️ Query history cleared');
  }
}