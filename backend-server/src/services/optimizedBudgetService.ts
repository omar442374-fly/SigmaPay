/**
 * Optimized Budget Service with Low-Latency Design Patterns
 * CSE352 Extracurricular Assignment - Andrew
 * 
 * Implements 5 low-latency patterns:
 * 1. Result Memoization
 * 2. Object Pooling
 * 3. Lazy Evaluation
 * 4. Pre-computed Constants
 * 5. Fast-Path Optimization
 */

import { IBudgetPlan, IMoney } from '../domain/entities';

// Pre-computed Constants Pattern (Pattern #4)
const MS_PER_DAY = 86400000;
const DAYS_PER_MONTH = 30;

const CATEGORY_MAP = Object.freeze({
  'groceries': 0,
  'dining': 1,
  'transportation': 2,
  'entertainment': 3,
  'utilities': 4,
  'healthcare': 5,
  'shopping': 6,
  'other': 7
});

const BUDGET_STATES = Object.freeze({
  UNDER_BUDGET: { status: 'under', color: 'green' },
  NEAR_LIMIT: { status: 'near', color: 'yellow' },
  OVER_BUDGET: { status: 'over', color: 'red' }
});

/**
 * Budget Calculator - Used with Object Pooling
 */
class BudgetCalculator {
  private spent: number = 0;
  private budget: number = 0;
  private categories: string[] = [];

  initialize(budget: number, categories: string[]): void {
    this.budget = budget;
    this.categories = categories;
    this.spent = 0;
  }

  addSpending(amount: number): void {
    this.spent += amount;
  }

  getPercentage(): number {
    return this.budget > 0 ? (this.spent / this.budget) * 100 : 0;
  }

  getRemaining(): number {
    return this.budget - this.spent;
  }

  reset(): void {
    this.spent = 0;
    this.budget = 0;
    this.categories = [];
  }
}

/**
 * Budget Status with Lazy Evaluation (Pattern #3)
 */
class BudgetStatus {
  private _spent: IMoney | null = null;
  private _remaining: IMoney | null = null;
  private _percentage: number | null = null;
  private _daysRemaining: number | null = null;

  constructor(
    private budgetPlan: IBudgetPlan,
    private spendingData: any[]
  ) {}

  // Lazy getter for spent amount
  get spent(): IMoney {
    if (this._spent === null) {
      this._spent = this.calculateSpent();
    }
    return this._spent;
  }

  // Lazy getter for remaining amount
  get remaining(): IMoney {
    if (this._remaining === null) {
      this._remaining = {
        amount: this.budgetPlan.totalAmount.amount - this.spent.amount,
        currency: this.budgetPlan.totalAmount.currency
      };
    }
    return this._remaining;
  }

  // Lazy getter for percentage
  get percentage(): number {
    if (this._percentage === null) {
      const total = this.budgetPlan.totalAmount.amount;
      this._percentage = total > 0 ? (this.spent.amount / total) * 100 : 0;
    }
    return this._percentage;
  }

  // Lazy getter for days remaining
  get daysRemaining(): number {
    if (this._daysRemaining === null) {
      const endTime = new Date(this.budgetPlan.endDate).getTime();
      this._daysRemaining = Math.floor((endTime - Date.now()) / MS_PER_DAY);
    }
    return this._daysRemaining;
  }

  private calculateSpent(): IMoney {
    const total = this.spendingData.reduce((sum, item) => sum + (item.amount || 0), 0);
    return {
      amount: total,
      currency: this.budgetPlan.totalAmount.currency
    };
  }

  toJSON() {
    return {
      budgetId: this.budgetPlan.budgetId,
      spent: this.spent,
      remaining: this.remaining,
      percentage: this.percentage,
      daysRemaining: this.daysRemaining,
      status: this.getStatus()
    };
  }

  private getStatus() {
    const pct = this.percentage;
    if (pct >= 100) return BUDGET_STATES.OVER_BUDGET;
    if (pct >= 80) return BUDGET_STATES.NEAR_LIMIT;
    return BUDGET_STATES.UNDER_BUDGET;
  }
}

/**
 * Optimized Budget Service
 * Implements all 5 low-latency patterns
 */
export class OptimizedBudgetService {
  // Pattern #1: Result Memoization
  private statusCache = new Map<string, { result: any; expires: number }>();
  private readonly CACHE_TTL = 120000; // 120 seconds

  // Pattern #2: Object Pooling
  private calculatorPool: BudgetCalculator[] = [];
  private readonly POOL_SIZE = 20;

  // In-memory storage (would be database in production)
  private budgets = new Map<string, IBudgetPlan>();
  private spending = new Map<string, any[]>();

  constructor() {
    // Initialize calculator pool
    for (let i = 0; i < this.POOL_SIZE; i++) {
      this.calculatorPool.push(new BudgetCalculator());
    }
  }

  /**
   * Create a new budget
   * Uses Fast-Path Optimization (Pattern #5)
   */
  createBudget(budgetData: IBudgetPlan): any {
    // Fast-path validation - reject invalid requests early
    if (!budgetData.userId || !budgetData.totalAmount) {
      return { error: 'Invalid budget data: missing required fields' };
    }

    if (budgetData.totalAmount.amount <= 0) {
      return { error: 'Invalid budget amount: must be positive' };
    }

    if (!budgetData.startDate || !budgetData.endDate) {
      return { error: 'Invalid dates: start and end date required' };
    }

    // Generate ID (in production, would use database)
    const budgetId = `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const budget: IBudgetPlan = {
      ...budgetData,
      budgetId
    };

    this.budgets.set(budgetId, budget);
    this.spending.set(budgetId, []);

    return {
      budgetId,
      status: 'created',
      message: 'Budget created successfully'
    };
  }

  /**
   * Get budget status with caching
   * Uses Result Memoization (Pattern #1)
   */
  getBudgetStatus(budgetId: string): any {
    // Fast-path validation
    if (!budgetId) {
      return { error: 'Budget ID required' };
    }

    // Check cache first (Pattern #1)
    const cacheKey = `status_${budgetId}`;
    const cached = this.statusCache.get(cacheKey);

    if (cached && Date.now() < cached.expires) {
      // Cache hit - return immediately
      return { ...cached.result, cached: true };
    }

    // Cache miss - calculate status
    const budget = this.budgets.get(budgetId);
    if (!budget) {
      return { error: 'Budget not found' };
    }

    const spendingData = this.spending.get(budgetId) || [];
    
    // Use lazy evaluation (Pattern #3)
    const status = new BudgetStatus(budget, spendingData);
    const result = status.toJSON();

    // Store in cache
    this.statusCache.set(cacheKey, {
      result,
      expires: Date.now() + this.CACHE_TTL
    });

    return { ...result, cached: false };
  }

  /**
   * Calculate spending with object pooling
   * Uses Object Pooling (Pattern #2)
   */
  private calculateSpendingWithPool(
    budgetAmount: number,
    categories: string[],
    transactions: any[]
  ): any {
    // Acquire calculator from pool
    const calculator = this.calculatorPool.pop() || new BudgetCalculator();

    try {
      calculator.initialize(budgetAmount, categories);

      // Calculate spending
      for (const tx of transactions) {
        calculator.addSpending(tx.amount);
      }

      const result = {
        percentage: calculator.getPercentage(),
        remaining: calculator.getRemaining()
      };

      return result;
    } finally {
      // Return calculator to pool
      calculator.reset();
      if (this.calculatorPool.length < this.POOL_SIZE) {
        this.calculatorPool.push(calculator);
      }
    }
  }

  /**
   * Get category index using pre-computed map
   * Uses Pre-computed Constants (Pattern #4)
   */
  getCategoryIndex(category: string): number {
    return CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] ?? -1;
  }

  /**
   * Calculate days remaining using pre-computed constant
   * Uses Pre-computed Constants (Pattern #4)
   */
  getDaysRemaining(endDate: string): number {
    const endTime = new Date(endDate).getTime();
    return Math.floor((endTime - Date.now()) / MS_PER_DAY);
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.statusCache.entries()) {
      if (now >= value.expires) {
        this.statusCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return {
      size: this.statusCache.size,
      poolSize: this.calculatorPool.length,
      maxPoolSize: this.POOL_SIZE,
      cacheTTL: this.CACHE_TTL
    };
  }
}

// Export singleton instance
export const optimizedBudgetService = new OptimizedBudgetService();
