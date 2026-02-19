#!/bin/bash

# Blockchain Integration Test Script
# Tests all components of the blockchain integration

echo "=========================================="
echo " Blockchain Integration Test Suite"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

BLOCKCHAIN_URL="http://localhost:5001"
API_URL="http://localhost:3000"

PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -ne "${BLUE}Testing $name...${NC} "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    else
        response=$(curl -s -w "%{http_code}" "$url" 2>/dev/null)
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "=== 1. Blockchain Service Tests ==="
echo ""

test_endpoint "Health Check" "$BLOCKCHAIN_URL/health"
test_endpoint "Service Info" "$BLOCKCHAIN_URL/info"
test_endpoint "Create Wallet" "$BLOCKCHAIN_URL/wallet/create" "POST"
test_endpoint "Get Chain" "$BLOCKCHAIN_URL/chain"
test_endpoint "Get Pending Transactions" "$BLOCKCHAIN_URL/pending"
test_endpoint "Contract Info" "$BLOCKCHAIN_URL/contract/info"
test_endpoint "Validate Chain" "$BLOCKCHAIN_URL/chain/validate"

echo ""
echo "=== 2. Transaction Tests ==="
echo ""

# Create a test transaction
TRANSACTION_DATA='{
  "sender": "0xtest1234567890abcdef",
  "receiver": "0xtest0987654321fedcba",
  "amount": 1000,
  "listing_id": "test-listing-123",
  "quantity": 10,
  "price_per_credit": 100
}'

if test_endpoint "Create Transaction" "$BLOCKCHAIN_URL/transaction/create" "POST" "$TRANSACTION_DATA"; then
    echo -e "${BLUE}Waiting 2 seconds before mining...${NC}"
    sleep 2
    
    test_endpoint "Mine Block" "$BLOCKCHAIN_URL/mine" "POST"
fi

echo ""
echo "=== 3. Smart Contract Tests ==="
echo ""

# Test invalid transaction (should fail validation)
INVALID_TRANSACTION='{
  "sender": "0xtest1234",
  "receiver": "0xtest1234",
  "amount": -100,
  "listing_id": "test",
  "quantity": 0
}'

echo -ne "${BLUE}Testing Invalid Transaction (should fail)...${NC} "
response=$(curl -s -w "%{http_code}" -X POST "$BLOCKCHAIN_URL/transaction/create" \
    -H "Content-Type: application/json" \
    -d "$INVALID_TRANSACTION" 2>/dev/null)
http_code="${response: -3}"

if [ "$http_code" -ge 400 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Correctly rejected: HTTP $http_code)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} (Should have been rejected)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "=== 4. Node.js Server Integration Tests ==="
echo ""

# Note: These would require authentication tokens
# Just test that endpoints exist
echo -e "${YELLOW}Note: Server integration tests require authentication${NC}"
echo -e "${BLUE}Checking server health...${NC}"

if curl -s "$API_URL/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is reachable${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ Server health check unavailable${NC}"
fi

echo ""
echo "=== 5. Blockchain Integrity Tests ==="
echo ""

echo -ne "${BLUE}Testing Blockchain Validation...${NC} "
validation=$(curl -s "$BLOCKCHAIN_URL/chain/validate")
is_valid=$(echo "$validation" | grep -o '"is_valid":[^,}]*' | cut -d':' -f2)

if [ "$is_valid" = "true" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Blockchain is valid)"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} (Blockchain is invalid)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "=== 6. Database Persistence Test ==="
echo ""

echo -ne "${BLUE}Testing Database Persistence...${NC} "
# Check if blockchain data file exists
if [ -f "blockchain-service/blockchain_data.db" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Database file exists)"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Database file not found)"
fi

echo ""
echo "==================================="
echo " Test Results"
echo "==================================="
echo ""
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$((PASSED * 100 / TOTAL))
    echo "Success Rate: $SUCCESS_RATE%"
fi

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}=========================================="
    echo " All Tests Passed! 🎉"
    echo "==========================================${NC}"
    exit 0
else
    echo -e "${YELLOW}=========================================="
    echo " Some Tests Failed"
    echo "==========================================${NC}"
    echo ""
    echo "Check the logs for more details:"
    echo "• blockchain-service/blockchain.log"
    echo "• blockchain-service/worker.log"
    exit 1
fi
