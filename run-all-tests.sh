#!/bin/bash

# Run All Load Tests Script
# Executes smoke, ramp-up, and sustained load tests sequentially

set -e

echo "============================================"
echo "SigmaPay - Complete Load Test Suite"
echo "============================================"
echo ""

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "Error: k6 is not installed"
    echo ""
    echo "Install k6:"
    echo "  macOS:        brew install k6"
    echo "  Ubuntu:       See https://k6.io/docs/getting-started/installation"
    echo "  Windows:      choco install k6"
    exit 1
fi

# Check if service is running
echo "Checking if service is running..."
if ! curl -s http://localhost:8080/api/payments/health > /dev/null 2>&1; then
    echo "Error: Payment service is not running"
    echo "Please start the service first:"
    echo "  cd payment-service"
    echo "  mvn spring-boot:run"
    exit 1
fi
echo "✓ Service is running"
echo ""

cd load-tests

# Test 1: Smoke Test
echo "============================================"
echo "Test 1/3: Smoke Test (1 minute)"
echo "============================================"
echo "Purpose: Validate basic functionality"
echo "Load: 10 RPS"
echo ""
k6 run smoke-test.js
echo ""
echo "✓ Smoke test completed"
echo ""
read -p "Press Enter to continue to ramp-up test..."
echo ""

# Test 2: Ramp-Up Test
echo "============================================"
echo "Test 2/3: Ramp-Up Test (10 minutes)"
echo "============================================"
echo "Purpose: Find performance boundaries"
echo "Load: 0 → 50 → 100 → 150 → 0 RPS"
echo ""
k6 run ramp-up-test.js
echo ""
echo "✓ Ramp-up test completed"
echo ""
read -p "Press Enter to continue to sustained load test..."
echo ""

# Test 3: Sustained Load Test
echo "============================================"
echo "Test 3/3: Sustained Load Test (10 minutes)"
echo "============================================"
echo "Purpose: Validate P95 < 200ms SLO"
echo "Load: 100 RPS constant"
echo ""
k6 run payment-load-test.js
echo ""
echo "✓ Sustained load test completed"
echo ""

# Summary
echo "============================================"
echo "All Tests Completed!"
echo "============================================"
echo ""
echo "Results Summary:"
echo "1. Smoke Test:        See output above"
echo "2. Ramp-Up Test:      See output above"
echo "3. Sustained Load:    See output above"
echo ""
echo "Next Steps:"
echo "1. Review P95 latency from sustained load test"
echo "2. Calculate % of requests < 200ms"
echo "3. Check service metrics:"
echo "   curl http://localhost:8080/actuator/metrics"
echo "4. Screenshot results for your presentation"
echo ""
