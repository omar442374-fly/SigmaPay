import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

/**
 * K6 Load Test for Payment Service
 * 
 * Test Configuration:
 * - Target RPS: 100 requests per second
 * - Duration: 10 minutes sustained load
 * - SLO: P95 response time < 200ms
 * 
 * This test validates the low-latency implementation
 */

// Custom metrics
const errorRate = new Rate('errors');
const paymentDuration = new Trend('payment_duration');

// Test configuration
export const options = {
  scenarios: {
    // Constant RPS test scenario
    constant_rps: {
      executor: 'constant-arrival-rate',
      rate: 100,              // 100 RPS
      timeUnit: '1s',         // per second
      duration: '10m',        // 10 minutes
      preAllocatedVUs: 50,    // Start with 50 VUs
      maxVUs: 200,            // Scale up to 200 VUs if needed
    },
  },
  
  // Thresholds - CRITICAL: P95 must be < 200ms
  thresholds: {
    'http_req_duration': [
      'p(95)<200',           // 95th percentile must be under 200ms
      'p(99)<500',           // 99th percentile under 500ms
      'avg<100',             // Average under 100ms
    ],
    'http_req_failed': ['rate<0.05'],  // Error rate < 5%
    'errors': ['rate<0.05'],
  },
};

// Base URL - change to your service URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

// Test data generator
function generatePaymentRequest() {
  const userId = `user${Math.floor(Math.random() * 1000)}`;
  const amount = (Math.random() * 1000 + 10).toFixed(2);
  const methods = ['CARD', 'WALLET', 'BANK_TRANSFER'];
  const method = methods[Math.floor(Math.random() * methods.length)];
  
  return {
    userId: userId,
    amount: parseFloat(amount),
    currency: 'USD',
    method: method,
    description: `Payment for order ${Date.now()}`,
    merchantId: 'merchant-001'
  };
}

// Main test function
export default function() {
  const payload = JSON.stringify(generatePaymentRequest());
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: { name: 'ProcessPayment' },
  };
  
  // Send payment request
  const response = http.post(`${BASE_URL}/api/payments`, payload, params);
  
  // Record metrics
  paymentDuration.add(response.timings.duration);
  
  // Validate response
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has payment ID': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.paymentId !== undefined;
      } catch (e) {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  
  // Small random sleep to simulate realistic user behavior
  sleep(0.1 + Math.random() * 0.2);
}

// Setup function - runs once before test
export function setup() {
  console.log('Starting Payment Service Load Test');
  console.log(`Target: 100 RPS for 10 minutes`);
  console.log(`SLO: P95 < 200ms`);
  
  // Health check
  const healthCheck = http.get(`${BASE_URL}/api/payments/health`);
  if (healthCheck.status !== 200) {
    throw new Error('Service is not healthy');
  }
  
  return { startTime: Date.now() };
}

// Teardown function - runs once after test
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Test completed. Duration: ${duration}s`);
}
