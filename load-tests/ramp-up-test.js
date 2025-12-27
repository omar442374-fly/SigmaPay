import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Ramp-up Load Test
 * 
 * Gradually increases load to find breaking point
 * Stages:
 * 1. Warm-up: 0 -> 50 RPS over 2 minutes
 * 2. Target: 100 RPS for 5 minutes
 * 3. Peak: 150 RPS for 2 minutes
 * 4. Cool-down: 150 -> 0 over 1 minute
 */

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp-up to 50 RPS
    { duration: '5m', target: 100 },  // Hold at 100 RPS (target)
    { duration: '2m', target: 150 },  // Stress test at 150 RPS
    { duration: '1m', target: 0 },    // Cool down
  ],
  thresholds: {
    'http_req_duration': ['p(95)<200'],
    'http_req_failed': ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

function generatePaymentRequest() {
  return {
    userId: `user${Math.floor(Math.random() * 1000)}`,
    amount: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
    currency: 'USD',
    method: ['CARD', 'WALLET', 'BANK_TRANSFER'][Math.floor(Math.random() * 3)],
    description: `Test payment ${Date.now()}`,
    merchantId: 'merchant-001'
  };
}

export default function() {
  const payload = JSON.stringify(generatePaymentRequest());
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = http.post(`${BASE_URL}/api/payments`, payload, params);
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'P95 target met': (r) => r.timings.duration < 200,
  });
  
  sleep(0.1);
}
