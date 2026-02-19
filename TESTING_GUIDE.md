# Blockchain Integration - Testing Guide

This guide will help you test the blockchain integration step by step.

## Prerequisites

Ensure all services are running:

- Blockchain Service: http://localhost:5001
- Node.js Server: http://localhost:3000
- React Client: http://localhost:5173
- Mining Worker: Running in background

## Step 1: Verify Blockchain Service

### Test blockchain health:

```bash
curl http://localhost:5001/health
```

**Expected response:**

```json
{
  "status": "healthy",
  "service": "blockchain-service",
  "blockchain_valid": true
}
```

### Get blockchain info:

```bash
curl http://localhost:5001/info
```

**Expected response includes:**

- Blockchain statistics
- Smart contract address
- Chain length

## Step 2: Create Test Wallets

### Create wallet for buyer:

```bash
curl -X POST http://localhost:5001/wallet/create
```

**Save the response** - you'll need the address:

```json
{
  "success": true,
  "data": {
    "private_key": "...PEM format...",
    "public_key": "...PEM format...",
    "address": "0x..."
  }
}
```

### Create wallet for seller:

```bash
curl -X POST http://localhost:5001/wallet/create
```

Save this address too.

## Step 3: Test Through Frontend

### 3.1 Register Users

1. **Register as Producer (Seller):**
   - Go to http://localhost:5173/register
   - Create account with role "PRODUCER"
   - Verify email if required
   - Login

2. **Register as Consumer (Buyer):**
   - Open incognito/private window
   - Go to http://localhost:5173/register
   - Create account with role "CONSUMER"
   - Verify and login

### 3.2 Create a Listing (Producer)

As the Producer:

1. Go to "Create Listing" or "Post Credits"
2. Fill in:
   - Title: "Solar Energy Credits Q1 2026"
   - Quantity: 100
   - Price per Credit: 50
   - Type: "Solar"
   - Description: "Clean solar energy credits"
3. Submit

### 3.3 Purchase Credits (Consumer)

As the Consumer:

1. Go to "Marketplace" or "Browse Listings"
2. Find the listing created by the producer
3. Click "Purchase" or "Buy"
4. Enter quantity: 10
5. Select payment method
6. Complete purchase

### 3.4 Check Transaction

After purchase:

1. Note the transaction ID from the success message
2. Check your transaction history

## Step 4: Verify on Blockchain

### Check pending transactions:

```bash
curl http://localhost:5001/pending
```

**Expected:** Your transaction should be in pending pool

### Trigger mining (or wait for auto-mining):

```bash
curl -X POST http://localhost:5001/mine
```

**Expected response:**

```json
{
  "success": true,
  "message": "Block mined successfully",
  "data": {
    "block": {
      "index": 1,
      "timestamp": 1234567890,
      "transactions": [...],
      "proof": 12345,
      "previous_hash": "...",
      "hash": "0000..."
    }
  }
}
```

### View entire blockchain:

```bash
curl http://localhost:5001/chain
```

**Expected:** You should see your transaction in the latest block

### Get specific transaction:

```bash
curl http://localhost:5001/transaction/<transaction_hash>
```

Replace `<transaction_hash>` with the blockchain transaction hash from your purchase.

## Step 5: Verify Database Integration

### Check MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the database
use carbonEase

# Find recent transaction
db.transactions.findOne({}, {sort: {createdAt: -1}})
```

**Verify fields:**

- `blockchainTxHash` - should have a value
- `blockchainStatus` - should be "confirmed" after mining
- `blockNumber` - should have the block number
- `smartContractReceipt` - should have receipt data

### Check user blockchain addresses:

```javascript
db.users.find(
  { blockchainAddress: { $exists: true, $ne: "" } },
  { email: 1, blockchainAddress: 1 },
);
```

## Step 6: Advanced Testing

### Test transaction with custom addresses:

```bash
curl -X POST http://localhost:5001/transaction/create \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "0x1234...",
    "receiver": "0x5678...",
    "amount": 5000,
    "listing_id": "test-listing-123",
    "quantity": 100,
    "price_per_credit": 50,
    "metadata": {
      "test": true
    }
  }'
```

### Validate blockchain integrity:

```bash
curl http://localhost:5001/chain/validate
```

**Expected:**

```json
{
  "success": true,
  "is_valid": true,
  "message": "Blockchain is valid"
}
```

### Get smart contract info:

```bash
curl http://localhost:5001/contract/info
```

## Step 7: Monitor Logs

### Blockchain service logs:

```bash
tail -f blockchain-service/blockchain.log
```

### Mining worker logs:

```bash
tail -f blockchain-service/worker.log
```

### Node.js server logs:

```bash
tail -f server/server.log
```

**Look for:**

- Wallet creation messages
- Transaction creation logs
- Mining notifications
- Blockchain status updates

## Common Test Scenarios

### Scenario 1: Multiple Transactions

1. Create 3-5 transactions through the frontend
2. Check pending pool: `curl http://localhost:5001/pending`
3. Mine a block: `curl -X POST http://localhost:5001/mine`
4. Verify all transactions are in the block

### Scenario 2: Auto-Mining

1. Create a transaction
2. Wait 30 seconds (mining interval)
3. Worker should automatically mine the block
4. Check logs: `tail -f blockchain-service/worker.log`

### Scenario 3: Blockchain Persistence

1. Create and mine some transactions
2. Stop blockchain service
3. Restart blockchain service
4. Verify blockchain is loaded from database: `curl http://localhost:5001/chain`

### Scenario 4: Transaction Failure Handling

1. Stop blockchain service
2. Create a transaction through frontend
3. Transaction should complete but `blockchainStatus` will be "failed"
4. Restart blockchain service
5. Transaction is still in MongoDB but not on blockchain

## Troubleshooting Tests

### If wallet creation fails:

```bash
# Check blockchain service
curl http://localhost:5001/health

# Check logs
tail -n 50 blockchain-service/blockchain.log
```

### If transaction not on blockchain:

```bash
# Check pending transactions
curl http://localhost:5001/pending

# Manually trigger mining
curl -X POST http://localhost:5001/mine

# Check blockchain status in MongoDB
mongosh
use carbonEase
db.transactions.find({blockchainTxHash: {$exists: true}})
```

### If mining worker not working:

```bash
# Check if worker is running
ps aux | grep worker.py

# Check worker logs
tail -f blockchain-service/worker.log

# Restart worker
cd blockchain-service
source venv/bin/activate
python worker.py
```

## Performance Testing

### Load test with multiple transactions:

```bash
# Create 10 transactions quickly
for i in {1..10}; do
  curl -X POST http://localhost:5001/transaction/create \
    -H "Content-Type: application/json" \
    -d "{
      \"sender\": \"0x123$i\",
      \"receiver\": \"0x456$i\",
      \"amount\": $((1000 + $i * 100)),
      \"listing_id\": \"test-$i\",
      \"quantity\": $((10 + $i)),
      \"price_per_credit\": 50
    }"
  echo ""
done

# Mine all at once
curl -X POST http://localhost:5001/mine
```

## Success Criteria

✅ Blockchain service is healthy
✅ Wallets are created automatically for users
✅ Transactions are recorded in pending pool
✅ Mining worker mines blocks automatically
✅ Transactions are confirmed on blockchain
✅ MongoDB has blockchain transaction hashes
✅ Blockchain data persists across restarts
✅ Smart contract validates transactions
✅ Frontend shows transaction status

## Next Steps

After successful testing:

1. **Monitor production usage**
2. **Set up blockchain backup strategy**
3. **Configure mining interval based on load**
4. **Implement transaction fee system**
5. **Add blockchain explorer UI**
6. **Set up monitoring and alerts**

## Resources

- Blockchain API: http://localhost:5001
- API Documentation: [blockchain-service/README.md](../blockchain-service/README.md)
- Integration Guide: [BLOCKCHAIN_INTEGRATION.md](../BLOCKCHAIN_INTEGRATION.md)

---

**Note:** This is a development/testing blockchain. For production, implement additional security measures and consensus mechanisms.
