import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Quick Smoke Test for Payment Service
 * 
 * Validates basic functionality before full load test
 * - 10 RPS for 1 minute
 * - Quick validation that service works
 */

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    'http_req_duration': ['p(95)<200'],
    'http_req_failed': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

function generatePaymentRequest() {
  return {
    userId: `user${Math.floor(Math.random() * 100)}`,
    amount: (Math.random() * 100 + 10).toFixed(2),
    currency: 'USD',
    method: 'CARD',
    description: 'Test payment',
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
    'response time OK': (r) => r.timings.duration < 200,
  });
  
  sleep(1);
}

export function setup() {
  console.log('Running smoke test...');
  const healthCheck = http.get(`${BASE_URL}/api/payments/health`);
  if (healthCheck.status !== 200) {
    throw new Error('Service is not healthy');
  }
}
