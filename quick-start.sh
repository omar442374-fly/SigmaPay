#!/bin/bash

# Quick Start Script for SigmaPay Payment Service
# This script builds, runs, and tests the payment service

set -e  # Exit on error

echo "============================================"
echo "SigmaPay Payment Service - Quick Start"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed${NC}"
    echo "Please install Java 17 or higher"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven is not installed${NC}"
    echo "Please install Maven 3.6 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Java version: $(java -version 2>&1 | head -n 1)${NC}"
echo -e "${GREEN}✓ Maven version: $(mvn -version | head -n 1)${NC}"
echo ""

# Build the service
echo -e "${BLUE}[2/6] Building payment service...${NC}"
cd payment-service
mvn clean package -DskipTests
echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Start the service
echo -e "${BLUE}[3/6] Starting payment service...${NC}"
echo "Service will start on http://localhost:8080"
echo "Press Ctrl+C to stop the service"
echo ""

# Run in background
java -jar target/payment-service-1.0.0.jar > service.log 2>&1 &
SERVICE_PID=$!
echo "Service PID: $SERVICE_PID"

# Wait for service to start
echo "Waiting for service to start..."
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Service is up and running!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}Error: Service failed to start within 30 seconds${NC}"
        kill $SERVICE_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
    echo -n "."
done
echo ""

# Test the service
echo -e "${BLUE}[4/6] Testing service...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8080/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "amount": 99.99,
    "currency": "USD",
    "method": "CARD",
    "description": "Test payment",
    "merchantId": "merchant-001"
  }')

if echo "$RESPONSE" | grep -q "paymentId"; then
    echo -e "${GREEN}✓ Test payment successful${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}Error: Test payment failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Display service info
echo -e "${BLUE}[5/6] Service Information${NC}"
echo "----------------------------------------"
echo "Service URL:     http://localhost:8080"
echo "Health Check:    http://localhost:8080/actuator/health"
echo "Metrics:         http://localhost:8080/actuator/metrics"
echo "Prometheus:      http://localhost:8080/actuator/prometheus"
echo "H2 Console:      http://localhost:8080/h2-console"
echo "Log File:        payment-service/service.log"
echo "----------------------------------------"
echo ""

# Ask about load tests
echo -e "${BLUE}[6/6] Load Testing${NC}"
echo "Would you like to run load tests? (requires k6)"
echo "1) Yes - Run smoke test (1 minute)"
echo "2) Yes - Run full load test (10 minutes @ 100 RPS)"
echo "3) No - Skip load tests"
read -p "Choose option [1-3]: " LOAD_TEST_OPTION

cd ..

case $LOAD_TEST_OPTION in
    1)
        if command -v k6 &> /dev/null; then
            echo -e "${BLUE}Running smoke test...${NC}"
            cd load-tests
            k6 run smoke-test.js
            cd ..
        else
            echo -e "${RED}k6 is not installed. Please install k6 to run load tests.${NC}"
        fi
        ;;
    2)
        if command -v k6 &> /dev/null; then
            echo -e "${BLUE}Running full load test (this will take 10 minutes)...${NC}"
            cd load-tests
            k6 run payment-load-test.js
            cd ..
        else
            echo -e "${RED}k6 is not installed. Please install k6 to run load tests.${NC}"
        fi
        ;;
    3)
        echo "Skipping load tests"
        ;;
    *)
        echo "Invalid option, skipping load tests"
        ;;
esac

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Service is running!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "To stop the service, run:"
echo "  kill $SERVICE_PID"
echo ""
echo "Or press Ctrl+C and then run:"
echo "  pkill -f payment-service"
echo ""
echo "To view logs:"
echo "  tail -f payment-service/service.log"
echo ""
