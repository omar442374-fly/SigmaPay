import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * K6 Load Test for SigmaPay Goal Management Module
 * 
 * Test Objective: Ensure P95 response time < 200ms at 100 RPS sustained load
 * Components Under Test:
 *   - Goal Creation API (POST /api/goals/create)
 *   - Goal Progress Tracking API (GET /api/goals/:goalId/progress)
 * 
 * Test Configuration:
 * - Target Load: 100 Requests Per Second (RPS)
 * - Duration: 5 minutes sustained load
 * - Success Criteria: P95 latency < 200ms
 */

// Custom metrics for detailed analysis
const successRate = new Rate('goal_success_rate');
const createGoalDuration = new Trend('create_goal_duration');
const trackProgressDuration = new Trend('track_progress_duration');
const cacheHitRate = new Rate('cache_hit_rate');
const goalsCounter = new Counter('goals_processed');

// Test configuration
export const options = {
  scenarios: {
    constant_mixed_load: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS total (30 create + 70 track)
      timeUnit: '1s',
      duration: '5m', // 5 minutes sustained load
      preAllocatedVUs: 60,
      maxVUs: 250,
    },
  },
  
  // Performance thresholds - SLO Requirements
  thresholds: {
    'http_req_duration': [
      'p(95)<200', // 95th percentile must be under 200ms
      'p(99)<500',
      'avg<100',
    ],
    'http_req_failed': ['rate<0.05'],
    'goal_success_rate': ['rate>0.95'],
    'create_goal_duration': ['p(95)<200'],
    'track_progress_duration': ['p(95)<200'],
  },
  
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// User and goal pools
const USER_POOL_SIZE = 100;
const USER_IDS = Array.from({ length: USER_POOL_SIZE }, (_, i) => `user_${i + 1}`);

// Track created goals for progress testing
let createdGoals = [];

/**
 * Generate realistic goal data
 */
function generateGoalData() {
  const goalTypes = ['savings', 'investment', 'debt-reduction', 'emergency-fund', 'retirement'];
  const priorityLevels = ['high', 'medium', 'low'];
  
  const userId = USER_IDS[Math.floor(Math.random() * USER_IDS.length)];
  const goalType = goalTypes[Math.floor(Math.random() * goalTypes.length)];
  const targetAmount = Math.floor(Math.random() * 50000) + 5000; // $5k - $55k
  const priorityLevel = priorityLevels[Math.floor(Math.random() * priorityLevels.length)];
  
  // Deadline between 3 months to 3 years from now
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + Math.floor(Math.random() * 33) + 3);
  
  return {
    userId,
    goalType,
    targetAmount,
    deadline: deadline.toISOString(),
    priorityLevel,
  };
}

/**
 * Select operation type (30% create, 70% track)
 */
function getOperationType() {
  return Math.random() < 0.3 ? 'create' : 'track';
}

/**
 * Main test function
 */
export default function () {
  const operationType = getOperationType();
  
  if (operationType === 'create') {
    // Create Goal Operation
    const goalData = generateGoalData();
    const payload = JSON.stringify(goalData);
    
    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'CreateGoal' },
    };
    
    const startTime = Date.now();
    const response = http.post(`${BASE_URL}/api/goals/create`, payload, params);
    const duration = Date.now() - startTime;
    
    createGoalDuration.add(duration);
    
    const checkResult = check(response, {
      'status is 200': (r) => r.status === 200,
      'has goalId': (r) => {
        try {
          const body = JSON.parse(r.body);
          if (body.goalId) {
            // Store goal ID for future tracking
            if (createdGoals.length < 1000) {
              createdGoals.push(body.goalId);
            }
            return true;
          }
          return false;
        } catch (e) {
          return false;
        }
      },
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    successRate.add(checkResult);
    goalsCounter.add(1);
    
  } else {
    // Track Progress Operation
    let goalId;
    
    // Use created goal or generate mock ID
    if (createdGoals.length > 0) {
      goalId = createdGoals[Math.floor(Math.random() * createdGoals.length)];
    } else {
      // Generate consistent mock goal ID for cache testing
      const userId = USER_IDS[Math.floor(Math.random() * Math.min(20, USER_IDS.length))];
      goalId = `goal_${userId}_${Math.floor(Math.random() * 5)}`;
    }
    
    const params = {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'TrackProgress' },
    };
    
    const startTime = Date.now();
    const response = http.get(`${BASE_URL}/api/goals/${goalId}/progress`, params);
    const duration = Date.now() - startTime;
    
    trackProgressDuration.add(duration);
    
    // Check if response was likely from cache (very fast)
    if (response.timings.duration < 10) {
      cacheHitRate.add(true);
    } else {
      cacheHitRate.add(false);
    }
    
    const checkResult = check(response, {
      'status is 200': (r) => r.status === 200,
      'has progress data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.success === true || body.percentageComplete !== undefined;
        } catch (e) {
          return false;
        }
      },
      'response time < 200ms': (r) => r.timings.duration < 200,
    });
    
    successRate.add(checkResult);
    goalsCounter.add(1);
  }
  
  // Small think time
  sleep(0.01);
}

/**
 * Setup function
 */
export function setup() {
  console.log('🚀 Starting SigmaPay Goal Management Load Test');
  console.log(`📊 Target Load: 100 RPS (30% create + 70% track)`);
  console.log(`⏱️  Duration: 5 minutes`);
  console.log(`🎯 SLO: P95 < 200ms`);
  console.log(`🔗 Target URLs:`);
  console.log(`   - POST ${BASE_URL}/api/goals/create`);
  console.log(`   - GET ${BASE_URL}/api/goals/:goalId/progress`);
  console.log(`👥 User Pool: ${USER_POOL_SIZE} users`);
  console.log('');
  
  // Verify server is reachable
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error('Server health check failed - ensure backend is running');
  }
  console.log('✅ Server health check passed');
  
  // Create initial goals for testing
  console.log('🏁 Creating initial goals...');
  for (let i = 0; i < 20; i++) {
    const goalData = generateGoalData();
    const response = http.post(
      `${BASE_URL}/api/goals/create`,
      JSON.stringify(goalData),
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    if (response.status === 200) {
      try {
        const body = JSON.parse(response.body);
        if (body.goalId) {
          createdGoals.push(body.goalId);
        }
      } catch (e) {
        // Ignore parse errors during setup
      }
    }
  }
  console.log(`✅ Created ${createdGoals.length} initial goals for testing`);
  
  // Warm up cache
  console.log('🔥 Warming up cache...');
  for (let i = 0; i < Math.min(10, createdGoals.length); i++) {
    http.get(`${BASE_URL}/api/goals/${createdGoals[i]}/progress`);
  }
  console.log('✅ Cache warm-up complete');
  console.log('');
  
  return { 
    startTime: new Date().toISOString(),
    initialGoals: createdGoals.length
  };
}

/**
 * Teardown function
 */
export function teardown(data) {
  console.log('');
  console.log('✅ Load test completed');
  console.log(`Started at: ${data.startTime}`);
  console.log(`Ended at: ${new Date().toISOString()}`);
  console.log(`Initial goals created: ${data.initialGoals}`);
}

/**
 * Custom summary handler
 */
export function handleSummary(data) {
  return {
    'mohamed-goal-performance/results.json': JSON.stringify(data, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Generate text summary
 */
function textSummary(data, options) {
  const indent = (options && options.indent) ? options.indent : '';
  const metrics = data.metrics;
  
  let summary = '\n';
  summary += `${indent}📊 Goal Management Module Test Summary\n`;
  summary += `${indent}${'='.repeat(60)}\n\n`;
  
  if (metrics.http_req_duration) {
    const duration = metrics.http_req_duration;
    summary += `${indent}⏱️  Response Time (Overall):\n`;
    summary += `${indent}   Average: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   Median:  ${duration.values.med ? duration.values.med.toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   P95:     ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   P99:     ${duration.values['p(99)'] ? duration.values['p(99)'].toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   Max:     ${duration.values.max ? duration.values.max.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.create_goal_duration) {
    const duration = metrics.create_goal_duration;
    summary += `${indent}🎯 Create Goal Performance:\n`;
    summary += `${indent}   P95: ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   Avg: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.track_progress_duration) {
    const duration = metrics.track_progress_duration;
    summary += `${indent}📈 Track Progress Performance:\n`;
    summary += `${indent}   P95: ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   Avg: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.http_reqs) {
    summary += `${indent}📊 Request Stats:\n`;
    summary += `${indent}   Total Requests: ${metrics.http_reqs.values.count}\n`;
    summary += `${indent}   Requests/sec:   ${metrics.http_reqs.values.rate ? metrics.http_reqs.values.rate.toFixed(2) : 'N/A'}\n\n`;
  }
  
  if (metrics.goals_processed) {
    summary += `${indent}🎯 Goals Processed: ${metrics.goals_processed.values.count}\n\n`;
  }
  
  if (metrics.cache_hit_rate) {
    const hitRate = metrics.cache_hit_rate.values.rate * 100;
    summary += `${indent}💾 Cache Hit Rate: ${hitRate.toFixed(1)}%\n\n`;
  }
  
  if (metrics.http_req_failed) {
    const failRate = metrics.http_req_failed.values.rate * 100;
    summary += `${indent}✅ Success Rate: ${(100 - failRate).toFixed(2)}%\n\n`;
  }
  
  // SLO Assessment
  const p95 = metrics.http_req_duration ? metrics.http_req_duration.values['p(95)'] : undefined;
  summary += `${indent}🎯 SLO Assessment:\n`;
  if (p95 !== undefined) {
    if (p95 < 200) {
      summary += `${indent}   ✅ PASSED - P95 (${p95.toFixed(2)}ms) < 200ms\n`;
    } else {
      summary += `${indent}   ❌ FAILED - P95 (${p95.toFixed(2)}ms) >= 200ms\n`;
    }
  }
  
  summary += '\n';
  return summary;
}
