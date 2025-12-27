import { IReport, ITransaction } from '../domain/entities';
import { IReportingService } from '../domain/serviceInterfaces';
import { ITransactionRepository } from '../domain/repositoryInterfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Optimized Reporting Service with Low-Latency Design Patterns
 * 
 * Low-Latency Patterns Implemented:
 * 1. Cache-Aside Pattern - Cache frequently accessed reports
 * 2. Facade Pattern - Unified interface for reporting operations
 * 3. Flyweight Pattern - Share immutable report metadata
 * 4. Lazy Evaluation - Defer expensive calculations
 * 5. Pre-aggregation - Cache computed summaries
 */

interface CachedReport {
  report: string;
  timestamp: number;
  computationTime: number;
}

interface ReportMetadata {
  reportType: string;
  template: string;
  headers: string[];
}

interface AggregatedData {
  userId: string;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
  lastUpdated: number;
}

export class OptimizedReportingService implements IReportingService {
  // PATTERN 1: Cache-Aside - Cache generated reports
  private reportCache: Map<string, CachedReport> = new Map();
  private readonly CACHE_TTL = 120000; // 2 minutes for reports
  
  // PATTERN 2: Pre-aggregated data cache
  private aggregationCache: Map<string, AggregatedData> = new Map();
  private readonly AGGREGATION_TTL = 60000; // 1 minute for aggregations
  
  // PATTERN 3: Flyweight - Shared immutable metadata
  private static readonly REPORT_METADATA: Map<string, ReportMetadata> = new Map([
    ['income', {
      reportType: 'Income Statement',
      template: 'income_template',
      headers: ['Date', 'Category', 'Amount', 'Balance']
    }],
    ['monthly', {
      reportType: 'Monthly Summary',
      template: 'monthly_template',
      headers: ['Month', 'Total Transactions', 'Total Amount', 'Categories']
    }],
    ['yearly', {
      reportType: 'Yearly Report',
      template: 'yearly_template',
      headers: ['Year', 'Income', 'Expenses', 'Net']
    }]
  ]);

  // Pre-computed common strings
  private readonly CURRENCY_SYMBOL = '$';
  private readonly REPORT_HEADER = 'SigmaPay Financial Report';

  constructor(private transactionRepository: ITransactionRepository) {
    // Initialize with warm cache for common report types
    this.warmUpCache();
  }

  /**
   * PATTERN 1: Cache-Aside - Warm up cache with common patterns
   */
  private warmUpCache(): void {
    // Pre-warm cache could be done here for frequently accessed users
    // In production, this would load from a distributed cache like Redis
  }

  /**
   * PATTERN 1: Cache-Aside - Check if cached report is still valid
   */
  private getCachedReport(cacheKey: string): string | null {
    const cached = this.reportCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.report;
    }
    // Remove stale cache entry
    if (cached) {
      this.reportCache.delete(cacheKey);
    }
    return null;
  }

  /**
   * PATTERN 1: Cache-Aside - Store generated report
   */
  private setCachedReport(cacheKey: string, report: string, computationTime: number): void {
    this.reportCache.set(cacheKey, {
      report,
      timestamp: Date.now(),
      computationTime
    });
  }

  /**
   * PATTERN 2: Pre-aggregation - Get or compute aggregated data
   */
  private getAggregatedData(userId: string): AggregatedData {
    const cached = this.aggregationCache.get(userId);
    if (cached && Date.now() - cached.lastUpdated < this.AGGREGATION_TTL) {
      return cached;
    }

    // Compute aggregation
    const transactions = this.transactionRepository.findByUserId(userId);
    const aggregated: AggregatedData = {
      userId,
      totalIncome: transactions
        .filter((t) => t.category === 'income')
        .reduce((sum, t) => sum + t.amount.amount, 0),
      totalExpenses: transactions
        .filter((t) => t.category !== 'income')
        .reduce((sum, t) => sum + t.amount.amount, 0),
      transactionCount: transactions.length,
      lastUpdated: Date.now()
    };

    this.aggregationCache.set(userId, aggregated);
    return aggregated;
  }

  /**
   * PATTERN 4: Lazy Evaluation - Generate report only when needed
   * PATTERN 1: Cache-Aside - Use cached result if available
   */
  generateIncomeStatement(userId: string): string {
    const cacheKey = `income_${userId}`;
    
    // Check cache first
    const cached = this.getCachedReport(cacheKey);
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    
    // Use pre-aggregated data
    const aggregated = this.getAggregatedData(userId);
    const net = aggregated.totalIncome - aggregated.totalExpenses;

    // PATTERN 3: Use Flyweight metadata
    const metadata = OptimizedReportingService.REPORT_METADATA.get('income')!;
    
    // Fast string concatenation using template literals
    const report = `${this.REPORT_HEADER}
${metadata.reportType} for User ${userId}
Generated: ${new Date().toISOString()}
----------------------------------------
Total Income:    ${this.CURRENCY_SYMBOL}${aggregated.totalIncome.toFixed(2)}
Total Expenses:  ${this.CURRENCY_SYMBOL}${aggregated.totalExpenses.toFixed(2)}
----------------------------------------
Net Balance:     ${this.CURRENCY_SYMBOL}${net.toFixed(2)}
Transaction Count: ${aggregated.transactionCount}`;

    const computationTime = Date.now() - startTime;
    
    // Cache the result
    this.setCachedReport(cacheKey, report, computationTime);
    
    return report;
  }

  /**
   * PATTERN 4: Lazy Evaluation - Generate summary only when needed
   * PATTERN 1: Cache-Aside - Use cached result if available
   */
  generateMonthlySummary(userId: string): string {
    const cacheKey = `monthly_${userId}`;
    
    // Check cache first
    const cached = this.getCachedReport(cacheKey);
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    
    // Use pre-aggregated data
    const aggregated = this.getAggregatedData(userId);
    
    // Get transaction details for category breakdown
    const transactions = this.transactionRepository.findByUserId(userId);
    const categories = new Set(transactions.map(t => t.category));
    
    // PATTERN 3: Use Flyweight metadata
    const metadata = OptimizedReportingService.REPORT_METADATA.get('monthly')!;
    
    const report = `${this.REPORT_HEADER}
${metadata.reportType} for User ${userId}
Generated: ${new Date().toISOString()}
----------------------------------------
Total Transactions: ${aggregated.transactionCount}
Total Spent:        ${this.CURRENCY_SYMBOL}${(aggregated.totalIncome + aggregated.totalExpenses).toFixed(2)}
Categories:         ${categories.size}
Average per Transaction: ${this.CURRENCY_SYMBOL}${(aggregated.totalExpenses / Math.max(aggregated.transactionCount, 1)).toFixed(2)}`;

    const computationTime = Date.now() - startTime;
    
    // Cache the result
    this.setCachedReport(cacheKey, report, computationTime);
    
    return report;
  }

  /**
   * PATTERN 2: Facade - Unified interface for report generation
   */
  generateReport(filter: any, type: string): IReport | null {
    const reportId = uuidv4();
    let content = '';
    
    // Use lazy evaluation - only compute if needed
    if (type === 'income' && filter.userId) {
      content = this.generateIncomeStatement(filter.userId);
    } else if (type === 'monthly' && filter.userId) {
      content = this.generateMonthlySummary(filter.userId);
    } else {
      content = 'Report type not supported';
    }

    return {
      reportId,
      userId: filter.userId || 'unknown',
      reportType: type,
      generatedAt: new Date().toISOString(),
      content
    };
  }

  /**
   * Export to PDF - placeholder for binary export
   */
  exportToPDF(report: IReport): Buffer {
    // In production, this would use a PDF generation library
    return Buffer.from(report.content);
  }

  /**
   * Get cache statistics for monitoring
   */
  public getCacheStats(): { reportCacheSize: number; aggregationCacheSize: number; hitRate: number } {
    return {
      reportCacheSize: this.reportCache.size,
      aggregationCacheSize: this.aggregationCache.size,
      hitRate: 0 // Would track hits/misses in production
    };
  }

  /**
   * Clear expired cache entries
   */
  public cleanupCache(): void {
    const now = Date.now();
    
    // Clean report cache
    for (const [key, value] of this.reportCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.reportCache.delete(key);
      }
    }
    
    // Clean aggregation cache
    for (const [key, value] of this.aggregationCache.entries()) {
      if (now - value.lastUpdated > this.AGGREGATION_TTL) {
        this.aggregationCache.delete(key);
      }
    }
  }

  /**
   * Invalidate cache for specific user (e.g., after new transaction)
   */
  public invalidateUserCache(userId: string): void {
    this.reportCache.delete(`income_${userId}`);
    this.reportCache.delete(`monthly_${userId}`);
    this.aggregationCache.delete(userId);
  }
}
