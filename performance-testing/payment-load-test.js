import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * K6 Load Test for SigmaPay Payment Processing Component
 * 
 * Test Objective: Ensure P95 response time < 200ms at 100 RPS sustained load
 * Component Under Test: Payment Processing API (/api/payments/process)
 * 
 * Test Configuration:
 * - Target Load: 100 Requests Per Second (RPS)
 * - Duration: 5 minutes sustained load
 * - Ramp-up: 30 seconds to reach target load
 * - Success Criteria: P95 latency < 200ms
 */

// Custom metrics for detailed analysis
const successRate = new Rate('payment_success_rate');
const paymentDuration = new Trend('payment_processing_duration');

// Test configuration following assignment requirements
export const options = {
  // Scenario-based test execution
  scenarios: {
    constant_load: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 RPS (requests per second)
      timeUnit: '1s',
      duration: '5m', // 5 minutes sustained load
      preAllocatedVUs: 50, // Pre-allocate virtual users
      maxVUs: 200, // Maximum virtual users if needed
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
    'payment_success_rate': ['rate>0.95'],
  },
  
  // Output results to JSON for report generation
  summaryTrendStats: ['min', 'avg', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

// Base URL for the API
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

/**
 * Generate realistic payment data with variety
 * This prevents caching from artificially improving results
 */
function generatePaymentData() {
  const paymentMethods = ['method_1', 'method_2', 'method_3'];
  const currencies = ['USD', 'EUR', 'GBP'];
  const userIds = Array.from({ length: 100 }, (_, i) => `user_${i}`);
  
  const amount = Math.floor(Math.random() * 1000) + 10; // $10 - $1000
  const methodId = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const currency = currencies[Math.floor(Math.random() * currencies.length)];
  const userId = userIds[Math.floor(Math.random() * userIds.length)];
  
  return {
    userId: userId,
    amount: {
      amount: amount,
      currency: {
        code: currency,
        symbol: currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£',
        exchangeRate: 1,
      },
    },
    methodId: methodId,
    merchantId: `merchant_${Math.floor(Math.random() * 50)}`,
    state: 'Pending',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Main test function - executed for each request
 */
export default function () {
  const payload = JSON.stringify(generatePaymentData());
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: {
      name: 'ProcessPayment', // Tag for grouping in results
    },
  };
  
  // Send POST request to payment processing endpoint
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/api/payments/process`, payload, params);
  const duration = Date.now() - startTime;
  
  // Record custom metrics
  paymentDuration.add(duration);
  
  // Validate response
  const checkResult = check(response, {
    'status is 200': (r) => r.status === 200,
    'response has paymentId': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.paymentId !== undefined;
      } catch (e) {
        return false;
      }
    },
    'response is successful': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true;
      } catch (e) {
        return false;
      }
    },
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  
  successRate.add(checkResult);
  
  // Small sleep to simulate realistic user behavior (optional)
  // Removed to maintain pure load test
}

/**
 * Setup function - runs once before the test
 */
export function setup() {
  console.log('🚀 Starting SigmaPay Payment Processing Load Test');
  console.log(`📊 Target Load: 100 RPS`);
  console.log(`⏱️  Duration: 5 minutes`);
  console.log(`🎯 SLO: P95 < 200ms`);
  console.log(`🔗 Target URL: ${BASE_URL}/api/payments/process`);
  console.log('');
  
  // Verify server is reachable
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error('Server health check failed - ensure backend is running');
  }
  console.log('✅ Server health check passed');
  
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
    'performance-testing/results.json': JSON.stringify(data, null, 2),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}

/**
 * Generate text summary (simplified version)
 */
function textSummary(data, options) {
  const indent = (options && options.indent) ? options.indent : '';
  const metrics = data.metrics;
  
  let summary = '\n';
  summary += `${indent}📊 Test Summary\n`;
  summary += `${indent}${'='.repeat(50)}\n\n`;
  
  if (metrics.http_req_duration) {
    const duration = metrics.http_req_duration;
    summary += `${indent}⏱️  Response Time:\n`;
    summary += `${indent}   Average: ${duration.values.avg ? duration.values.avg.toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   Median:  ${duration.values.med ? duration.values.med.toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   P95:     ${duration.values['p(95)'] ? duration.values['p(95)'].toFixed(2) : 'N/A'}ms ${duration.values['p(95)'] < 200 ? '✅' : '❌'}\n`;
    summary += `${indent}   P99:     ${duration.values['p(99)'] ? duration.values['p(99)'].toFixed(2) : 'N/A'}ms\n`;
    summary += `${indent}   Max:     ${duration.values.max ? duration.values.max.toFixed(2) : 'N/A'}ms\n\n`;
  }
  
  if (metrics.http_reqs) {
    summary += `${indent}📈 Request Stats:\n`;
    summary += `${indent}   Total Requests: ${metrics.http_reqs.values.count}\n`;
    summary += `${indent}   Requests/sec:   ${metrics.http_reqs.values.rate ? metrics.http_reqs.values.rate.toFixed(2) : 'N/A'}\n\n`;
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
  
  return summary;
}
