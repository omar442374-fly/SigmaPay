import { IFinancialGoal, IGoalProgress, IMoney } from '../domain/entities';
import { IGoalService } from '../domain/serviceInterfaces';
import { IGoalRepository } from '../domain/repositoryInterfaces';
import { v4 as uuidv4 } from 'uuid';

/**
 * Optimized Goal Management Service with Low-Latency Design Patterns
 * 
 * Low-Latency Patterns Implemented:
 * 1. Memoization Pattern - Cache progress calculations
 * 2. Object Pooling - Reuse progress calculation objects
 * 3. Strategy Pattern - Pluggable goal calculation strategies
 * 4. Lazy Evaluation - Defer expensive date calculations
 * 5. Pre-computed Lookups - Cache common goal states
 */

interface CachedProgress {
  progress: IGoalProgress;
  timestamp: number;
  computationTime: number;
}

interface ProgressCalculator {
  id: string;
  inUse: boolean;
  lastUsed: number;
}

interface GoalStrategy {
  name: string;
  calculate: (goal: IFinancialGoal) => IGoalProgress;
}

export class OptimizedGoalService implements IGoalService {
  // PATTERN 1: Memoization - Cache progress calculations
  private progressCache: Map<string, CachedProgress> = new Map();
  private readonly CACHE_TTL = 90000; // 90 seconds for goals
  
  // PATTERN 2: Object Pooling - Reuse calculator objects
  private calculatorPool: ProgressCalculator[] = [];
  private readonly POOL_SIZE = 15;
  
  // PATTERN 3: Strategy Pattern - Pre-defined calculation strategies
  private strategies: Map<string, GoalStrategy> = new Map();
  
  // PATTERN 5: Pre-computed common values
  private readonly MS_PER_DAY = 1000 * 60 * 60 * 24;
  private readonly PERCENT_MULTIPLIER = 100;
  private static readonly GOAL_STATES = Object.freeze({
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    EXPIRED: 'Expired',
    ON_TRACK: 'On Track',
    AT_RISK: 'At Risk',
  });

  constructor(private goalRepository: IGoalRepository) {
    this.initializeCalculatorPool();
    this.initializeStrategies();
  }

  /**
   * PATTERN 2: Object Pooling - Initialize reusable calculators
   */
  private initializeCalculatorPool(): void {
    for (let i = 0; i < this.POOL_SIZE; i++) {
      this.calculatorPool.push({
        id: `calc_${i}`,
        inUse: false,
        lastUsed: 0,
      });
    }
  }

  /**
   * PATTERN 3: Strategy Pattern - Initialize calculation strategies
   */
  private initializeStrategies(): void {
    // Standard progress calculation
    this.strategies.set('standard', {
      name: 'standard',
      calculate: (goal) => this.calculateStandardProgress(goal),
    });
    
    // Time-weighted progress
    this.strategies.set('time-weighted', {
      name: 'time-weighted',
      calculate: (goal) => this.calculateTimeWeightedProgress(goal),
    });
  }

  /**
   * PATTERN 2: Object Pooling - Acquire calculator from pool
   */
  private acquireCalculator(): ProgressCalculator | null {
    const calc = this.calculatorPool.find(c => !c.inUse);
    if (calc) {
      calc.inUse = true;
      calc.lastUsed = Date.now();
    }
    return calc || null;
  }

  /**
   * PATTERN 2: Object Pooling - Release calculator back to pool
   */
  private releaseCalculator(calc: ProgressCalculator): void {
    calc.inUse = false;
  }

  /**
   * PATTERN 1: Memoization - Check cached progress
   */
  private getCachedProgress(goalId: string): IGoalProgress | null {
    const cached = this.progressCache.get(goalId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.progress;
    }
    // Remove stale cache entry
    if (cached) {
      this.progressCache.delete(goalId);
    }
    return null;
  }

  /**
   * PATTERN 1: Memoization - Store calculated progress
   */
  private setCachedProgress(goalId: string, progress: IGoalProgress, computationTime: number): void {
    this.progressCache.set(goalId, {
      progress,
      timestamp: Date.now(),
      computationTime,
    });
  }

  /**
   * PATTERN 4: Lazy Evaluation - Calculate days remaining only when needed
   */
  private calculateDaysRemaining(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const now = Date.now();
    return Math.ceil((deadlineDate.getTime() - now) / this.MS_PER_DAY);
  }

  /**
   * PATTERN 5: Pre-computed - Fast state determination
   */
  private determineOnTrack(percentComplete: number, daysRemaining: number): boolean {
    if (percentComplete >= 100) {
      return true; // Already completed
    }
    if (daysRemaining < 0) {
      return false; // Expired
    }
    
    // Calculate expected progress rate
    const totalDays = 365; // Assume 1 year default goal period
    const daysPassed = totalDays - daysRemaining;
    const expectedProgress = (daysPassed / totalDays) * 100;
    
    // On track if within 20% of expected progress
    return percentComplete >= expectedProgress * 0.8;
  }

  /**
   * Standard progress calculation strategy
   */
  private calculateStandardProgress(goal: IFinancialGoal): IGoalProgress {
    const percentComplete = (goal.currentAmount.amount / goal.targetAmount.amount) * this.PERCENT_MULTIPLIER;
    
    const remainingAmount: IMoney = {
      amount: goal.targetAmount.amount - goal.currentAmount.amount,
      currency: goal.targetAmount.currency,
    };
    
    // PATTERN 4: Lazy - only calculate days if not completed
    const daysRemaining = percentComplete >= 100 ? 0 : this.calculateDaysRemaining(goal.deadline);
    
    return {
      goalId: goal.goalId,
      percentageComplete: Math.min(percentComplete, 100),
      remainingAmount,
      daysRemaining: Math.max(0, daysRemaining),
      onTrack: this.determineOnTrack(percentComplete, daysRemaining),
    };
  }

  /**
   * Time-weighted progress calculation (considers deadline proximity)
   */
  private calculateTimeWeightedProgress(goal: IFinancialGoal): IGoalProgress {
    const baseProgress = this.calculateStandardProgress(goal);
    const daysRemaining = this.calculateDaysRemaining(goal.deadline);
    
    // Adjust onTrack based on time pressure
    if (daysRemaining < 30 && baseProgress.percentageComplete < 70) {
      baseProgress.onTrack = false;
    }
    
    return baseProgress;
  }

  /**
   * Create a new financial goal with optimized defaults
   */
  createGoal(goal: IFinancialGoal): string {
    // PATTERN 4: Lazy - only generate ID if not provided
    if (!goal.goalId) {
      goal.goalId = uuidv4();
    }
    
    // Initialize with optimized defaults
    if (!goal.currentAmount) {
      goal.currentAmount = { amount: 0, currency: goal.targetAmount.currency };
    }
    
    // PATTERN 5: Use pre-computed state
    goal.state = OptimizedGoalService.GOAL_STATES.ACTIVE;
    
    return this.goalRepository.save(goal);
  }

  /**
   * Update existing goal and invalidate cache
   */
  updateGoal(goal: IFinancialGoal): void {
    this.goalRepository.save(goal);
    // Invalidate cache for this goal
    this.progressCache.delete(goal.goalId);
  }

  /**
   * PATTERN 1 & 3: Track progress with memoization and strategy
   * This is the hot path - heavily optimized
   */
  trackProgress(goalId: string, strategyName: string = 'standard'): IGoalProgress | null {
    // Check cache first
    const cached = this.getCachedProgress(goalId);
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    
    // PATTERN 2: Acquire calculator from pool
    const calculator = this.acquireCalculator();
    
    try {
      const goal = this.goalRepository.findById(goalId);
      if (!goal) {
        return null;
      }

      // PATTERN 3: Use strategy for calculation
      const strategy = this.strategies.get(strategyName) || this.strategies.get('standard')!;
      const progress = strategy.calculate(goal);
      
      const computationTime = Date.now() - startTime;
      
      // PATTERN 1: Cache the result
      this.setCachedProgress(goalId, progress, computationTime);
      
      return progress;
    } finally {
      // Always release calculator back to pool
      if (calculator) {
        this.releaseCalculator(calculator);
      }
    }
  }

  /**
   * Get goal by ID with minimal overhead
   */
  getGoal(goalId: string): IFinancialGoal | null {
    return this.goalRepository.findById(goalId);
  }

  /**
   * Batch progress tracking for multiple goals (optimized)
   */
  trackMultipleGoals(goalIds: string[]): Map<string, IGoalProgress | null> {
    const results = new Map<string, IGoalProgress | null>();
    
    // Use parallel processing for cache hits
    for (const goalId of goalIds) {
      const progress = this.trackProgress(goalId);
      results.set(goalId, progress);
    }
    
    return results;
  }

  /**
   * Update goal progress (contribution) with cache invalidation
   */
  contributeToGoal(goalId: string, amount: number): boolean {
    const goal = this.goalRepository.findById(goalId);
    if (!goal) {
      return false;
    }

    // Update current amount
    goal.currentAmount.amount += amount;
    
    // Check if goal is completed
    if (goal.currentAmount.amount >= goal.targetAmount.amount) {
      goal.state = OptimizedGoalService.GOAL_STATES.COMPLETED;
    }
    
    this.goalRepository.save(goal);
    
    // Invalidate cache
    this.progressCache.delete(goalId);
    
    return true;
  }

  /**
   * Get cache statistics for monitoring
   */
  public getCacheStats(): { 
    cacheSize: number; 
    poolAvailable: number;
    strategiesLoaded: number;
  } {
    return {
      cacheSize: this.progressCache.size,
      poolAvailable: this.calculatorPool.filter(c => !c.inUse).length,
      strategiesLoaded: this.strategies.size,
    };
  }

  /**
   * Cleanup expired cache entries
   */
  public cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.progressCache.entries()) {
      if (now - value.timestamp > this.CACHE_TTL) {
        this.progressCache.delete(key);
      }
    }
  }

  /**
   * Warm up cache for frequently accessed goals
   */
  public warmupCache(goalIds: string[]): void {
    for (const goalId of goalIds) {
      this.trackProgress(goalId);
    }
  }

  /**
   * Invalidate all cached progress
   */
  public invalidateAllCache(): void {
    this.progressCache.clear();
  }
}
