import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

/**
 * K6 Load Test for SigmaPay Reporting Module
 * 
 * Test Objective: Ensure P95 response time < 200ms at 100 RPS sustained load
 * Components Under Test:
 *   - Income Statement API (GET /api/reports/income/:userId)
 *   - Monthly Summary API (GET /api/reports/monthly/:userId)
 * 
 * Test Configuration:
 * - Target Load: 100 Requests Per Second (RPS)
 * - Duration: 5 minutes sustained load
 * - Ramp-up: 30 seconds to reach target load
 * - Success Criteria: P95 latency < 200ms
 */

// Custom metrics for detailed analysis
const successRate = new Rate('reporting_success_rate');
const incomeReportDuration = new Trend('income_report_duration');
const monthlyReportDuration = new Trend('monthly_report_duration');
const cacheHitRate = new Rate('cache_hit_rate');
const reportCounter = new Counter('reports_generated');

// Test configuration following assignment requirements
export const options = {
  // Scenario-based test execution with multiple report types
  scenarios: {
    constant_mixed_load: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS total (50 income + 50 monthly)
      timeUnit: '1s',
      duration: '5m', // 5 minutes sustained load
      preAllocatedVUs: 60, // Pre-allocate virtual users
      maxVUs: 250, // Maximum virtual users if needed
    },
  },
  
  // Performance thresholds - SLO Requirements
  thresholds: {
    // PRIMARY SLO: P95 response time must be < 200ms
    'http_req_duration': [
      'p(95)<200', // 95th percentile must be under 200ms
      'p(99)<500', // 99th percentile should be under 500ms
      'avg<100',   // Average response time should be under 100ms
    ],
    
    // Success rate should be > 95%
    'http_req_failed': ['rate<0.05'],
    
    // Custom metrics
    'reporting_success_rate': ['rate>0.95'],
    'income_report_duration': ['p(95)<200'],
    'monthly_report_duration': ['p(95)<200'],
  },
  
  // Output results to JSON for report generation
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// Base URL for the API
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

// Generate realistic user pool
const USER_POOL_SIZE = 100;
const USER_IDS = Array.from({ length: USER_POOL_SIZE }, (_, i) => `user_${i + 1}`);

/**
 * Select random user from pool to simulate realistic access patterns
 * This creates a mix of cache hits and misses
 */
function getRandomUser() {
  return USER_IDS[Math.floor(Math.random() * USER_IDS.length)];
}

/**
 * Decide which report type to request (50/50 split)
 */
function getReportType() {
  return Math.random() < 0.5 ? 'income' : 'monthly';
}

/**
 * Main test function - executed for each request
 */
export default function () {
  const userId = getRandomUser();
  const reportType = getReportType();
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: {
      name: reportType === 'income' ? 'IncomeReport' : 'MonthlyReport',
      userId: userId,
    },
  };
  
  // Construct endpoint URL
  const url = reportType === 'income' 
    ? `${BASE_URL}/api/reports/income/${userId}`
    : `${BASE_URL}/api/reports/monthly/${userId}`;
  
  // Send GET request to reporting endpoint
  const startTime = Date.now();
  const response = http.get(url, params);
  const duration = Date.now() - startTime;
  
  // Record custom metrics based on report type
  if (reportType === 'income') {
    incomeReportDuration.add(duration);
  } else {
    monthlyReportDuration.add(duration);
  }
  
  reportCounter.add(1);
  
  // Validate response
  const checkResult = check(response, {
    'status is 200': (r) => r.status === 200,
    'response has report': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.report !== undefined;
      } catch (e) {
        return false;
      }
    },
    'report contains data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.report && body.report.length > 0;
      } catch (e) {
        return false;
      }
    },
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  // Check if response was likely served from cache (very fast response)
  if (response.timings.duration < 10) {
    cacheHitRate.add(true);
  } else {
    cacheHitRate.add(false);
  }
  
  successRate.add(checkResult);
  
  // Simulate realistic user behavior with small think time
  // This is optional and can be removed for pure load testing
  sleep(0.01); // 10ms think time
}

/**
 * Setup function - runs once before the test
 */
export function setup() {
  console.log('🚀 Starting SigmaPay Reporting Module Load Test');
  console.log(`📊 Target Load: 100 RPS (mixed income and monthly reports)`);
  console.log(`⏱️  Duration: 5 minutes`);
  console.log(`🎯 SLO: P95 < 200ms for both report types`);
  console.log(`🔗 Target URLs:`);
  console.log(`   - ${BASE_URL}/api/reports/income/:userId`);
  console.log(`   - ${BASE_URL}/api/reports/monthly/:userId`);
  console.log(`👥 User Pool: ${USER_POOL_SIZE} users`);
  console.log('');
  
  // Verify server is reachable
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error('Server health check failed - ensure backend is running');
  }
  console.log('✅ Server health check passed');
  
  // Warm up cache with a few requests
  console.log('🔥 Warming up cache...');
  for (let i = 0; i < 10; i++) {
    const userId = USER_IDS[i];
    http.get(`${BASE_URL}/api/reports/income/${userId}`);
    http.get(`${BASE_URL}/api/reports/monthly/${userId}`);
  }
  console.log('✅ Cache warm-up complete');
  console.log('');
  
  return { startTime: new Date().toISOString() };
}

/**
 * Teardown function - runs once after the test
 */
export function teardown(data) {
  console.log('');
  console.log('✅ Load test completed');
  console.log(`Started at: ${data.startTime}`);
  console.log(`Ended at: ${new Date().toISOString()}`);
}

/**
 * Custom summary handler for detailed reporting
 */
export function handleSummary(data) {
  // Save results to JSON file
  return {
    'ammar-reporting-performance/results.json': JSON.stringify(data, null, 2),
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
  summary += `${indent}📊 Reporting Module Test Summary\n`;
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
  
  if (metrics.income_report_duration) {
    const duration = metrics.income_report_duration;
    summary += `${indent}📈 Income Report Performance:\n`;
    summary += `${indent}   P95: ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   Avg: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.monthly_report_duration) {
    const duration = metrics.monthly_report_duration;
    summary += `${indent}📅 Monthly Summary Performance:\n`;
    summary += `${indent}   P95: ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   Avg: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.http_reqs) {
    summary += `${indent}📊 Request Stats:\n`;
    summary += `${indent}   Total Requests: ${metrics.http_reqs.values.count}\n`;
    summary += `${indent}   Requests/sec:   ${metrics.http_reqs.values.rate ? metrics.http_reqs.values.rate.toFixed(2) : 'N/A'}\n\n`;
  }
  
  if (metrics.reports_generated) {
    summary += `${indent}📝 Reports Generated: ${metrics.reports_generated.values.count}\n\n`;
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
