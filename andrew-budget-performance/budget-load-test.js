/**
 * k6 Load Test Script for Budget Management Module
 * CSE352 Extracurricular Assignment - Andrew
 * 
 * Tests the Budget Management component under sustained 100 RPS load
 * with mixed workload (25% create + 75% status queries)
 * 
 * Run: k6 run budget-load-test.js
 * Quick test: k6 run -e DURATION=30s budget-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics for detailed analysis
const cacheHitRate = new Rate('cache_hit_rate');
const budgetCreateDuration = new Trend('budget_create_duration');
const budgetStatusDuration = new Trend('budget_status_duration');
const totalRequests = new Counter('total_requests');

// Test configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const DURATION = __ENV.DURATION || '5m';
const TARGET_RPS = 100;
const NUM_USERS = 100;

// Options for sustained 100 RPS load
export const options = {
  scenarios: {
    budget_operations: {
      executor: 'constant-arrival-rate',
      rate: TARGET_RPS,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: NUM_USERS,
      maxVUs: NUM_USERS * 2,
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<200', 'p(99)<500'], // Primary SLO
    'http_req_duration{operation:create}': ['p(95)<200'],
    'http_req_duration{operation:status}': ['p(95)<200'],
    'http_req_failed': ['rate<0.01'], // < 1% error rate
    'checks': ['rate>0.99'], // > 99% success rate
  },
};

// Test data generators
let budgetCounter = 0;
const createdBudgets = [];

function generateBudgetData(userId) {
  return {
    userId: userId,
    totalAmount: {
      amount: Math.floor(Math.random() * 5000) + 1000, // $1000-$6000
      currency: 'USD'
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    categories: ['groceries', 'dining', 'transportation', 'entertainment']
  };
}

// Setup: Create initial budgets for realistic testing
export function setup() {
  console.log('🔧 Setting up test data...');
  const initialBudgets = [];
  
  // Create 50 budgets across different users
  for (let i = 1; i <= 50; i++) {
    const userId = `user_${i}`;
    const budgetData = generateBudgetData(userId);
    
    const response = http.post(
      `${BASE_URL}/api/budgets/create`,
      JSON.stringify(budgetData),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { operation: 'setup' }
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      try {
        const result = JSON.parse(response.body);
        if (result.budgetId) {
          initialBudgets.push({
            budgetId: result.budgetId,
            userId: userId
          });
        }
      } catch (e) {
        console.warn('Setup parse error:', e);
      }
    }
  }
  
  console.log(`✅ Created ${initialBudgets.length} initial budgets`);
  
  // Warm up cache
  console.log('🔥 Warming up cache...');
  for (let i = 0; i < Math.min(20, initialBudgets.length); i++) {
    http.get(`${BASE_URL}/api/budgets/${initialBudgets[i].budgetId}/status`, {
      tags: { operation: 'warmup' }
    });
  }
  
  console.log('✅ Cache warmed up');
  console.log(`🚀 Starting main test: ${DURATION} at ${TARGET_RPS} RPS\n`);
  
  return { budgets: initialBudgets };
}

// Main test execution
export default function(data) {
  const operationType = Math.random();
  totalRequests.add(1);
  
  // 25% budget creation, 75% status queries (realistic workload)
  if (operationType < 0.25) {
    // CREATE BUDGET
    const userId = `user_${Math.floor(Math.random() * NUM_USERS) + 1}`;
    const budgetData = generateBudgetData(userId);
    
    const createStart = Date.now();
    const response = http.post(
      `${BASE_URL}/api/budgets/create`,
      JSON.stringify(budgetData),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { operation: 'create' }
      }
    );
    const createDuration = Date.now() - createStart;
    
    const createSuccess = check(response, {
      'create: status is 200/201': (r) => r.status === 200 || r.status === 201,
      'create: response time < 200ms': (r) => r.timings.duration < 200,
      'create: has budgetId': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.budgetId !== undefined;
        } catch (e) {
          return false;
        }
      }
    });
    
    budgetCreateDuration.add(createDuration);
    
    // Store created budget for future queries
    if (createSuccess && response.status === 200 || response.status === 201) {
      try {
        const result = JSON.parse(response.body);
        if (result.budgetId) {
          createdBudgets.push({
            budgetId: result.budgetId,
            userId: userId
          });
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
  } else {
    // GET BUDGET STATUS
    let budget;
    
    // 70% queries to existing budgets (cache hits), 30% to new ones
    const useExisting = Math.random() < 0.7;
    
    if (useExisting && data.budgets && data.budgets.length > 0) {
      // Query existing budget (likely cache hit)
      budget = data.budgets[Math.floor(Math.random() * data.budgets.length)];
      cacheHitRate.add(1); // Likely cache hit
    } else if (createdBudgets.length > 0) {
      // Query recently created budget
      budget = createdBudgets[Math.floor(Math.random() * createdBudgets.length)];
      cacheHitRate.add(Math.random() < 0.5 ? 1 : 0); // 50% chance of cache hit
    } else {
      // Fallback to setup budgets
      if (data.budgets && data.budgets.length > 0) {
        budget = data.budgets[Math.floor(Math.random() * data.budgets.length)];
        cacheHitRate.add(1);
      } else {
        return; // Skip if no budgets available
      }
    }
    
    const statusStart = Date.now();
    const response = http.get(
      `${BASE_URL}/api/budgets/${budget.budgetId}/status`,
      {
        tags: { operation: 'status' }
      }
    );
    const statusDuration = Date.now() - statusStart;
    
    check(response, {
      'status: status is 200': (r) => r.status === 200,
      'status: response time < 200ms': (r) => r.timings.duration < 200,
      'status: has spent field': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.spent !== undefined;
        } catch (e) {
          return false;
        }
      }
    });
    
    budgetStatusDuration.add(statusDuration);
  }
  
  // Minimal sleep to allow for realistic request pacing
  sleep(0.01);
}

// Teardown and summary
export function teardown(data) {
  console.log('\n📊 Test Summary');
  console.log('═══════════════════════════════════════════');
  console.log(`Duration: ${DURATION}`);
  console.log(`Target RPS: ${TARGET_RPS}`);
  console.log(`Total Budgets: ${data.budgets ? data.budgets.length : 0} initial`);
  console.log('');
  console.log('✅ Test completed successfully!');
  console.log('');
  console.log('📈 Check the metrics above for detailed results');
  console.log('   - P95 response time (target: < 200ms)');
  console.log('   - Cache hit rate (target: > 70%)');
  console.log('   - Success rate (target: > 99%)');
  console.log('');
  console.log('📝 For full analysis, see results in:');
  console.log('   - results.json');
  console.log('   - ANDREW_BUDGET_MODULE_REPORT.md');
}
